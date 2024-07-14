import { useQuery, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { FiEdit } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import CoursePartForm from '../../components/CoursePartForm/CoursePartForm';
import Header from '../../components/Header/Header';
import { fetchCoursePartDetailsAPI } from '../../requests';
import { EntityType, ILesson, IModule } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import { IEditCoursePartParams } from '../types';

function EditCoursePartPage() {
  const { type, itemId } = useParams<IEditCoursePartParams>();

  const { initDataRaw } = retrieveLaunchParams();
  const queryClient = useQueryClient();

  const queryKey = type === 'module' ? ['module', itemId] : ['lesson', itemId];
  const { data, error, isLoading } = useQuery<IModule | ILesson>({
    queryKey,
    queryFn: () =>
      fetchCoursePartDetailsAPI(
        type as EntityType,
        itemId as string,
        initDataRaw
      ),
    enabled: !!itemId || !!type,
    placeholderData: () => {
      return queryClient.getQueryData(queryKey);
    },
  });

  return (
    <Container>
      {data && type && (
        <>
          <Header label={data.name} icon={<FiEdit size={24} />} />
          <CoursePartForm item={data} type={type} />
        </>
      )}
      {isLoading && <Loader />}
      {error && <MessageBox errorMessage={error.message} />}
    </Container>
  );
}

export default EditCoursePartPage;
