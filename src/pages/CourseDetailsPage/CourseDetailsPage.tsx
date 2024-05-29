import { CHAIN, TonConnectButton } from '@tonconnect/ui-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useTonConnect } from '../../hooks';
import { ICourse } from '../../types';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import styles from './CourseDetailsPage.module.css';

const tg = window.Telegram.WebApp;
const serverUrl = process.env.REACT_APP_SERVER_URL;

function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<ICourse>();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { network } = useTonConnect();

  const networkType = network
    ? network === CHAIN.MAINNET
      ? 'mainnet'
      : 'testnet'
    : 'N/A';
  async function getCourseDetails() {
    try {
      const courseApiUrl = `${serverUrl}/course/${courseId}`;
      const response = await axios.get(courseApiUrl);
      setCourse(response.data);
      setName(response.data.name);
      setIsLoading(false);
      return response.data;
    } catch (error: any) {
      setError(error?.message || error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    getCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    if (course) {
      tg.MainButton.setParams({
        text: `Buy for ${course.price} ${course.currency}`,
      });

      tg.MainButton.show();
    }
  }, [course]);

  if (isLoading) return <Loader />;
  // if (!id) {
  //   return <p>Course is not found</p>;
  // }
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <Header label="Explore course" isLabelRight />
      <img src={course?.imageUrl} alt="Course" className={styles.image} />
      <div className={styles.description}>
        {course?.description}
        <Label text={name} style={{ isCenter: true }} />
      </div>
      <TonConnectButton />
      <button>{networkType}</button>
    </div>
  );
}

export default CourseDetailsPage;
