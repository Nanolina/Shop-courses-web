import { useQuery, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { FiEdit } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import CourseForm from '../../components/CourseForm/CourseForm';
import Header from '../../components/Header/Header';
import { CourseFormProvider } from '../../context';
import { fetchCourseDetailsAPI } from '../../functions';
import { useCourseForm } from '../../hooks';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import { IGetCourse } from '../types';

function EditCourseFormPage() {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { initDataRaw } = retrieveLaunchParams();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<IGetCourse>({
    queryKey: ['courseDetails', courseId],
    queryFn: () => fetchCourseDetailsAPI(courseId, initDataRaw),
    enabled: !!courseId,
    placeholderData: () => {
      return queryClient.getQueryData(['courseDetails', courseId]);
    },
  });

  const course = data?.course;

  const courseFormContextValue = useCourseForm(course);

  return (
    <Container>
      {course && (
        <>
          <Header label={course.name} icon={<FiEdit size={24} />} />
          <CourseFormProvider value={courseFormContextValue}>
            <CourseForm />
          </CourseFormProvider>
        </>
      )}
      {(isLoading || courseFormContextValue.isLoading) && <Loader />}
      {(error || courseFormContextValue.error) && (
        <MessageBox
          errorMessage={error?.message || courseFormContextValue.error?.message}
        />
      )}
    </Container>
  );
}

export default EditCourseFormPage;
