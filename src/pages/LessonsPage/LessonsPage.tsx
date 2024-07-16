import { useQuery, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { LESSON } from '../../consts';
import { fetchLessonsAPI } from '../../requests';
import { RoleType } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import CoursePartPage from '../CoursePartPage/CoursePartPage';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import { IGetLessons, ILessonsPageParams } from '../types';

function LessonsPage() {
  const { t } = useTranslation();
  const { moduleId } = useParams<ILessonsPageParams>();
  const { initDataRaw } = retrieveLaunchParams();
  const queryClient = useQueryClient();

  const { data, error, isLoading, isError, isSuccess } = useQuery<IGetLessons>({
    queryKey: ['lessons', moduleId],
    queryFn: () => fetchLessonsAPI(moduleId, initDataRaw),
    placeholderData: () => {
      return queryClient.getQueryData(['lessons', moduleId]);
    },
  });

  const [role, setRole] = useState<RoleType | null>(null);

  useEffect(() => {
    if (data) {
      setRole(data.role);
    }
  }, [data]);

  if (isError && !role) {
    return (
      <ItemNotFoundPage error={t('not_have_role')} isLoading={isLoading} />
    );
  }

  if (!moduleId)
    return (
      <ItemNotFoundPage error={t('item_not_found')} isLoading={isLoading} />
    );

  return (
    <>
      {role && isSuccess && (
        <CoursePartPage
          type={LESSON}
          parentId={moduleId}
          items={data.lessons}
          role={role}
        />
      )}
      {isLoading && <Loader hasBackground />}
      {isError && <MessageBox errorMessage={error.message} />}
    </>
  );
}

export default LessonsPage;
