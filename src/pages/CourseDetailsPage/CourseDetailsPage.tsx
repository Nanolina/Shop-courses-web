import { retrieveLaunchParams } from '@tma.js/sdk';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseDetails from '../../components/CourseDetails/CourseDetails';
import Header from '../../components/Header/Header';
import { USER } from '../../consts';
import { getCSSVariableValue } from '../../functions';
import { useTonConnect } from '../../hooks';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import { createAxiosWithAuth } from '../../utils';
import { IGetCourse } from '../types';
import styles from './CourseDetailsPage.module.css';

const tg = window.Telegram.WebApp;

function CourseDetailsPage() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [showButtonBuy, setShowButtonBuy] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isUser, setIsUser] = useState<boolean>(false);

  const { wallet } = useTonConnect();
  const { initDataRaw } = retrieveLaunchParams();

  const getCourseDetails = useCallback(async () => {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<IGetCourse>(
        `/course/${courseId}`
      );
      const { role, course } = response.data;
      setCourse(course);
      if (role === USER) {
        setShowButtonBuy(true);
        setIsUser(true);
      }
      setName(course.name);
      setIsLoading(false);
      return course;
    } catch (error: any) {
      setError(error?.message || String(error));
      setIsLoading(false);
    }
  }, [courseId, initDataRaw]);

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
      const buttonColor = getCSSVariableValue('--tg-theme-button-color');
      tg.MainButton.setParams({
        text: `Buy for ${course.price} ${course.currency}`,
        is_active: !!wallet,
        color: !!wallet ? buttonColor : '#e6e9e9',
      });
      tg.MainButton.show();
      tg.onEvent('mainButtonClicked', onPurchaseCourse);
      return () => tg.offEvent('mainButtonClicked', onPurchaseCourse);
    }
  }, [course, onPurchaseCourse, showButtonBuy, wallet]);

  if (isLoading) return <Loader />;
  if (!course) return <div>Course is not found</div>;

  return (
    <Container>
      <Header label="Explore course" />
      <img src={course?.imageUrl} alt="Course" className={styles.image} />
      <CourseDetails
        name={name}
        description={course?.description}
        isUser={isUser}
      />
      {error && <MessageBox errorMessage={error} />}
    </Container>
  );
}

export default CourseDetailsPage;
