import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import styles from './CourseDetailsPage.module.css';

const tg = window.Telegram.WebApp;
const serverUrl = process.env.REACT_APP_SERVER_URL;

function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function getCourseDetails() {
    try {
      const courseApiUrl = `${serverUrl}/course/${id}`;
      const response = await axios.get(courseApiUrl);
      setCourse(response.data);
      setIsLoading(false);
      return response.data;
    } catch (error: any) {
      setError(error?.message || error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (course) {
      tg.MainButton.setParams({
        text: `Buy for ${course.price} ${course.currency}`,
      });

      tg.MainButton.show();
    }
  }, [course]);

  if (isLoading) return <Loader />;
  if (!course) {
    return <p>Course is not found</p>;
  }
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Header label="Explore course" isLabelRight />
      <img src={course.image?.url} alt="Course" width="100%" height="50%" />
      <Container grayContainer={false}>
        <Label text={course.name} />
        <div className={styles.description}>{course.description}</div>
      </Container>
    </>
  );
}

export default CourseDetailsPage;
