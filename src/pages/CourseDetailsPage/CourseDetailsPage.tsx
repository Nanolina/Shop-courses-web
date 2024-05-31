import { TonConnectButton } from '@tonconnect/ui-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useContract } from '../../hooks/useContract';
import { ICourse } from '../../types';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import styles from './CourseDetailsPage.module.css';

const tg = window.Telegram.WebApp;
const serverUrl = process.env.REACT_APP_SERVER_URL;

function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { createCourse } = useContract();

  async function getCourseDetails() {
    try {
      const courseApiUrl = `${serverUrl}/course/${courseId}`;
      const response = await axios.get<ICourse>(courseApiUrl);
      setCourse(response.data);
      setName(response.data.name);
      setIsLoading(false);
      return response.data;
    } catch (error: any) {
      setError(error?.message || String(error));
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
  if (!course) return <MessageBox errorMessage="Course is not found" />;

  return (
    <div className={styles.container}>
      <Header label="Explore course" isLabelRight />
      <img src={course?.imageUrl} alt="Course" className={styles.image} />
      <div className={styles.description}>
        {course?.description}
        <Label text={name} isCenter={true} />
      </div>
      <div className={styles.walletContainer}>
        <div>
          In order for your course to appear in the store, it must be submitted
          to the blockchain. You need to click on the button below to connect
          your wallet. This wallet will receive funds from the sale of your
          course.
        </div>
        <TonConnectButton />
        <div>
          Click on the button below to activate the course. You will have to pay
          to rent a smart contract on the blockchain for your course to exist
          there
        </div>
        <Button text="Activate" onClick={() => createCourse(course.id)} />
      </div>
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default CourseDetailsPage;
