import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EditCoursePart from '../../components/EditCoursePart/EditCoursePart';
import { LESSON, MODULE } from '../../consts';
import { EntityType, ILesson, IModule } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import { createAxiosWithAuth } from '../../utils';

function EditPartCoursePage() {
  const { type, itemId } = useParams<{ type: EntityType; itemId: string }>();

  const [itemData, setItemData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { initDataRaw } = retrieveLaunchParams();

  async function getOnePartCourse() {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      let response;
      if (type === MODULE) {
        response = await axiosWithAuth.get<IModule>(`module/${itemId}`);
      }
      if (type === LESSON) {
        response = await axiosWithAuth.get<ILesson>(`lesson/${itemId}`);
      }
      if (!response || !response.data) {
        throw new Error(
          'Something went wrong with getting the module or lesson data'
        );
      }
      setIsLoading(false);
      setItemData(response.data);
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getOnePartCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader />;

  return (
    <Container>
      <EditCoursePart item={itemData} type={type} />
      {error && <MessageBox errorMessage={error} />}
    </Container>
  );
}

export default EditPartCoursePage;
