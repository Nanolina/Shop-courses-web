import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import {
  TwaAnalyticsProvider,
  useTWAEvent,
} from '@tonsolutions/telemetree-react';
import { Suspense, lazy, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import ModalEarnPoints from './components/ModalEarnPoints/ModalEarnPoints';
import {
  ContractProvider,
  ModalProvider,
  PointsProvider,
  useContract,
  useNotification,
  usePoints,
} from './context';
import NotificationProvider from './context/NotificationContext';
import i18n from './i18n/i18n';
import { DeployEnum } from './types';
import { Loader } from './ui/Loader/Loader';

// Ленивая загрузка страниц
const CourseDetailsPage = lazy(
  () => import('./pages/CourseDetailsPage/CourseDetailsPage')
);
const CoursesOneCategoryPage = lazy(
  () => import('./pages/CoursesOneCategoryPage/CoursesOneCategoryPage')
);
const CreateCourseFormPage = lazy(
  () => import('./pages/CreateCourseFormPage/CreateCourseFormPage')
);
const CreateCoursePartPage = lazy(
  () => import('./pages/CreateCoursePartPage/CreateCoursePartPage')
);
const EditCourseFormPage = lazy(
  () => import('./pages/EditCourseFormPage/EditCourseFormPage')
);
const EditCoursePartPage = lazy(
  () => import('./pages/EditCoursePartPage/EditCoursePartPage')
);
const LessonPage = lazy(() => import('./pages/LessonPage/LessonPage'));
const LessonsPage = lazy(() => import('./pages/LessonsPage/LessonsPage'));
const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const ModulesPage = lazy(() => import('./pages/ModulesPage/ModulesPage'));
const MyCreatedCoursesPage = lazy(
  () => import('./pages/MyCreatedCoursesPage/MyCreatedCoursesPage')
);
const MyPurchasedCoursesPage = lazy(
  () => import('./pages/MyPurchasedCoursesPage/MyPurchasedCoursesPage')
);

const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';
const tg = window.Telegram.WebApp;
const serverUrl = process.env.REACT_APP_SERVER_URL || '';
const manifestUrl = `${process.env.REACT_APP_WEB_URL}/tonconnect-manifest.json`;

// Создаем клиент для React Query
const queryClient = new QueryClient();

function App() {
  const eventBuilder = useTWAEvent();
  const { showNotification } = useNotification();
  const { initData } = retrieveLaunchParams();
  const { refreshPoints, setPoints } = usePoints();
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
      const { status, userId, message } = data;
      if (initData?.user?.id === userId) showNotification(message, status);
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
      const { status, userId, message, type, balance, points } = data;
      if (initData?.user?.id === userId) {
        showNotification(message, status);

        if (points) {
          setPoints(points);
        }

        if (balance && type) {
          if (type === DeployEnum.Create) {
            eventBuilder.track('Course activated', {});
            setCourseContractBalance(balance);
          } else {
            eventBuilder.track('Course purchased', {});
            setPurchaseContractBalance(balance);
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
    refreshPoints,
    setPoints,
    setCourseContractBalance,
    setPurchaseContractBalance,
    eventBuilder,
  ]);

  // Language
  useEffect(() => {
    i18n.changeLanguage(initData?.user?.languageCode || 'en');
  }, [initData?.user?.languageCode]);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* all users */}
                <Route path="/" element={<MainPage />} />
                <Route
                  path="/course/:courseId"
                  element={<CourseDetailsPage />}
                />
                <Route
                  path="course/category/:category"
                  element={<CoursesOneCategoryPage />}
                />
                <Route
                  path="/course/create"
                  element={<CreateCourseFormPage />}
                />
                {/* seller */}
                <Route
                  path="/course/edit/:courseId"
                  element={<EditCourseFormPage />}
                />
                <Route
                  path="/course-part/create/:type/:parentId"
                  element={<CreateCoursePartPage />}
                />
                <Route
                  path="/course-part/edit/:parentId/:type/:itemId"
                  element={<EditCoursePartPage />}
                />
                <Route
                  path="/course/created"
                  element={<MyCreatedCoursesPage />}
                />
                {/* customer */}
                <Route
                  path="/course/purchased"
                  element={<MyPurchasedCoursesPage />}
                />
                {/* customer & seller */}
                <Route
                  path="/module/course/:courseId"
                  element={<ModulesPage />}
                />
                <Route
                  path="/lesson/module/:moduleId"
                  element={<LessonsPage />}
                />
                <Route path="/lesson/:lessonId" element={<LessonPage />} />
              </Routes>
            </Suspense>
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
            <ModalEarnPoints />
          </Router>
          {!isProduction && <ReactQueryDevtools />}
        </QueryClientProvider>
      </I18nextProvider>
    </TonConnectUIProvider>
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
    <NotificationProvider>
      <PointsProvider>
        <ContractProvider>
          <ModalProvider>
            <App />
          </ModalProvider>
        </ContractProvider>
      </PointsProvider>
    </NotificationProvider>
  </TwaAnalyticsProvider>
);
