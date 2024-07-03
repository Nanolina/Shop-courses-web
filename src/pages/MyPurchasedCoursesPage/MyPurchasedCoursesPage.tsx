import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CourseItem from '../../components/CourseItem/CourseItem';
import Points from '../../components/Points/Points';
import { createAxiosWithAuth, handleAuthError } from '../../functions';
import { filterCourses } from '../../functions/filterCourses';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import SearchBar from '../../ui/SearchBar/SearchBar';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import styles from './MyPurchasedCoursesPage.module.css';

const tg = window.Telegram.WebApp;

function MyPurchasedCoursesPage() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false); // State to track the completion of data loading
  const [error, setError] = useState<string>('');
  const [value, setValue] = useState<string>('');

  const filteredCourses = filterCourses(courses, value);

  const { initDataRaw } = retrieveLaunchParams();

  async function getAllMyPurchasedCourses() {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<ICourse[]>('/course/purchased');
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
    getAllMyPurchasedCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    tg.MainButton.hide();
  }, []);

  if (isLoading) return <Loader />;

  if (!courses.length && !isLoading && isLoaded) {
    return (
      <ItemNotFoundPage
        error={error || `😊 ${t('not_purchased')} 📚✨`}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Container>
      <Points />
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

export default MyPurchasedCoursesPage;
