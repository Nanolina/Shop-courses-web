import { useQuery } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CourseItem from '../../components/CourseItem/CourseItem';
import Points from '../../components/Points/Points';
import { fetchAllMyCreatedCourses } from '../../functions';
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
  const { initDataRaw } = retrieveLaunchParams();

  const [value, setValue] = useState<string>('');

  const {
    data: courses = [],
    error,
    isLoading,
    isError,
  } = useQuery<ICourse[], Error>({
    queryKey: ['myCreatedCourses', initDataRaw],
    queryFn: () => fetchAllMyCreatedCourses(initDataRaw),
    enabled: !!initDataRaw,
  });

  const filteredCourses = useMemo(
    () => filterCourses(courses, value),
    [courses, value]
  );

  useEffect(() => {
    tg.MainButton.hide();
  }, []);

  if (isLoading) return <Loader />;

  if (!courses.length && !isLoading) {
    return isError ? (
      <ItemNotFoundPage error={error?.message} isLoading={isLoading} />
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
      {isError && <MessageBox errorMessage={error.message} />}
    </Container>
  );
}

export default MyCreatedCoursesPage;
