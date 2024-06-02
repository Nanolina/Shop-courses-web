import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { io } from 'socket.io-client';
import CourseDetailsPage from './pages/CourseDetailsPage/CourseDetailsPage';
import CoursesOneCategoryPage from './pages/CoursesOneCategoryPage/CoursesOneCategoryPage';
import { default as CreateCourseFormPage } from './pages/CreateCourseFormPage/CreateCourseFormPage';
import EditCourseFormPage from './pages/EditCourseFormPage/EditCourseFormPage';
import EditPartCoursePage from './pages/EditPartCoursePage/EditPartCoursePage';
import LessonPage from './pages/LessonPage/LessonPage';
import LessonsPage from './pages/LessonsPage/LessonsPage';
import MainPage from './pages/MainPage/MainPage';
import ModulesPage from './pages/ModulesPage/ModulesPage';
import MyCreatedCoursesPage from './pages/MyCreatedCoursesPage/MyCreatedCoursesPage';

const tg = window.Telegram.WebApp;
const serverUrl = process.env.REACT_APP_SERVER_URL || '';
const manifestUrl = `${serverUrl}/tonconnect-manifest.json`;

function App() {
  useEffect(() => {
    tg.ready();
    tg.setHeaderColor('secondary_bg_color');
  }, []);

  // To receive notifications when a video is successfully uploaded to Cloudinary
  useEffect(() => {
    const socket = io(serverUrl);

    socket.on('notification', (data) => {
      const { message, status } = data;
      if (status === 'success') {
        toast.success(message);
      } else if (status === 'error') {
        toast.error(message);
      } else {
        toast(message);
      }
    });

    return () => {
      socket.off('notification');
      socket.close();
    };
  }, []);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/course/:courseId" element={<CourseDetailsPage />} />
          <Route
            path="course/category/:category"
            element={<CoursesOneCategoryPage />}
          />
          <Route path="/course/create" element={<CreateCourseFormPage />} />
          <Route
            path="/course/edit/:courseId"
            element={<EditCourseFormPage />}
          />
          <Route path="/course/created" element={<MyCreatedCoursesPage />} />
          <Route path="/course/purchased" element={<MyCreatedCoursesPage />} />
          <Route path="/module/course/:courseId" element={<ModulesPage />} />
          <Route path="/lesson/module/:moduleId" element={<LessonsPage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
          <Route
            path="/course-part/:type/:itemId"
            element={<EditPartCoursePage />}
          />
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

export default App;
