import React, { useEffect, useState } from 'react'; //UseState for Modal! Before deleted !
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import CoursesList from '../../components/CoursesList/CoursesList';
import Modal from '../../components/ModalWindow/Modal';
import Container from '../../ui/Container/Container';
import SearchBar from '../../ui/SearchBar/SearchBar';

const tg = window.Telegram.WebApp;

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false); // This el for Modal! Before deleted !

  function confirm() {
    console.log('Work!');
  }

  useEffect(() => {
    tg.MainButton.hide();
  }, [navigate]);

  return (
    <Container>
      <SearchBar />
      <CoursesList />
      <div>
        <button onClick={() => setModalOpen(true)}>
          Открыть модальное окно
        </button>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          content={<p>Вы уверены, что хотите удалить это?</p>}
          confirm={confirm}
        />
      </div>
    </Container>
  );
};

export default MainPage;
