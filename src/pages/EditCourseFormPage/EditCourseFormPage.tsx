import { retrieveLaunchParams } from '@tma.js/sdk';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CourseForm from '../../components/CourseForm/CourseForm';
import Header from '../../components/Header/Header';
import { createAxiosWithAuth } from '../../functions';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import { IGetCourse } from '../types';

function EditCourseFormPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const [courseData, setCourseData] = useState<ICourse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { initDataRaw } = retrieveLaunchParams();

  const getOneCourse = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<IGetCourse>(
        `/course/${courseId}`
      );
      setCourseData(response.data.course);
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
    } finally {
      setIsLoading(false);
    }
  }, [courseId, initDataRaw]);

  useEffect(() => {
    getOneCourse();
  }, [getOneCourse]);

  if (isLoading) return <Loader />;
  if (!courseData) return <ItemNotFoundPage type="course" />;

  return (
    <Container>
      <Header label={courseData.name} />
      <CourseForm course={courseData} />
      {error && <MessageBox errorMessage={error} />}
    </Container>
  );
}

export default EditCourseFormPage;
