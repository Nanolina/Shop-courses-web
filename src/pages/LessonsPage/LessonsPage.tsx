import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LESSON } from '../../consts';
import { createAxiosWithAuth, handleAuthError } from '../../functions';
import { ILesson, RoleType } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import CoursePartPage from '../CoursePartPage/CoursePartPage';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import { IGetLessons, ILessonsPageParams } from '../types';

function LessonsPage() {
  const { moduleId = '' } = useParams<ILessonsPageParams>();

  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [role, setRole] = useState<RoleType | null>(null);

  const { initDataRaw } = retrieveLaunchParams();

  async function getAllLessons() {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<IGetLessons>(
        `/lesson/module/${moduleId}`
      );
      setLessons(response.data.lessons);
      setRole(response.data.role);
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  if (isLoading) return <Loader />;
  if (!role)
    return <ItemNotFoundPage error="The role for lessons has not been given" />;

  return (
    <>
      <CoursePartPage
        type={LESSON}
        parentId={moduleId}
        items={lessons}
        role={role}
      />
      {error && <MessageBox errorMessage={error} />}
    </>
  );
}

export default LessonsPage;
