import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { LESSON } from '../../consts';
import { ILesson } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import styles from './LessonPage.module.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;
const tg = window.Telegram.WebApp;

function LessonPage() {
  const initialLessonData: ILesson = {
    id: '',
    name: '',
    description: '',
    moduleId: '',
    imageUrl: '',
    videoUrl: '',
  };
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lessonData, setLessonData] = useState<ILesson>(initialLessonData);
  const [videoUrl, setVideoUrl] = useState<string>(lessonData.videoUrl);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getAllLessonData = async () => {
      try {
        const allLessonDataApiUrl = `${serverUrl}/lesson/${lessonId}`;
        const response = await axios.get<ILesson>(allLessonDataApiUrl);
        setLessonData(response.data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch lesson');
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
  if (!lessonId) return <MessageBox errorMessage="Lesson not found" />;

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
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default LessonPage;
