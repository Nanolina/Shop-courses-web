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
import { filterCourses } from '../../functions/filterCourses';

const tg = window.Telegram.WebApp;

function MyCreatedCoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false); // State to track the completion of data loading
  const [error, setError] = useState<string>('');
  const { initDataRaw } = retrieveLaunchParams();
  const [value, setValue] = useState<string>('');

  const filteredCourses = filterCourses(courses, value);

  async function getAllMyCreatedCourses() {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<ICourse[]>('/course/created');
      setCourses(response.data);
      setIsLoaded(true);
    } catch (error: any) {
      handleAuthError(error, setError);
      setIsLoaded(true);
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

  if (!courses.length && !isLoading && isLoaded) {
    return <ItemNotFoundPage error={error} isLoading={isLoading} />;
  }

  return (
    <Container>
      <SearchBar
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
      />
      <div className={styles.container}>
        {filteredCourses.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
      {error && <MessageBox errorMessage={error} />}
    </Container>
  );
}

export default MyCreatedCoursesPage;
