import { retrieveLaunchParams } from '@tma.js/sdk';
import React, { useCallback, useEffect, useState } from 'react';
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
  const { courseId = '' } = useParams<IModulesPageParams>();

  const [modules, setModules] = useState<IModule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    } catch (error: any) {
      setError(error.response?.data.message || 'Failed to fetch modules');
    } finally {
      setIsLoading(false);
    }
  }, [courseId, initDataRaw]);

  useEffect(() => {
    getAllModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  if (isLoading) return <Loader />;
  if (!role)
    return <ItemNotFoundPage error="The role for modules has not been given" />;

  return (
    <>
      <CoursePartPage
        type={MODULE}
        parentId={courseId}
        items={modules}
        role={role}
        updateItems={getAllModules}
      />
      {error && <MessageBox errorMessage={error} />}
    </>
  );
};

export default React.memo(ModulesPage);
