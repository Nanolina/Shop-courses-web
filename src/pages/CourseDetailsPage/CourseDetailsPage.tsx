import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { data } from '../../data';
import Button from '../../ui/Button/Button';
import Container from '../../ui/Container/Container';
import Label from '../../ui/Label/Label';
import styles from './CourseDetailsPage.module.css';

function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const course = data.find((course) => course.id === id);
  if (!course) {
    return <div>Course is not found</div>;
  }

  return (
    <>
      <Header label="Explore course" />
      <Container>
        <img src={course.image} alt="Course" width="100%" height="50%" />
        <Label text={course.name} />
        <div className={styles.description}>{course.description}</div>
        <div className={styles.buttonsContainer}>
          <Button text="Add to cart" />
        </div>
      </Container>
    </>
  );
}

export default CourseDetailsPage;
