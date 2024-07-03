import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { moduleId = '' } = useParams<ILessonsPageParams>();

  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false); // State to track the completion of data loading
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
      setIsLoaded(true);
    } catch (error: any) {
      handleAuthError(error, setError);
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  if (isLoading) return <Loader />;
  if (!role && !isLoading && isLoaded) {
    return (
      <ItemNotFoundPage error={t('not_have_role')} isLoading={isLoading} />
    );
  }

  return (
    <>
      {role && (
        <CoursePartPage
          type={LESSON}
          parentId={moduleId}
          items={lessons}
          role={role}
          updateItems={getAllLessons}
        />
      )}
      {error && <MessageBox errorMessage={error} />}
    </>
  );
}

export default LessonsPage;
