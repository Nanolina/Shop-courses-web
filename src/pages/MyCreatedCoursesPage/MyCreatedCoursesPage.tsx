import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MyCreatedCourseItem from '../../components/MyCreatedCourseItem/MyCreatedCourseItem';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';

const serverUrl = process.env.REACT_APP_SERVER_URL;

function MyCreatedCoursesPage() {
  const { userId } = useParams<{ userId: string }>();
  const [coursesData, setCoursesData] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function getAllMyCreatedCourses() {
    try {
      const apiUrl = `${serverUrl}/course/user/${userId}`;
      const response = await axios.get(apiUrl);
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
    getAllMyCreatedCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (coursesData.length <= 0) {
    return <div>You don't have any courses created</div>;
  }

  return (
    <Container>
      {coursesData.map((course: ICourse) => (
        <MyCreatedCourseItem course={course} key={course.id} />
      ))}
    </Container>
  );
}

export default MyCreatedCoursesPage;
