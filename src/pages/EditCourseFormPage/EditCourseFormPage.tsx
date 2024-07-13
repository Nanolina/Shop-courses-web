import { useQuery, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { FiEdit } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import CourseForm from '../../components/CourseForm/CourseForm';
import Header from '../../components/Header/Header';
import { fetchCourseDetailsAPI } from '../../functions';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';

function EditCourseFormPage() {
  const { courseId = '' } = useParams<{ courseId: string }>();
  const { initDataRaw } = retrieveLaunchParams();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ['courseDetails', courseId],
    queryFn: () => fetchCourseDetailsAPI(courseId, initDataRaw),
    enabled: !!courseId,
    placeholderData: () => {
      return queryClient.getQueryData(['courseDetails', courseId]);
    },
  });

  if (isLoading) return <Loader />;

  const { course } = data;

  return (
    <Container>
      {course && (
        <>
          <Header label={course.name} icon={<FiEdit size={24} />} />
          <CourseForm course={course} />
        </>
      )}
      {error && <MessageBox errorMessage={error.message} />}
    </Container>
  );
}

export default EditCourseFormPage;
