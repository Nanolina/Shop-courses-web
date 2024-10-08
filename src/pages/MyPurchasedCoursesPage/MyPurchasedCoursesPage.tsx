import { useQuery, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CourseItem from '../../components/CourseItem/CourseItem';
import Points from '../../components/Points/Points';
import { filterCourses } from '../../functions/filterCourses';
import { fetchAllMyPurchasedCourses } from '../../requests';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import SearchBar from '../../ui/SearchBar/SearchBar';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';

const tg = window.Telegram.WebApp;

function MyPurchasedCoursesPage() {
  const { t } = useTranslation();
  const { initDataRaw } = retrieveLaunchParams();
  const [value, setValue] = useState<string>('');
  const queryClient = useQueryClient();

  const {
    data: courses = [],
    error,
    isLoading,
    isError,
  } = useQuery<ICourse[], Error>({
    queryKey: ['myPurchasedCourses', initDataRaw],
    queryFn: () => fetchAllMyPurchasedCourses(initDataRaw),
    enabled: !!initDataRaw,
    placeholderData: () => {
      return queryClient.getQueryData(['myPurchasedCourses', initDataRaw]);
    },
  });

  const filteredCourses = useMemo(
    () => filterCourses(courses, value),
    [courses, value]
  );

  useEffect(() => {
    tg.MainButton.hide();
  }, []);

  if (!courses.length && !isLoading) {
    return isError ? (
      <ItemNotFoundPage error={error?.message} isLoading={isLoading} />
    ) : (
      <ItemNotFoundPage
        error={`😊 ${t('not_purchased')} 📚✨`}
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
      {isLoading && <Loader />}
      {isError && <MessageBox errorMessage={error.message} />}
    </Container>
  );
}

export default MyPurchasedCoursesPage;
