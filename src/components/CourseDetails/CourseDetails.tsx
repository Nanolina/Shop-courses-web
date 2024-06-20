import { retrieveLaunchParams } from '@tma.js/sdk';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SiHiveBlockchain } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import { categoryOptions, subcategoryOptions } from '../../category-data';
import { CUSTOMER, SELLER, USER } from '../../consts';
import {
  capitalizeFirstLetter,
  createAxiosWithAuth,
  getCSSVariableValue,
  handleAuthError,
} from '../../functions';
import { useContract, useTonConnect } from '../../hooks';
import { ICourse } from '../../types';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import { ICourseDetailsProps } from '../types';
import styles from './CourseDetails.module.css';

const tg = window.Telegram.WebApp;

function CourseDetails({ course, role }: ICourseDetailsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { wallet, connected } = useTonConnect();

  const { purchaseCourse, createCourse } = useContract(course.id, course.price);
  const { initDataRaw } = retrieveLaunchParams();

  const getCategoryLabel = (value: string) => {
    const category = categoryOptions.find((option) => option.value === value);
    return category ? category.label : value;
  };

  const getSubcategoryLabel = (category: string, value: string) => {
    const subcategory = subcategoryOptions[category]?.find(
      (option) => option.value === value
    );
    return subcategory ? subcategory.label : value;
  };

  const navigateToModulesPage = useCallback(
    () => navigate(`/module/course/${course.id}`),
    [course.id, navigate]
  );

  const handlePurchaseCourse = useCallback(async () => {
    purchaseCourse();
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.post<ICourse>(
        `/course/${course?.id}/purchase`
      );
      if (response.status === 201) {
        navigate('/course/purchased');
      }
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }, [course?.id, initDataRaw, navigate, purchaseCourse]);

  useEffect(() => {
    if (role === USER && !connected) {
      tg.MainButton.hide();
    } else {
      tg.MainButton.show();
    }
  }, [connected, role]);

  useEffect(() => {
    if (role === USER) {
      const buttonColor = getCSSVariableValue('--tg-theme-button-color');
      tg.MainButton.setParams({
        text: `Buy for ${course.price} ${course.currency}`,
        is_active: !!wallet,
        color: !!wallet ? buttonColor : '#e6e9e9',
      });
      tg.onEvent('mainButtonClicked', handlePurchaseCourse);
      return () => tg.offEvent('mainButtonClicked', handlePurchaseCourse);
    } else if (role === SELLER || role === CUSTOMER) {
      tg.MainButton.setParams({
        text: 'Modules',
      });
      tg.onEvent('mainButtonClicked', navigateToModulesPage);
      return () => tg.offEvent('mainButtonClicked', navigateToModulesPage);
    }
  }, [course, navigateToModulesPage, handlePurchaseCourse, role, wallet]);

  if (isLoading) return <Loader />;

  return (
    <>
      <div className={styles.info}>
        <Label text={course.name} isBig isBold />
        {course.description && (
          <div className={styles.descriptionText}>{course.description}</div>
        )}
        {role !== CUSTOMER && (
          <div className={styles.price}>
            <Label text={`${capitalizeFirstLetter(t('price'))}: `} isBold />
            <Label text={course.price} />
            {course.currency === 'TON' ? (
              <img
                src="/toncoin-logo.png"
                alt="TON"
                className={styles.toncoin}
              />
            ) : (
              course.currency
            )}
          </div>
        )}
        <div className={styles.category}>
          <Label text="Category: " isBold />
          <Label text={getCategoryLabel(course.category)} />
        </div>
        {course.subcategory && (
          <div className={styles.category}>
            <Label text="Subcategory: " isBold />
            <Label
              text={getSubcategoryLabel(
                course.category,
                course.subcategory || ''
              )}
            />
          </div>
        )}
      </div>
      <TonConnectButton />

      {role === SELLER && (
        <Button
          onClick={createCourse}
          text="Activate"
          icon={<SiHiveBlockchain size={18} />}
        />
      )}
      {error && <MessageBox errorMessage={error} />}
    </>
  );
}

export default CourseDetails;
