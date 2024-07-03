import { retrieveLaunchParams } from '@tma.js/sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { MODULE } from '../../consts';
import { createAxiosWithAuth } from '../../functions';
import { IModule, RoleType } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import CoursePartPage from '../CoursePartPage/CoursePartPage';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import { IGetModules, IModulesPageParams } from '../types';

const ModulesPage: React.FC = () => {
  const { t } = useTranslation();
  const { courseId = '' } = useParams<IModulesPageParams>();

  const [modules, setModules] = useState<IModule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false); // State to track the completion of data loading
  const [error, setError] = useState<string>('');
  const [role, setRole] = useState<RoleType | null>(null);

  const { initDataRaw } = retrieveLaunchParams();

  const getAllModules = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<IGetModules>(
        `/module/course/${courseId}`
      );
      setModules(response.data.modules);
      setRole(response.data.role);
      setIsLoaded(true);
    } catch (error: any) {
      setError(error.response?.data.message || 'Failed to fetch modules');
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, initDataRaw]);

  useEffect(() => {
    getAllModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

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
          type={MODULE}
          parentId={courseId}
          items={modules}
          role={role}
          updateItems={getAllModules}
        />
      )}
      {error && <MessageBox errorMessage={error} />}
    </>
  );
};

export default React.memo(ModulesPage);
