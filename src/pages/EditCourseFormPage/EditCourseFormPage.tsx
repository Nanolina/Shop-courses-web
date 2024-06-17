import { retrieveLaunchParams } from '@tma.js/sdk';
import { useCallback, useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import CourseForm from '../../components/CourseForm/CourseForm';
import Header from '../../components/Header/Header';
import { createAxiosWithAuth, handleAuthError } from '../../functions';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import { IGetCourse } from '../types';

function EditCourseFormPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false); // State to track the completion of data loading
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
      setCourse(response.data.course);
      setIsLoaded(true);
    } catch (error: any) {
      handleAuthError(error, setError);
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, initDataRaw]);

  useEffect(() => {
    getOneCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader />;
  if (!course && !isLoading && isLoaded) {
    return <ItemNotFoundPage error={error} isLoading={isLoading} />;
  }

  return (
    <Container>
      {course && (
        <>
          <Header label={course.name} icon={<FiEdit size={24} />} />
          <CourseForm course={course} />
        </>
      )}
      {error && <MessageBox errorMessage={error} />}
    </Container>
  );
}

export default EditCourseFormPage;
