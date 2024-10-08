import { useTWAEvent } from '@tonsolutions/telemetree-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import CoursesList from '../../components/CoursesList/CoursesList';
import Points from '../../components/Points/Points';
import Container from '../../ui/Container/Container';

const tg = window.Telegram.WebApp;

const MainPage: React.FC = () => {
  const eventBuilder = useTWAEvent();
  const navigate = useNavigate();

  eventBuilder.track('Main page visit', {});

  useEffect(() => {
    tg.MainButton.hide();
  }, [navigate]);

  return (
    <Container>
      <Points />
      <CoursesList />
    </Container>
  );
};

export default MainPage;
