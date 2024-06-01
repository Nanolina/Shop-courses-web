import { retrieveLaunchParams } from '@tma.js/sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MODULE } from '../../consts';
import { IModule } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import { createAxiosWithAuth } from '../../utils';
import CoursePartPage from '../CoursePartPage/CoursePartPage';
import { IModulesPageParams } from '../types';

const ModulesPage: React.FC = () => {
  const { courseId = '' } = useParams<IModulesPageParams>();

  const [modulesData, setModulesData] = useState<IModule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const { initDataRaw } = retrieveLaunchParams();

  const getAllModules = useCallback(async () => {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get(`/module/course/${courseId}`);
      setModulesData(response.data);
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
      />
      {error && <MessageBox errorMessage={error} />}
    </>
  );
};

export default React.memo(ModulesPage);
