import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CoursePartForm from '../../components/CoursePartForm/CoursePartForm';
import CoursePartList from '../../components/CoursePartList/CoursePartList';
import Container from '../../ui/Container/Container';

import { IoIosArrowBack } from 'react-icons/io';

const tg = window.Telegram.WebApp;

function LessonPage() {
  const [lessons, setLessons]: any = useState([
    {
      id: '1',
      name: 'Lesson React courses',
      description: 'This lesson for React to Shop-courses',
      courseId: '4',
      moduleId: '1',
    },
    {
      id: '2',
      name: 'Lesson 2 React courses',
      description: 'This 2 lesson for React to Shop-courses',
      courseId: '4',
      moduleId: '1',
    },
  ]);

  const [isForm, setIsForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const toggleForm = () => {
      setIsForm(!isForm);
    };

    tg.MainButton.setParams({
      text: 'Create new lesson',
    });
    tg.onEvent('mainButtonClicked', toggleForm);
    return () => tg.offEvent('mainButtonClicked', toggleForm);
  }, [isForm]);

  useEffect(() => {
    if (isForm) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [isForm]);

  return (
    <Container>
      <IoIosArrowBack
        onClick={() => navigate(-1)}
        style={{ cursor: 'pointer' }}
        size={20}
      />
      <CoursePartList
        type="lessons"
        lessons={lessons}
        setLessons={setLessons}
      />
      {isForm && (
        <CoursePartForm
          type="lessons"
          lessons={lessons}
          setLessons={setLessons}
          isForm={isForm}
          setIsForm={setIsForm}
        />
      )}
    </Container>
  );
}

export default LessonPage;
