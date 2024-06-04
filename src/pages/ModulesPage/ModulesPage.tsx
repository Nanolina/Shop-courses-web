import { retrieveLaunchParams } from '@tma.js/sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MODULE } from '../../consts';
import { createAxiosWithAuth } from '../../functions';
import { IModule } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import CoursePartPage from '../CoursePartPage/CoursePartPage';
import { IGetModules, IModulesPageParams } from '../types';

const ModulesPage: React.FC = () => {
  const { courseId = '' } = useParams<IModulesPageParams>();

  const [modulesData, setModulesData] = useState<IModule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [role, setRole] = useState<string>('');

  const { initDataRaw } = retrieveLaunchParams();

  const getAllModules = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<IGetModules>(
        `/module/course/${courseId}`
      );
      setModulesData(response.data.modules);
      setRole(response.data.role);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.response?.data.message || 'Failed to fetch modules');
      setIsLoading(false);
    }
  }, [courseId, initDataRaw]);

  useEffect(() => {
    getAllModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, initDataRaw]);

  if (isLoading) return <Loader />;

  return (
    <>
      <CoursePartPage
        type={MODULE}
        parentId={courseId}
        items={modulesData}
        updatePageData={getAllModules}
        role={role}
      />
      {error && <MessageBox errorMessage={error} />}
    </>
  );
};

export default React.memo(ModulesPage);
