import { TonConnectButton } from '@tonconnect/ui-react';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SiHiveBlockchain } from 'react-icons/si';
import { CUSTOMER, SELLER, USER } from '../../consts';
import {
  getCSSVariableValue,
  getCategoryLabel,
  getSubcategoryLabel,
} from '../../functions';
import {
  useCourseActions,
  useCourseContract,
  usePurchaseContract,
  useTonConnect,
} from '../../hooks';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import { ICourseDetailsProps } from '../types';
import styles from './CourseDetails.module.css';

const isProduction = process.env.REACT_APP_ENVIRONMENT === 'production';
const tg = window.Telegram.WebApp;
const purchaseFee = 0.1;

function CourseDetails({ course, role }: ICourseDetailsProps) {
  const { t } = useTranslation();

  const {
    isLoading,
    error,
    isActivateButtonDisabled,
    activateButtonHint,
    isMainnet,
    navigateToModulesPage,
  } = useCourseActions(course, role);

  const { balance, errorContract, contractAddress, createCourse } =
    useCourseContract(course, role);

  const {
    customerId,
    balance: purchaseBalance,
    errorContract: purchaseErrorContract,
    purchaseContractAddress,
    purchaseCourse,
  } = usePurchaseContract(course, role);

  const { connected } = useTonConnect();

  const getParamsMainButton = useCallback(() => {
    const buttonColor = getCSSVariableValue('--tg-theme-button-color');
    const isActive =
      (isProduction && isMainnet && connected) || (!isProduction && connected);
    const color = isActive ? buttonColor : '#e6e9e9';

    return {
      is_active: isActive,
      color,
    };
  }, [isMainnet, connected]);

  useEffect(() => {
    if (role === USER) {
      tg.MainButton.setParams({
        text: `${t('buy')} ${course.price + purchaseFee} ${course.currency}`,
        is_active: getParamsMainButton().is_active,
        color: getParamsMainButton().color,
      });
      tg.onEvent('mainButtonClicked', purchaseCourse);
      return () => tg.offEvent('mainButtonClicked', purchaseCourse);
    } else if (role === SELLER || role === CUSTOMER) {
      tg.MainButton.setParams({
        text: t('modules'),
      });
      tg.onEvent('mainButtonClicked', navigateToModulesPage);
      return () => tg.offEvent('mainButtonClicked', navigateToModulesPage);
    }
  }, [
    course,
    navigateToModulesPage,
    purchaseCourse,
    role,
    getParamsMainButton,
    t,
  ]);

  if (isLoading) return <Loader />;

  return (
    <>
      <div>customerId {customerId}</div>
      <div>contractCourseAddress {contractAddress}</div>
      <div>purchaseContractAddress {purchaseContractAddress}</div>
      <div>purchaseBalance {purchaseBalance}</div>
      <div>purchaseErrorContract {purchaseErrorContract}</div>
      <div>courseErrorContract {errorContract}</div>
      {role === SELLER && (
        <>
          <div className={styles.warning}>
            {t('course_purchase_not_available')}
          </div>
          <div className={styles.activateButtonContainer}>
            <Button
              onClick={createCourse}
              text={t('activate')}
              icon={<SiHiveBlockchain size={18} />}
              disabled={isActivateButtonDisabled}
              hint={activateButtonHint}
            />
            <div className={styles.hint}>
              <Label text={`${t('smart_contract_balance')}: `} />
              <Label text={`${balance} TON`} />
            </div>
          </div>
        </>
      )}

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
      </div>

      <TonConnectButton />

      {error && <MessageBox errorMessage={error} />}
      {errorContract && <MessageBox errorMessage={errorContract} />}
    </>
  );
}

export default CourseDetails;
