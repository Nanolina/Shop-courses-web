import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CourseDetailsPage from './pages/CourseDetailsPage/CourseDetailsPage';
import { default as CreateCourseFormPage } from './pages/CreateCourseFormPage/CreateCourseFormPage';
import MainPage from './pages/MainPage/MainPage';
import MyCreatedCoursesPage from './pages/MyCreatedCoursesPage/MyCreatedCoursesPage';
import ModulesPage from './pages/ModulesPage/ModulesPage';

const tg = window.Telegram.WebApp;

function App() {
  useEffect(() => {
    tg.ready();
    tg.setHeaderColor('secondary_bg_color');
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/course/:id" element={<CourseDetailsPage />} />
        <Route path="/course/create" element={<CreateCourseFormPage />} />
        <Route path="/course/user/:userId" element={<MyCreatedCoursesPage />} />
        <Route path="/module" element={<ModulesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
