import { useQuery, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { MODULE } from '../../consts';
import { fetchModulesAPI } from '../../requests';
import { RoleType } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import CoursePartPage from '../CoursePartPage/CoursePartPage';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import { IGetModules, IModulesPageParams } from '../types';

const ModulesPage: React.FC = () => {
  const { t } = useTranslation();
  const { courseId } = useParams<IModulesPageParams>();
  const { initDataRaw } = retrieveLaunchParams();
  const queryClient = useQueryClient();

  const { data, error, isLoading, isError, isSuccess } = useQuery<IGetModules>({
    queryKey: ['modules', courseId],
    queryFn: () => fetchModulesAPI(courseId, initDataRaw),
    placeholderData: () => {
      return queryClient.getQueryData(['modules', courseId]);
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

  if (!courseId)
    return (
      <ItemNotFoundPage error={t('item_not_found')} isLoading={isLoading} />
    );

  return (
    <>
      {role && isSuccess && (
        <CoursePartPage
          type={MODULE}
          parentId={courseId}
          items={data.modules}
          role={role}
        />
      )}
      {isLoading && <Loader />}
      {isError && <MessageBox errorMessage={error.message} />}
    </>
  );
};

export default React.memo(ModulesPage);
