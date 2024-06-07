import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import CourseItem from '../../components/CourseItem/CourseItem';
import { createAxiosWithAuth, handleAuthError } from '../../functions';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import SearchBar from '../../ui/SearchBar/SearchBar';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import styles from './MyCreatedCoursePage.module.css';

const tg = window.Telegram.WebApp;

function MyCreatedCoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { initDataRaw } = retrieveLaunchParams();

  async function getAllMyCreatedCourses() {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<ICourse[]>('/course/created');
      setCourses(response.data);
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllMyCreatedCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    tg.MainButton.hide();
  }, []);

  if (isLoading) return <Loader />;

  if (!isLoading && !courses.length) {
    return <ItemNotFoundPage error={error} />;
  }

  return (
    <Container>
      <SearchBar />
      <div className={styles.container}>
        {courses.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
      {error && <MessageBox errorMessage={error} />}
    </Container>
  );
}

export default MyCreatedCoursesPage;
