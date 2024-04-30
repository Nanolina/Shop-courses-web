import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { ICourse } from '../../types.ts';
import CoursesListByCategory from '../CoursesListByCategory/CoursesListByCategory.tsx';
import styles from './CoursesList.module.css';

const CoursesList = () => {
  const [coursesData, setCoursesData] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Grouping data by categories
  const groupedData = useMemo<Record<string, ICourse[]>>(() => {
    return coursesData.reduce<Record<string, ICourse[]>>((acc, course) => {
      acc[course.category] = acc[course.category] || [];
      acc[course.category].push(course);
      return acc;
    }, {});
  }, [coursesData]);

  async function getCourseData() {
    try {
      const serverUrl = process.env.REACT_APP_SERVER_URL;
      const response = await axios.get(`${serverUrl}/course`);
      setCoursesData(response.data);
      setIsLoading(false);
      return response.data;
    } catch (error: any) {
      setError(error?.message || error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getCourseData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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
