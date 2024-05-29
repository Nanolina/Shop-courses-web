import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { groupCoursesByCategory } from '../../functions';
import { ICourse } from '../../types.ts';
import { Loader } from '../../ui/Loader/Loader.tsx';
import CoursesListByCategory from '../CoursesListByCategory/CoursesListByCategory.tsx';
import styles from './CoursesList.module.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const CoursesList = () => {
  const [coursesData, setCoursesData] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Grouping data by categories
  const groupedData = useMemo(
    () => groupCoursesByCategory(coursesData),
    [coursesData]
  );

  async function getAllCourses() {
    try {
      const allCoursesApiUrl = `${serverUrl}/course`;
      const response = await axios.get<ICourse[]>(allCoursesApiUrl);
      setCoursesData(response.data);
      setIsLoading(false);
      return response.data;
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getAllCourses();
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      {Object.entries(groupedData).map(([category, courses]) => (
        <CoursesListByCategory
          category={category}
          courses={courses as ICourse[]}
          key={category}
        />
      ))}
    </div>
  );
};

export default CoursesList;
