import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { groupCoursesByCategory } from '../../functions';
import { ICourse } from '../../types.ts';
import { Loader } from '../../ui/Loader/Loader.tsx';
import { MessageBox } from '../../ui/MessageBox/MessageBox.tsx';
import CoursesListByCategory from '../CoursesListByCategory/CoursesListByCategory.tsx';
import styles from './CoursesList.module.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const CoursesList = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Grouping data by categories
  const groupedData = useMemo(() => groupCoursesByCategory(courses), [courses]);

  async function getAllCourses() {
    setIsLoading(true);
    try {
      const allCoursesApiUrl = `${serverUrl}/course`;
      const response = await axios.get<ICourse[]>(allCoursesApiUrl);
      setCourses(response.data);
      return response.data;
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllCourses();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      {Object.entries(groupedData).map(([category, courses]) => (
        <CoursesListByCategory
          category={category}
          courses={courses as ICourse[]}
          key={category}
        />
      ))}
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
};

export default CoursesList;
