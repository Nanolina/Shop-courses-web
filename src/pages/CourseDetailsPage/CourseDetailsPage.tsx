import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { data } from '../../data';
import Container from '../../ui/Container/Container';
import Label from '../../ui/Label/Label';

const tg = window.Telegram.WebApp;

function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const course = data.find((course) => course.id === id);

  useEffect(() => {
    tg.MainButton.text = 'Add to cart';
    tg.MainButton.color = '#5fe7ae';
    tg.MainButton.textColor = '#000000';
    tg.MainButton.show();
  }, []);

  if (!course) {
    return <div>Course is not found</div>;
  }
  return (
    <>
      <Header label="Explore course" />
      <Container>
        <img src={course.image} alt="Course" width="100%" height="50%" />
        <Label text={course.name} />
        <div>{course.description}</div>
      </Container>
    </>
  );
}

export default CourseDetailsPage;
