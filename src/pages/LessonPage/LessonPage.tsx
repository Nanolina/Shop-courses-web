import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { LESSON } from '../../consts';
import { ILesson } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import styles from './LessonPage.module.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const tg = window.Telegram.WebApp;

function LessonPage() {
  const initialLessonData: ILesson = {
    id: '',
    name: '',
    moduleId: '',
    imageUrl: '',
    videoUrl: '',
  };
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState<ILesson>(initialLessonData);
  const [videoUrl, setVideoUrl] = useState(lessonData.videoUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>('');

  useEffect(() => {
    const getAllLessonData = async () => {
      try {
        const allLessonDataApiUrl = `${serverUrl}/lesson/${lessonId}`;
        const response = await axios.get(allLessonDataApiUrl);
        setLessonData(response.data);
      } catch (error) {
        setError(error || 'Failed to fetch modules');
      } finally {
        setIsLoading(false);
      }
    };

    getAllLessonData();
  }, [lessonId]);

  useEffect(() => {
    setVideoUrl(lessonData.videoUrl);
  }, [lessonData]);

  useEffect(() => {
    tg.MainButton.hide();
  }, []);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.mainContainer}>
      {<Header />}
      <VideoPlayer
        url={videoUrl}
        setUrl={setVideoUrl}
        lessonId={lessonId}
        type={LESSON}
      />
      <div className={styles.info}>
        <p>{lessonData.description}</p>
      </div>
    </div>
  );
}

export default LessonPage;
