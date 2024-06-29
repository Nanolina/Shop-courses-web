import { retrieveLaunchParams } from '@tma.js/sdk';
import { CHAIN, TonConnectButton } from '@tonconnect/ui-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SiHiveBlockchain } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import { categoryOptions, subcategoryOptions } from '../../category-data';
import { CUSTOMER, SELLER, USER } from '../../consts';
import {
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
import ModalEarnPoints from '../ModalEarnPoints/ModalEarnPoints';
import { ICourseDetailsProps } from '../types';
import styles from './CourseDetails.module.css';

const tg = window.Telegram.WebApp;
const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';

function CourseDetails({ course, role }: ICourseDetailsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isActivateButtonDisabled, setIsActivateButtonDisabled] =
    useState<boolean>(true);
  const [activateButtonHint, setActivateButtonHint] = useState<string>('');
  const [isMainnet, setIsMainnet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { wallet, connected, network } = useTonConnect();
  const {
    purchaseCourse,
    createCourse,
    errorContract,
    balance,
    deployType,
    modalOpen,
    setModalOpen,
  } = useContract(course.id, course.price);
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
    setIsLoading(true);
    try {
      purchaseCourse();
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
        text: `${t('buy')} ${course.price} ${course.currency}`,
        is_active: !!wallet,
        color: !!wallet ? buttonColor : '#e6e9e9',
      });
      tg.onEvent('mainButtonClicked', handlePurchaseCourse);
      return () => tg.offEvent('mainButtonClicked', handlePurchaseCourse);
    } else if (role === SELLER || role === CUSTOMER) {
      tg.MainButton.setParams({
        text: t('modules'),
      });
      tg.onEvent('mainButtonClicked', navigateToModulesPage);
      return () => tg.offEvent('mainButtonClicked', navigateToModulesPage);
    }
  }, [course, navigateToModulesPage, handlePurchaseCourse, role, wallet, t]);

  // Сheck which network the wallet is from
  useEffect(() => {
    setIsMainnet(network === CHAIN.MAINNET);
  }, [network]);

  // Handle activate button
  useEffect(() => {
    let hint = '';
    let disabled = true;

    if (!connected) {
      hint = 'Please connect the wallet';
    } else if (isProduction && !isMainnet) {
      hint = 'Please connect the wallet from the main network';
    } else {
      disabled = false;
    }

    setActivateButtonHint(hint);
    setIsActivateButtonDisabled(disabled);
  }, [connected, isMainnet]);

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
            <Label text={`${t('price')}: `} isBold />
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
          <Label text={`${t('category')}: `} isBold />
          <Label text={getCategoryLabel(course.category)} />
        </div>
        {course.subcategory && (
          <div className={styles.category}>
            <Label text={`${t('subcategory')}: `} isBold />
            <Label
              text={getSubcategoryLabel(
                course.category,
                course.subcategory || ''
              )}
            />
          </div>
        )}
        {role === SELLER && (
          <div className={styles.category}>
            <Label text={`${t('smart_contract_balance')}: `} isBold />
            <Label text={`${balance} TON`} />
          </div>
        )}
      </div>
      <TonConnectButton />

      {role === SELLER && (
        <Button
          onClick={createCourse}
          text={t('activate')}
          icon={<SiHiveBlockchain size={18} />}
          disabled={isActivateButtonDisabled}
          hint={activateButtonHint}
        />
      )}

      {error && <MessageBox errorMessage={error} />}
      {errorContract && <MessageBox errorMessage={errorContract} />}
      <ModalEarnPoints
        isOpen={modalOpen}
        courseName={course.name}
        onClose={() => setModalOpen(false)}
        deployType={deployType}
      />
    </>
  );
}

export default CourseDetails;
