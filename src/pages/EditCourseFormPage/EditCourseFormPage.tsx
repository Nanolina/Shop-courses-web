import { retrieveLaunchParams } from '@tma.js/sdk';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import CreateCourseFormPage from '../CreateCourseFormPage/CreateCourseFormPage';

function EditCourseFormPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const [itemData, setItemData] = useState<ICourse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { initDataRaw } = retrieveLaunchParams();
  return (
    <Container>
      <CreateCourseFormPage item={itemData}></CreateCourseFormPage>
    </Container>
  );
}

export default EditCourseFormPage;
