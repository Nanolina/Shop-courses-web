import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ILesson } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import styles from './LessonPage.module.css';
//import { MdDeleteForever } from 'react-icons/md';
//import { FiEdit } from 'react-icons/fi';

const serverUrl = process.env.REACT_APP_SERVER_URL;

function LessonPage() {
  const initialLessonData: ILesson = {
    id: '',
    name: '',
    moduleId: '',
    imageUrl: '',
    videos: [],
  };
  const { lessonId } = useParams();
  //const [isForm, setIsForm] = useState(false);
  const [lessonData, setLessonData] = useState<ILesson>(initialLessonData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>('');
  useEffect(() => {
    const getAllLessonData = async () => {
      try {
        const allLessonDataApiUrl = `${serverUrl}/${lessonId}`;
        const response = await axios.get(allLessonDataApiUrl);
        setLessonData(response.data);
        console.log(`response.data : ${response.data}`);
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
      <div className={styles.container}>
        <img className={styles.cover} src={lessonData.imageUrl} alt="cover" />
        <div className={styles.info}>
          <div className={styles.name}>{lessonData.name}</div>
          <p className={styles.description}>{lessonData.description}</p>
        </div>
        {/* <div className={styles.icons}>
          <MdDeleteForever
            className={styles.cross}
            color="var(--tg-theme-accent-text-color)"
            size={24}
            // onClick={handleDelete}
          />
          <FiEdit
            color="var(--tg-theme-accent-text-color)"
            size={20}
            // onClick={handleEdit}
          />
        </div> */}
      </div>
    </Container>
  );
}

export default LessonPage;
