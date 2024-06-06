import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CourseItem from '../../components/CourseItem/CourseItem';
import Header from '../../components/Header/Header';
import { capitalizeFirstLetter } from '../../functions';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import styles from './CoursesOneCategoryPage.module.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;

function CoursesOneCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  async function getAllCoursesOneCategory() {
    try {
      const allCoursesApiUrl = `${serverUrl}/course/category/${category}`;
      const response = await axios.get(allCoursesApiUrl);
      setCourses(response.data);
      return response.data;
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllCoursesOneCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader />;

  return (
    <Container>
      <Header label={capitalizeFirstLetter(category)} />
      <div className={styles.container}>
        {courses.map((course: any) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
      {error && <MessageBox errorMessage={error} />}
    </Container>
  );
}

export default CoursesOneCategoryPage;
