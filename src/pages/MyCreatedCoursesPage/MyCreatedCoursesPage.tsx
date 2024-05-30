import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import MyCreatedCourseItem from '../../components/MyCreatedCourseItem/MyCreatedCourseItem';
import { ICourse } from '../../types';
import { createAxiosWithAuth } from '../../utils';
import styles from './MyCreatedCoursesPage.module.css';
import { Loader } from '../../ui/Loader/Loader';

function MyCreatedCoursesPage() {
  const [coursesData, setCoursesData] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { initDataRaw } = retrieveLaunchParams();

  async function getAllMyCreatedCourses() {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<ICourse[]>('/course/user');
      setCoursesData(response.data);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getAllMyCreatedCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  if (coursesData.length === 0) {
    return (
      <div className={styles.noCourses}>You don't have any courses created</div>
    );
  }

  return (
    <div className={styles.container}>
      {coursesData.map((course) => (
        <MyCreatedCourseItem course={course} key={course.id} />
      ))}
    </div>
  );
}

export default MyCreatedCoursesPage;
