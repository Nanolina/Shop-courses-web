import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import { useNotification } from './context';
import NotificationProvider from './context/NotificationContext';
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

const tg = window.Telegram.WebApp;
const serverUrl = process.env.REACT_APP_SERVER_URL || '';
const manifestUrl = `${process.env.REACT_APP_WEB_URL}/tonconnect-manifest.json`;

function App() {
  const { showNotification } = useNotification();

  useEffect(() => {
    tg.ready();
    tg.setHeaderColor('secondary_bg_color');
  }, []);

  // To receive notifications when a video is successfully uploaded to Cloudinary
  useEffect(() => {
    const socket = io(serverUrl);

    socket.on('notification', (data) => {
      const { message, status } = data;
      showNotification(message, status);
    });

    return () => {
      socket.off('notification');
      socket.close();
    };
  }, [showNotification]);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
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
      </Router>
    </TonConnectUIProvider>
  );
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
  <NotificationProvider>
    <App />
  </NotificationProvider>
);
