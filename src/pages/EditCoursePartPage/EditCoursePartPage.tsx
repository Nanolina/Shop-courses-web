import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import CoursePartForm from '../../components/CoursePartForm/CoursePartForm';
import Header from '../../components/Header/Header';
import { LESSON, MODULE } from '../../consts';
import { createAxiosWithAuth, handleAuthError } from '../../functions';
import { EntityType, ILesson, IModule } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import { IGetLesson } from '../types';

function EditCoursePartPage() {
  const { type, itemId } = useParams<{
    type: EntityType;
    itemId: string;
  }>();

  const [itemData, setItemData] = useState<IModule | ILesson | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const { initDataRaw } = retrieveLaunchParams();

  async function getOneCoursePart() {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      let response;
      if (type === MODULE) {
        response = await axiosWithAuth.get<IModule>(`module/${itemId}`);
        setItemData(response.data);
      }
      if (type === LESSON) {
        response = await axiosWithAuth.get<IGetLesson>(`lesson/${itemId}`);
        setItemData(response.data.lesson);
      }
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getOneCoursePart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader />;
  if (!itemData || !type) return <ItemNotFoundPage error={error} />;

  return (
    <Container>
      <Header label={itemData.name} icon={<FiEdit size={24} />} />
      <CoursePartForm item={itemData} type={type} />
      {error && <MessageBox errorMessage={error} />}
    </Container>
  );
}

export default EditCoursePartPage;
