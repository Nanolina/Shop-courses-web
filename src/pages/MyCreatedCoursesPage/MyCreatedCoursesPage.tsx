import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import CourseItem from '../../components/CourseItem/CourseItem';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import SearchBar from '../../ui/SearchBar/SearchBar';
import { createAxiosWithAuth } from '../../utils';
import styles from './MyCreatedCoursePage.module.css';

const tg = window.Telegram.WebApp;

function MyCreatedCoursesPage() {
  const [coursesData, setCoursesData] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { initDataRaw } = retrieveLaunchParams();

  async function getAllMyCreatedCourses() {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<ICourse[]>('/course/created');
      setIsLoading(false);
      setCoursesData(response.data);
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getAllMyCreatedCourses();
    tg.MainButton.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  if (coursesData.length === 0) {
    return <div>You don't have any courses created</div>;
  }

  return (
    <Container>
      <SearchBar />
      <div className={styles.container}>
        {coursesData.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
    </Container>
  );
}

export default MyCreatedCoursesPage;
