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

const tg = window.Telegram.WebApp;

function MyCreatedCoursesPage() {
  const { t } = useTranslation();
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
    return error ? (
      <ItemNotFoundPage error={error} isLoading={isLoading} />
    ) : (
      <ItemNotFoundPage
        error={`😊 ${t('not_created')} 📚✨`}
        isLoading={isLoading}
        hasButtonBackHeader={false}
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
      <div className="coursesContainer">
        {filteredCourses.map((course) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
      {error && <MessageBox errorMessage={error} />}
    </Container>
  );
}

export default MyCreatedCoursesPage;
