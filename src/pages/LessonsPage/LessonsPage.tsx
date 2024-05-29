import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LESSON } from '../../consts';
import { ILesson } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import CoursePartPage from '../CoursePartPage/CoursePartPage';
import { ILessonsPageParams } from '../types';

const serverUrl = process.env.REACT_APP_SERVER_URL;

function LessonsPage() {
  const { moduleId = '' } = useParams<ILessonsPageParams>();
  const [isForm, setIsForm] = useState<boolean>(false);
  const [lessonsData, setLessonsData] = useState<ILesson[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  async function getAllLessons() {
    try {
      const allLessonsApiUrl = `${serverUrl}/module/${moduleId}/lessons`;
      const response = await axios.get<ILesson[]>(allLessonsApiUrl);
      setLessonsData(response.data);
      setIsLoading(false);
    } catch (error: any) {
      setError(error?.message || String(error));
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getAllLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

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
