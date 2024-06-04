import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LESSON } from '../../consts';
import { createAxiosWithAuth } from '../../functions';
import { ILesson } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import CoursePartPage from '../CoursePartPage/CoursePartPage';
import { IGetLessons, ILessonsPageParams } from '../types';

function LessonsPage() {
  const { moduleId = '' } = useParams<ILessonsPageParams>();

  const [lessonsData, setLessonsData] = useState<ILesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [role, setRole] = useState<string>('');

  const { initDataRaw } = retrieveLaunchParams();

  async function getAllLessons() {
    try {
      setIsLoading(true);
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<IGetLessons>(
        `/lesson/module/${moduleId}`
      );
      setLessonsData(response.data.lessons);
      setRole(response.data.role);
      setIsLoading(false);
    } catch (error: any) {
      setError(error?.message || String(error));
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getAllLessons();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  if (isLoading) return <Loader />;

  return (
    <>
      <CoursePartPage
        type={LESSON}
        parentId={moduleId}
        items={lessonsData}
        updatePageData={getAllLessons}
        role={role}
      />
      {error && <MessageBox errorMessage={error} />}
    </>
  );
}

export default LessonsPage;
