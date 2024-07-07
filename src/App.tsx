import { retrieveLaunchParams } from '@tma.js/sdk';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { TwaAnalyticsProvider } from '@tonsolutions/telemetree-react';
import { useEffect } from 'react';
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
import { DeployEnum } from './types';

const tg = window.Telegram.WebApp;
const serverUrl = process.env.REACT_APP_SERVER_URL || '';
const manifestUrl = `${process.env.REACT_APP_WEB_URL}/tonconnect-manifest.json`;

function App() {
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
            setCourseContractBalance(balance);
          } else {
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
  ]);

  // Language
  useEffect(() => {
    i18n.changeLanguage(initData?.user?.languageCode || 'en');
  }, [initData?.user?.languageCode]);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <I18nextProvider i18n={i18n}>
        <Router>
          <Routes>
            {/* all users */}
            <Route path="/" element={<MainPage />} />
            <Route path="/course/:courseId" element={<CourseDetailsPage />} />
            <Route
              path="course/category/:category"
              element={<CoursesOneCategoryPage />}
            />
            <Route path="/course/create" element={<CreateCourseFormPage />} />
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
            <Route path="/course/created" element={<MyCreatedCoursesPage />} />
            {/* customer */}
            <Route
              path="/course/purchased"
              element={<MyPurchasedCoursesPage />}
            />
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
          <ModalEarnPoints />
        </Router>
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
