import { retrieveLaunchParams } from '@tma.js/sdk';
import { useTWAEvent } from '@tonsolutions/telemetree-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useNotification } from '../../context';
import { createAxiosWithAuth, handleAuthError } from '../../functions';
import { ILesson } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import VideoPlayer from '../../ui/VideoPlayer/VideoPlayer';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import styles from './LessonPage.module.css';

const tg = window.Telegram.WebApp;
const serverUrl = process.env.REACT_APP_SERVER_URL || '';

function LessonPage() {
  const { t } = useTranslation();
  const eventBuilder = useTWAEvent();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { setDisableNotification } = useNotification();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>(lesson?.videoUrl || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false); // State to track the completion of data loading
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
      setIsLoaded(true);
      eventBuilder.track('Lesson opened', {});
    } catch (error: any) {
      handleAuthError(error, setError);
      setIsLoaded(true);
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
  if (!lesson && !isLoading && isLoaded) {
    return <ItemNotFoundPage error={error} isLoading={isLoading} />;
  }

  return (
    <div className={styles.videoContainer}>
      <IoIosArrowBack
        className={styles.backIcon}
        onClick={() => navigate(-1)}
        size={24}
      />
      {!videoUrl && isLoaded ? (
        <div>{t('video_uploading')}⏳</div>
      ) : (
        <VideoPlayer url={videoUrl} />
      )}
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default LessonPage;
