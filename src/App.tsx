import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CourseDetailsPage from './pages/CourseDetailsPage/CourseDetailsPage';
import { default as CreateCourseFormPage } from './pages/CreateCourseFormPage/CreateCourseFormPage';
import LessonsPage from './pages/LessonsPage/LessonsPage';
import MainPage from './pages/MainPage/MainPage';
import ModulesPage from './pages/ModulesPage/ModulesPage';
import MyCreatedCoursesPage from './pages/MyCreatedCoursesPage/MyCreatedCoursesPage';

const tg = window.Telegram.WebApp;
const manifestUrl =
  `${process.env.REACT_APP_WEB_URL}/tonconnect-manifest.json`;

function App() {
  useEffect(() => {
    tg.ready();
    tg.setHeaderColor('secondary_bg_color');
  }, []);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/course/:courseId" element={<CourseDetailsPage />} />
        <Route path="/course/create" element={<CreateCourseFormPage />} />
        <Route path="/course/user/:userId" element={<MyCreatedCoursesPage />} />
        <Route path="/course/:courseId/module" element={<ModulesPage />} />
        <Route path="/module/:moduleId/lesson" element={<LessonsPage />} />
      </Routes>
    </Router>
    </TonConnectUIProvider>
  );
}

export default App;
