import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import MyCreatedCourseItem from '../../components/MyCreatedCourseItem/MyCreatedCourseItem';
import { ICourse } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { createAxiosWithAuth } from '../../utils';
import styles from './MyPurchasedCoursesPage.module.css';

const tg = window.Telegram.WebApp;

function MyPurchasedCoursesPage() {
  const [coursesData, setCoursesData] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { initDataRaw } = retrieveLaunchParams();

  async function getAllMyPurchasedCourses() {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<ICourse[]>('/course/purchased');
      setIsLoading(false);
      setCoursesData(response.data);
      console.log(`coursesData ${coursesData}`);
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getAllMyPurchasedCourses();
    tg.MainButton.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  if (coursesData.length === 0) {
    return (
      <div className={styles.noCourses}>
        <h1>You don't have any courses purchased</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {coursesData.map((course) => (
        <MyCreatedCourseItem
          course={course}
          key={course.id}
          updateItem={getAllMyPurchasedCourses}
          role='customer'
        />
      ))}
    </div>
  );
}

export default MyPurchasedCoursesPage;
