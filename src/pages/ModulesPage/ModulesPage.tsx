import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MODULE } from '../../consts';
import { IModule } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import CoursePartPage from '../CoursePartPage/CoursePartPage';
import { IModulesPageParams } from '../types';

const serverUrl = process.env.REACT_APP_SERVER_URL;

const ModulesPage: React.FC = () => {
  const { courseId = '' } = useParams<IModulesPageParams>();
  const [isForm, setIsForm] = useState<boolean>(false);
  const [modulesData, setModulesData] = useState<IModule[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getAllModules = async () => {
      try {
        const allModulesApiUrl = `${serverUrl}/course/${courseId}/module`;
        const response = await axios.get<IModule[]>(allModulesApiUrl);
        setModulesData(response.data);
        setIsLoading(false);
      } catch (error: any) {
        setError(error.response?.data.message || 'Failed to fetch modules');
        setIsLoading(false);
      }
    };

    getAllModules();
  }, [courseId]);

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
