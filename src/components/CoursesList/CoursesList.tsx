import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { fetchAllCoursesAPI, groupCoursesByCategory } from '../../functions';
import { filterCourses } from '../../functions/filterCourses.ts';
import { ICourse } from '../../types.ts';
import { MessageBox } from '../../ui/MessageBox/MessageBox.tsx';
import SearchBar from '../../ui/SearchBar/SearchBar.tsx';
import CoursesListByCategory from '../CoursesListByCategory/CoursesListByCategory.tsx';
import styles from './CoursesList.module.css';

const CoursesList = () => {
  const [value, setValue] = useState<string>('');

  const queryClient = useQueryClient();
  const { data, error } = useQuery<ICourse[]>({
    queryKey: ['allCourses'],
    queryFn: fetchAllCoursesAPI,
    placeholderData: () => {
      return queryClient.getQueryData(['allCourses']);
    },
  });

  const filteredCourses = useMemo(
    () => filterCourses(data || [], value),
    [data, value]
  );

  // Grouping data by categories
  const groupedData = useMemo(
    () => groupCoursesByCategory(filteredCourses),
    [filteredCourses]
  );

  return (
    <>
      <SearchBar
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setValue(event.target.value)
        }
      />
      <div className={styles.container}>
        {Object.entries(groupedData).map(([category, courses]) => (
          <CoursesListByCategory
            category={category}
            courses={courses as ICourse[]}
            key={category}
          />
        ))}
        {error && <MessageBox errorMessage={error.message} />}
      </div>
    </>
  );
};

export default CoursesList;
