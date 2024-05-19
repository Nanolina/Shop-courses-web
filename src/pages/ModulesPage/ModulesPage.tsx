import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MODULE } from '../../consts';
import { IModule } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import CoursePartPage from '../CoursePartPage/CoursePartPage';

const serverUrl = process.env.REACT_APP_SERVER_URL;

function ModulesPage() {
  const { courseId } = useParams();
  const [isForm, setIsForm] = useState(false);
  const [modulesData, setModulesData] = useState<IModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>('');

  useEffect(() => {
    const getAllModules = async () => {
      try {
        const allModulesApiUrl = `${serverUrl}/course/${courseId}/module`;
        const response = await axios.get(allModulesApiUrl);
        setModulesData(response.data);
      } catch (error) {
        setError(error || 'Failed to fetch modules');
      } finally {
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
}

export default React.memo(ModulesPage);
