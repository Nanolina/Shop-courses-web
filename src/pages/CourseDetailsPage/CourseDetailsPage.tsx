import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { data } from '../../data';
import Container from '../../ui/Container/Container';
import Label from '../../ui/Label/Label';
import styles from './CourseDetailsPage.module.css';

const tg = window.Telegram.WebApp;

function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const course = data.find((course) => course.id === id);

  useEffect(() => {
    if (course) {
      tg.MainButton.text = `Buy for ${course.price} ${course.currency}`;
      tg.MainButton.show();
    }
  }, [course]);

  if (!course) {
    return <div>Course is not found</div>;
  }

  return (
    <>
      <Header label="Explore course" isLabelRight />
      <Container grayContainer={false}>
        <img src={course.image} alt="Course" width="100%" height="50%" />
        <Label text={course.name} />
        <div className={styles.description}>{course.description}</div>
      </Container>
    </>
  );
}

export default CourseDetailsPage;
