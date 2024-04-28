import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CourseDetailsPage from './pages/CourseDetailsPage/CourseDetailsPage';
import CreateFormPage from './pages/CreateFormPage/CreateFormPage';
import MainPage from './pages/MainPage/MainPage';

const tg = window.Telegram.WebApp;

function App() {
  useEffect(() => {
    tg.ready();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/course/:id" element={<CourseDetailsPage />} />
        <Route path="/create" element={<CreateFormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
