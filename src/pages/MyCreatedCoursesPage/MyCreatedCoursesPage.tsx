import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MyCreatedCourseItem from '../../components/MyCreatedCourseItem/MyCreatedCourseItem';
import { ICourse } from '../../types';
import { IMyCreatedCoursesPageParams } from '../types';
import styles from './MyCreatedCoursesPage.module.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;

function MyCreatedCoursesPage() {
  const { userId } = useParams<IMyCreatedCoursesPageParams>();
  const [coursesData, setCoursesData] = useState<ICourse[]>([]);

  async function getAllMyCreatedCourses() {
    try {
      const apiUrl = `${serverUrl}/course/user/${userId}`;
      const response = await axios.get<ICourse[]>(apiUrl);
      setCoursesData(response.data);
    } catch (error: any) {
      console.error(
        'Failed to fetch courses:',
        error.message || error.toString()
      );
    }
  }

  useEffect(() => {
    getAllMyCreatedCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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
