import { useQuery, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import { useTWAEvent } from '@tonsolutions/telemetree-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useNotification } from '../../context';
import { fetchCoursePartDetailsAPI } from '../../requests';
import { ILesson } from '../../types';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import VideoPlayer from '../../ui/VideoPlayer/VideoPlayer';
import styles from './LessonPage.module.css';

const tg = window.Telegram.WebApp;
const serverUrl = process.env.REACT_APP_SERVER_URL || '';

function LessonPage() {
  const { t } = useTranslation();
  const eventBuilder = useTWAEvent();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { setDisableNotification } = useNotification();
  const navigate = useNavigate();

  const { initDataRaw } = retrieveLaunchParams();
  const queryClient = useQueryClient();

  const [videoUrl, setVideoUrl] = useState<string>('');

  const getLessonData = async () => {
    const data = await fetchCoursePartDetailsAPI(
      'lesson',
      lessonId as string,
      initDataRaw
    );
    if ('videoUrl' in data) {
      return data as ILesson;
    } else {
      throw new Error('Expected lesson data but received module data');
    }
  };

  const { data, error, isLoading, isSuccess } = useQuery<ILesson>({
    queryKey: ['lesson', lessonId],
    queryFn: getLessonData,
    enabled: !!lessonId,
    placeholderData: () => {
      return queryClient.getQueryData(['lesson', lessonId]);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setVideoUrl(data.videoUrl || '');
      eventBuilder.track('Lesson opened', {});
    }
  }, [isSuccess, data, eventBuilder]);

  // To receive notifications when a video is successfully uploaded to Cloudinary
  useEffect(() => {
    const socket = io(serverUrl);

    socket.on('video-uploaded', (data) => {
      const { url, message, status, lessonId: lessonIdFromBackend } = data;
      if (status === 'success' && lessonId === lessonIdFromBackend) {
        toast.success(message);
        setVideoUrl(url);
      } else if (status === 'error') {
        toast.error(message);
      } else {
        toast(message);
      }
    });

    return () => {
      socket.off('video-uploaded');
      socket.close();
    };
  }, [lessonId]);

  useEffect(() => {
    tg.MainButton.hide();
    setDisableNotification(true);
    return () => setDisableNotification(false);
  }, [setDisableNotification]);

  return (
    <div className={styles.videoContainer}>
      <IoIosArrowBack
        className={styles.backIcon}
        onClick={() => navigate(-1)}
        size={24}
      />
      {videoUrl && isSuccess && <VideoPlayer url={videoUrl} />}
      {!videoUrl && isSuccess && (
        <div className={styles.notUploaded}>
          {t('video_uploading')}
          <img
            src="/hourglass.gif"
            alt="Hourglass gif"
            className={styles.hourglass}
          />
        </div>
      )}
      {isLoading && <Loader hasBackground />}
      {error && <MessageBox errorMessage={error.message} />}
    </div>
  );
}

export default LessonPage;
