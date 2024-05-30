import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CourseItem from '../../components/CourseItem/CourseItem';
import Header from '../../components/Header/Header';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import styles from './CoursesOneCategoryPage.module.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;

function CoursesOneCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [coursesData, setCoursesData] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function getAllCoursesOneCategory() {
    try {
      const allCoursesApiUrl = `${serverUrl}/course/category/${category}`;
      const response = await axios.get(allCoursesApiUrl);
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
    getAllCoursesOneCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <Header label={category} />
      <div className={styles.container}>
        {coursesData.map((course: any) => (
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
    </Container>
  );
}

export default CoursesOneCategoryPage;
