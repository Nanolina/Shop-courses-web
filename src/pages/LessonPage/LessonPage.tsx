import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import { LESSON } from '../../consts';
import { capitalizeFirstLetter } from '../../functions';
import { ILesson } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import styles from './LessonPage.module.css';

const serverUrl = process.env.REACT_APP_SERVER_URL;

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
  const [url, setUrl] = useState(lessonData.videoUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>('');
  useEffect(() => {
    const getAllLessonData = async () => {
      try {
        const allLessonDataApiUrl = `${serverUrl}/lesson/${lessonId}`;
        const response = await axios.get(allLessonDataApiUrl);
        setLessonData(response.data);
        console.log(response.data);
      } catch (error) {
        setError(error || 'Failed to fetch modules');
      } finally {
        setIsLoading(false);
      }
    };
    getAllLessonData();
  }, [lessonId]);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      {<Header /* label={`${capitalizeFirstLetter(lessonData.name)}`}*/ />}
      <div className={styles.container}>
        <img className={styles.cover} src={lessonData.imageUrl} alt="cover" />
        <p
          className={styles.name}
        >{`${capitalizeFirstLetter(lessonData.name)}`}</p>
      </div>
      <div className={styles.info}>
        <p>{lessonData.description}</p>
      </div>
      <VideoPlayer
        url={url}
        setUrl={setUrl}
        lessonId={lessonId}
        type={LESSON}
      />
    </Container>
  );
}

export default LessonPage;
