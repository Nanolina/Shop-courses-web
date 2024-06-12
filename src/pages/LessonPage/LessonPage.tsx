import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import Header from '../../components/Header/Header';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { useNotification } from '../../context';
import { createAxiosWithAuth, handleAuthError } from '../../functions';
import { ILesson } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import styles from './LessonPage.module.css';

const tg = window.Telegram.WebApp;
const serverUrl = process.env.REACT_APP_SERVER_URL || '';

function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { setDisableNotification } = useNotification();

  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>(lesson?.videoUrl || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { initDataRaw } = retrieveLaunchParams();

  async function getOneLesson() {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<ILesson>(`/lesson/${lessonId}`);
      setLesson(response.data);
      setVideoUrl(response.data.videoUrl || '');
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }

  // To receive notifications when a video is successfully uploaded to Cloudinary
  useEffect(() => {
    const socket = io(serverUrl);

    socket.on('notification', (data) => {
      const { url, message, status } = data;
      if (status === 'success') {
        toast.success(message);
        setVideoUrl(url);
      } else if (status === 'error') {
        toast.error(message);
      } else {
        toast(message);
      }
    });

    return () => {
      socket.off('notification');
      socket.close();
    };
  }, []);

  useEffect(() => {
    tg.MainButton.hide();
    setDisableNotification(true);
    return () => setDisableNotification(false);
  }, [setDisableNotification]);

  useEffect(() => {
    getOneLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader />;
  if (!lesson) return <ItemNotFoundPage error={error} />;

  return (
    <>
      <Header />
      <div className={styles.videoContainer}>
        {!videoUrl ? (
          <div>
            The video is probably still uploading 📤 or not saved 💾. Please
            wait ⏳
          </div>
        ) : (
          <VideoPlayer url={videoUrl} />
        )}
        {error && <MessageBox errorMessage={error} />}
      </div>
    </>
  );
}

export default LessonPage;
