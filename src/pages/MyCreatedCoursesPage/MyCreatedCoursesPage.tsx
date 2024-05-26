import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MyCreatedCourseItem from '../../components/MyCreatedCourseItem/MyCreatedCourseItem';
import { ICourse } from '../../types';
import styles from './MyCreatedCoursesPage.module.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;

function MyCreatedCoursesPage() {
  const { userId } = useParams<{ userId: string }>();
  const [coursesData, setCoursesData] = useState<ICourse[]>([]);

  async function getAllMyCreatedCourses() {
    try {
      const apiUrl = `${serverUrl}/course/user/${userId}`;
      const response = await axios.get(apiUrl);
      setCoursesData(response.data);

      return response.data;
    } catch (error: any) {}
  }

  useEffect(() => {
    getAllMyCreatedCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (coursesData.length <= 0) {
    return <div>You don't have any courses created</div>;
  }

  return (
    <div className={styles.container}>
      {coursesData.map((course: ICourse) => (
        <MyCreatedCourseItem course={course} key={course.id} />
      ))}
    </div>
  );
}

export default MyCreatedCoursesPage;
