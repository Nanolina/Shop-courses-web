import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { LESSON } from '../../consts';
import { createAxiosWithAuth } from '../../functions';
import { ILesson } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import styles from './LessonPage.module.css';

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
  const { initDataRaw } = retrieveLaunchParams();

  async function getOneLesson() {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<any>(`lesson/${lessonId}`);
      setLessonData(response.data.lesson);
      setIsLoading(false);
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getOneLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, initDataRaw]); // Добавляем зависимости, которые могут измениться

  useEffect(() => {
    if (lessonData) {
      setVideoUrl(lessonData.videoUrl || '');
    }
  }, [lessonData]);

  useEffect(() => {
    tg.MainButton.hide();
  }, []);

  if (isLoading) return <Loader />;
  if (!lessonId) return <MessageBox errorMessage="Lesson not found" />;

  return (
    <div className={styles.mainContainer}>
      <Header label={lessonData.name} />
      <div className={styles.info}>
        <p>{lessonData.description}</p>
      </div>
      <VideoPlayer
        url={videoUrl}
        setUrl={setVideoUrl}
        lessonId={lessonId}
        type={LESSON}
      />
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default LessonPage;
