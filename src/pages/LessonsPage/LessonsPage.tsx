import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LESSON } from '../../consts';
import { ILesson } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { createAxiosWithAuth } from '../../utils';
import CoursePartPage from '../CoursePartPage/CoursePartPage';
import { ILessonsPageParams } from '../types';

function LessonsPage() {
  const { moduleId = '' } = useParams<ILessonsPageParams>();
  const [isForm, setIsForm] = useState<boolean>(false);
  const [lessonsData, setLessonsData] = useState<ILesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { initDataRaw } = retrieveLaunchParams();

  async function getAllLessons() {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get(`/lesson/module/${moduleId}`);
      setLessonsData(response.data);
      setIsLoading(false);
    } catch (error: any) {
      setError(error?.message || String(error));
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getAllLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <CoursePartPage
      type={LESSON}
      parentId={moduleId}
      items={lessonsData}
      setItems={setLessonsData}
      isForm={isForm}
      setIsForm={setIsForm}
    />
  );
}

export default LessonsPage;
