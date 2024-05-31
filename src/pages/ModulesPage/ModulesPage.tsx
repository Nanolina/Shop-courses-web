import { retrieveLaunchParams } from '@tma.js/sdk';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MODULE } from '../../consts';
import { IModule } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { createAxiosWithAuth } from '../../utils';
import CoursePartPage from '../CoursePartPage/CoursePartPage';
import { IModulesPageParams } from '../types';

const ModulesPage: React.FC = () => {
  const { courseId = '' } = useParams<IModulesPageParams>();

  const [isForm, setIsForm] = useState<boolean>(false);
  const [modulesData, setModulesData] = useState<IModule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const { initDataRaw } = retrieveLaunchParams();

  useEffect(() => {
    const getAllModules = async () => {
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
    };

    getAllModules();
  }, [courseId, initDataRaw]);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <CoursePartPage
      type={MODULE}
      parentId={courseId}
      items={modulesData}
      setItems={setModulesData}
      isForm={isForm}
      setIsForm={setIsForm}
    />
  );
};

export default React.memo(ModulesPage);
