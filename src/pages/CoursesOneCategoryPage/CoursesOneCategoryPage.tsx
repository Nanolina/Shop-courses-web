import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CourseItem from '../../components/CourseItem/CourseItem';
import Header from '../../components/Header/Header';
import Points from '../../components/Points/Points';
import { capitalizeFirstLetter } from '../../functions';
import { filterCourses } from '../../functions/filterCourses';
import { fetchAllCoursesByOneCategoryAPI } from '../../requests';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import SearchBar from '../../ui/SearchBar/SearchBar';

function CoursesOneCategoryPage() {
  const { t } = useTranslation();

  const { category = '' } = useParams<{ category: string }>();
  const [value, setValue] = useState<string>('');

  const queryClient = useQueryClient();
  const {
    data = [],
    error,
    isLoading,
  } = useQuery<ICourse[]>({
    queryKey: ['coursesByOneCategory', category],
    queryFn: () => fetchAllCoursesByOneCategoryAPI(category),
    enabled: !!category,
    placeholderData: () => {
      return queryClient.getQueryData(['coursesByOneCategory', category]);
    },
  });

  const filteredCourses = useMemo(
    () => filterCourses(data, value),
    [data, value]
  );

  return (
    <Container>
      <Header label={capitalizeFirstLetter(t(`categories.${category}`))} />
      <Points />
      <SearchBar
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
      />
      <div className="coursesContainer">
        {filteredCourses.map((course: any) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>

      {error && <MessageBox errorMessage={error.message} />}
      {isLoading && <Loader />}
    </Container>
  );
}

export default CoursesOneCategoryPage;
