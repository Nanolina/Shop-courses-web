import { useMemo } from 'react';
import { data } from '../../data.ts';
import { ICourse } from '../../types.ts';
import CoursesListByCategory from '../CoursesListByCategory/CoursesListByCategory.tsx';
import styles from './CoursesList.module.css';

const CoursesList = () => {
  // Grouping data by categories
  const groupedData = useMemo(() => {
    return data.reduce<Record<string, ICourse[]>>((acc, course) => {
      acc[course.category] = acc[course.category] || [];
      acc[course.category].push(course);
      return acc;
    }, {});
  }, []);

  return (
    <div className={styles.container}>
      {Object.entries(groupedData).map(([category, courses]) => (
        <CoursesListByCategory
          category={category}
          courses={courses}
          key={category}
        />
      ))}
    </div>
  );
};

export default CoursesList;
