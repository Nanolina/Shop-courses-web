import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import CoursesList from '../../components/CoursesList/CoursesList';
import Container from '../../ui/Container/Container';
import SearchBar from '../../ui/SearchBar/SearchBar';

const tg = window.Telegram.WebApp;

const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    tg.MainButton.hide();
  }, [navigate]);

  return (
    <>
      <Container>
        <SearchBar />
        <CoursesList />
      </Container>
    </>
  );
};

export default MainPage;
