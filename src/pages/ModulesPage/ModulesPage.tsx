import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MODULE } from '../../consts';
import { IModule } from '../../types';
import { Loader } from '../../ui/Loader/Loader.tsx';
import CoursePartPage from '../CoursePartPage/CoursePartPage';

const serverUrl = process.env.REACT_APP_SERVER_URL;

function ModulesPage() {
  const { courseId } = useParams();
  const [isForm, setIsForm] = useState(false);
  const [modulesData, setModulesData] = useState<IModule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function getAllModules() {
    try {
      const allModulesApiUrl = `${serverUrl}/course/${courseId}/module`;
      const response = await axios.get(allModulesApiUrl);
      setModulesData(response.data);
      setIsLoading(false);
      return response.data;
    } catch (error: any) {
      setError(error?.message || error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getAllModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

export default ModulesPage;
