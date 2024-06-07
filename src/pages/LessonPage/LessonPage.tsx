import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { LESSON } from '../../consts';
import { createAxiosWithAuth, handleAuthError } from '../../functions';
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
  const [lesson, setLesson] = useState<ILesson>(initialLessonData);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { initDataRaw } = retrieveLaunchParams();

  async function getOneLesson() {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<any>(`lesson/${lessonId}`);
      setLesson(response.data.lesson);
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getOneLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, initDataRaw]); // Добавляем зависимости, которые могут измениться

  useEffect(() => {
    if (lesson) {
      setVideoUrl(lesson.videoUrl || '');
    }
  }, [lesson]);

  useEffect(() => {
    tg.MainButton.hide();
  }, []);

  if (isLoading) return <Loader />;
  if (!lessonId) return <MessageBox errorMessage="Lesson not found" />;

  return (
    <div className={styles.mainContainer}>
      <Header label={lesson.name} />
      <div className={styles.info}>
        <p>{lesson.description}</p>
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
