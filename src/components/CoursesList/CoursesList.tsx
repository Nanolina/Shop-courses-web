import { useEffect, useMemo, useState } from 'react';
import { data } from '../../data.ts';
import { ICourse } from '../../types.ts';
import CoursesListByCategory from '../CoursesListByCategory/CoursesListByCategory.tsx';
import styles from './CoursesList.module.css';

const CoursesList = () => {
  // const [coursesData, setCoursesData] = useState<ICourse[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState('');

  // Grouping data by categories
  const groupedData = useMemo<Record<string, ICourse[]>>(() => {
    return data.reduce<Record<string, ICourse[]>>((acc, course) => {
      acc[course.category] = acc[course.category] || [];
      acc[course.category].push(course);
      return acc;
    }, {});
  }, []);

  // useEffect(() => {
  //   setIsLoading(true);
  //   const serverUrl = process.env.REACT_APP_SERVER_URL;

  //   // Fetch data
  //   fetch(`${serverUrl}/course`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setCoursesData(data);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       setError(error?.message);
  //       setIsLoading(false);
  //     });
  // }, []);

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error}</p>;

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
