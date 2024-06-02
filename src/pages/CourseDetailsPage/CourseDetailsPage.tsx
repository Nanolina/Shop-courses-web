import { retrieveLaunchParams } from '@tma.js/sdk';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useTonConnect } from '../../hooks';
import { ICourse } from '../../types';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import { createAxiosWithAuth } from '../../utils';
import styles from './CourseDetailsPage.module.css';
import { USER } from '../../consts';

const tg = window.Telegram.WebApp;

function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [showButtonBuy, setShowButtonBuy] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { wallet } = useTonConnect();
  const { initDataRaw } = retrieveLaunchParams();
  const navigate = useNavigate();

  async function getCourseDetails() {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get(`/course/${courseId}`);
      const { role, course } = response.data;
      setCourse(course);
      if (role === USER) {
        setShowButtonBuy(true);
      }
      setName(course.name);
      setIsLoading(false);
      return course;
    } catch (error: any) {
      setError(error?.message || String(error));
      setIsLoading(false);
    }
  }

  const onPurchaseCourse = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.post<ICourse>(
        `/course/${course?.id}/purchase`,
        { walletAddressCustomer: wallet }
      );
      if (response.status === 201) {
        navigate('/course/purchased');
      }
      setIsLoading(false);
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }, [course?.id, initDataRaw, navigate, wallet]);

  useEffect(() => {
    setIsLoading(true);
    getCourseDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    if (course && showButtonBuy) {
      tg.MainButton.setParams({
        text: `Buy for ${course.price} ${course.currency}`,
      });
      tg.MainButton.show();
      tg.onEvent('mainButtonClicked', onPurchaseCourse);
      return () => tg.offEvent('mainButtonClicked', onPurchaseCourse);
    }
  }, [course, onPurchaseCourse, showButtonBuy]);

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
      </div>
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default CourseDetailsPage;
