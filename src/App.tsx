import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import {
  TwaAnalyticsProvider,
  useTWAEvent,
} from '@tonsolutions/telemetree-react';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import {
  ContractProvider,
  PointsProvider,
  useContract,
  useNotification,
  usePoints,
} from './context';
import NotificationProvider from './context/NotificationContext';
import i18n from './i18n/i18n';
import CourseDetailsPage from './pages/CourseDetailsPage/CourseDetailsPage';
import CoursesOneCategoryPage from './pages/CoursesOneCategoryPage/CoursesOneCategoryPage';
import { default as CreateCourseFormPage } from './pages/CreateCourseFormPage/CreateCourseFormPage';
import CreateCoursePartPage from './pages/CreateCoursePartPage/CreateCoursePartPage';
import EditCourseFormPage from './pages/EditCourseFormPage/EditCourseFormPage';
import EditCoursePartPage from './pages/EditCoursePartPage/EditCoursePartPage';
import LessonPage from './pages/LessonPage/LessonPage';
import LessonsPage from './pages/LessonsPage/LessonsPage';
import MainPage from './pages/MainPage/MainPage';
import ModulesPage from './pages/ModulesPage/ModulesPage';
import MyCreatedCoursesPage from './pages/MyCreatedCoursesPage/MyCreatedCoursesPage';
import MyPurchasedCoursesPage from './pages/MyPurchasedCoursesPage/MyPurchasedCoursesPage';
import UserPage from './pages/UserPage/UserPage';
import { DeployEnum } from './types';

const tg = window.Telegram.WebApp;
const serverUrl = process.env.REACT_APP_SERVER_URL || '';
const manifestUrl = `${process.env.REACT_APP_WEB_URL}/tonconnect-manifest.json`;

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  const eventBuilder = useTWAEvent();
  const { showNotification } = useNotification();
  const { initData, initDataRaw } = retrieveLaunchParams();
  const { refreshPoints } = usePoints();
  const { setCourseContractBalance, setPurchaseContractBalance } =
    useContract();

  useEffect(() => {
    tg.ready();
    tg.setHeaderColor('secondary_bg_color');
  }, []);

  // To receive notifications from backend if the video is uploaded to Cloudinary
  useEffect(() => {
    const socket = io(serverUrl);

    socket.on('video-uploaded', (data) => {
      const { status, userId, lessonId, message } = data;
      if (initData?.user?.id === userId) {
        showNotification(message, status);
        queryClient.invalidateQueries({
          queryKey: ['lesson', lessonId],
        });
      }
    });

    return () => {
      socket.off('video-uploaded');
      socket.close();
    };
  }, [showNotification, initData?.user?.id]);

  // To receive notifications from backend if the smart contract balance is updated (points have been credited)
  useEffect(() => {
    const socket = io(serverUrl);

    socket.on('contract-updated', (data) => {
      const { status, userId, courseId, message, type, balance, points } = data;
      if (initData?.user?.id === userId) {
        showNotification(message, status);

        if (points) {
          refreshPoints();
        }

        if (balance && type && courseId) {
          if (type === DeployEnum.Create) {
            eventBuilder.track('Course activated', {});
            setCourseContractBalance(balance);
            queryClient.invalidateQueries({
              queryKey: ['courseDetails', courseId],
            });
          } else {
            eventBuilder.track('Course purchased', {});
            setPurchaseContractBalance(balance);
            queryClient.invalidateQueries({
              queryKey: ['courseDetails', courseId],
            });
            queryClient.invalidateQueries({
              queryKey: ['myPurchasedCourses', initDataRaw],
            });
            queryClient.invalidateQueries({
              queryKey: ['modules', courseId],
            });
          }
        }
      }
    });

    return () => {
      socket.off('contract-updated');
      socket.close();
    };
  }, [
    showNotification,
    initData?.user?.id,
    initDataRaw,
    refreshPoints,
    setCourseContractBalance,
    setPurchaseContractBalance,
    eventBuilder,
  ]);

  // Language
  useEffect(() => {
    i18n.changeLanguage(initData?.user?.languageCode || 'en');
  }, [initData?.user?.languageCode]);

  return (
    <Router>
      <Routes>
        {/* all users */}
        <Route path="/" element={<MainPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/course/:courseId" element={<CourseDetailsPage />} />
        <Route
          path="course/category/:category"
          element={<CoursesOneCategoryPage />}
        />
        <Route path="/course/create" element={<CreateCourseFormPage />} />
        {/* seller */}
        <Route path="/course/edit/:courseId" element={<EditCourseFormPage />} />
        <Route
          path="/course-part/create/:type/:parentId"
          element={<CreateCoursePartPage />}
        />
        <Route
          path="/course-part/edit/:parentId/:type/:itemId"
          element={<EditCoursePartPage />}
        />
        <Route path="/course/created" element={<MyCreatedCoursesPage />} />
        {/* customer */}
        <Route path="/course/purchased" element={<MyPurchasedCoursesPage />} />
        {/* customer & seller */}
        <Route path="/module/course/:courseId" element={<ModulesPage />} />
        <Route path="/lesson/module/:moduleId" element={<LessonsPage />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </Router>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
  <TwaAnalyticsProvider
    projectId={
      process.env.REACT_APP_TELEMETREE_PROJECT_ID || 'courses_project_id'
    }
    apiKey={process.env.REACT_APP_TELEMETREE_API_KEY || 'courses_api_key'}
    appName={
      process.env.REACT_APP_TELEMETREE_APPLICATION_NAME || 'courses_app_name'
    }
  >
    <QueryClientProvider client={queryClient}>
      <PointsProvider>
        <NotificationProvider>
          <ContractProvider>
            <I18nextProvider i18n={i18n}>
              <TonConnectUIProvider manifestUrl={manifestUrl}>
                <App />
              </TonConnectUIProvider>
            </I18nextProvider>
          </ContractProvider>
        </NotificationProvider>
      </PointsProvider>
      {process.env.REACT_QUERY_DEVTOOLS && <ReactQueryDevtools />}
    </QueryClientProvider>
  </TwaAnalyticsProvider>
);
