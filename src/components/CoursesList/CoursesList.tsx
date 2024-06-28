import axios from 'axios';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { groupCoursesByCategory } from '../../functions';
import { ICourse } from '../../types.ts';
import { Loader } from '../../ui/Loader/Loader.tsx';
import { MessageBox } from '../../ui/MessageBox/MessageBox.tsx';
import CoursesListByCategory from '../CoursesListByCategory/CoursesListByCategory.tsx';
import styles from './CoursesList.module.css';
import SearchBar from '../../ui/SearchBar/SearchBar.tsx';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const CoursesList = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [value, setValue] = useState('');

  const filteredCourses = courses.filter((course) => {
    return course.name.toLowerCase().includes(value.toLowerCase());
  });

  // Grouping data by categories
  const groupedData = useMemo(
    () => groupCoursesByCategory(filteredCourses),
    [filteredCourses]
  );

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
    <>
      <SearchBar
        funOnChange={(event: { target: { value: SetStateAction<string> } }) =>
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
        {error && <MessageBox errorMessage={error} />}
      </div>
    </>
  );
};

export default CoursesList;
