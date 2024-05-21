import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LESSON } from '../../consts';
import { ILesson } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import CoursePartPage from '../CoursePartPage/CoursePartPage';

const serverUrl = process.env.REACT_APP_SERVER_URL;

function LessonsPage() {
  const { moduleId } = useParams();
  const [isForm, setIsForm] = useState(false);
  const [lessonsData, setLessonsData] = useState<ILesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function getAllLessons() {
    try {
      const allLessonsApiUrl = `${serverUrl}/module/${moduleId}/lesson`;
      const response = await axios.get(allLessonsApiUrl);
      setLessonsData(response.data);
      setIsLoading(false);
      return response.data;
    } catch (error: any) {
      setError(error?.message || error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getAllLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <CoursePartPage
      type={LESSON}
      parentId={moduleId}
      items={lessonsData}
      setItems={setLessonsData}
      isForm={isForm}
      setIsForm={setIsForm}
    />
  );
}

export default LessonsPage;
