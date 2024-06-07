import { retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { createAxiosWithAuth, handleAuthError } from '../../functions';
import { ILesson } from '../../types';
import Container from '../../ui/Container/Container';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import ItemNotFoundPage from '../ItemNotFoundPage/ItemNotFoundPage';
import styles from './LessonPage.module.css';

const tg = window.Telegram.WebApp;

function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<ILesson | null>(null);
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
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getOneLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    tg.MainButton.hide();
  }, []);

  if (isLoading) return <Loader />;
  if (!lesson) return <ItemNotFoundPage error={error} />;

  return (
    <>
      <div className={styles.imageContainer}>
        <img
          src={lesson.imageUrl || ''}
          alt={lesson.name}
          className={styles.image}
        />
        <IoIosArrowBack
          className={styles.icon}
          onClick={() => navigate(-1)}
          size={20}
        />
      </div>

      <Container>
        <div className={styles.info}>
          <Label text={lesson.name} isBig isBold />
          {lesson.description && (
            <div className={styles.descriptionText}>{lesson.description}</div>
          )}
        </div>
        {!lesson.videoUrl ? (
          <div>The video is probably still uploading</div>
        ) : (
          <VideoPlayer url={lesson.videoUrl} />
        )}
        {error && <MessageBox errorMessage={error} />}
      </Container>
    </>
  );
}

export default LessonPage;
