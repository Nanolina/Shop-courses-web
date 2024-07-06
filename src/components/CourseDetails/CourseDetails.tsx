import { TonConnectButton } from '@tonconnect/ui-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BsInfoCircleFill } from 'react-icons/bs';
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
const purchaseFee = 0.07;

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

  const {
    balance: courseContractBalance,
    errorContract,
    createCourse,
  } = useCourseContract(course, role);

  const {
    balance: purchaseContractBalance,
    errorContract: purchaseErrorContract,
    purchaseCourse,
  } = usePurchaseContract(course, role);

  const { connected } = useTonConnect();

  const getParamsMainButton = useCallback(() => {
    const buttonColor = getCSSVariableValue('--tg-theme-button-color');
    const isActive =
      (isProduction && isMainnet && connected && courseContractBalance > 0) ||
      (!isProduction && connected && courseContractBalance > 0);
    const color = isActive ? buttonColor : '#e6e9e9';

    return {
      is_active: isActive,
      color,
    };
  }, [isMainnet, connected, courseContractBalance]);

  const hintMessage = useMemo(() => {
    if (isProduction && !isMainnet) {
      return t('connect_wallet_mainnet');
    }
    if (!connected) {
      return t('connect_wallet');
    }
    if (courseContractBalance <= 0) {
      return t('course_not_activated');
    }
    return '';
  }, [isMainnet, connected, courseContractBalance, t]);

  useEffect(() => {
    if (role === USER || (role === CUSTOMER && purchaseContractBalance <= 0)) {
      tg.MainButton.setParams({
        text: `${t('buy')} ${course.price + purchaseFee} ${course.currency}`,
        is_active: getParamsMainButton().is_active,
        color: getParamsMainButton().color,
      });
      tg.onEvent('mainButtonClicked', purchaseCourse);
      return () => tg.offEvent('mainButtonClicked', purchaseCourse);
    } else if (
      role === SELLER ||
      (role === CUSTOMER && purchaseContractBalance > 0)
    ) {
      tg.MainButton.setParams({
        text: t('modules'),
        is_active: true,
        color: getCSSVariableValue('--tg-theme-button-color'),
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
    purchaseContractBalance,
    t,
  ]);

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
          <Label text={`${t('сategory')}: `} isBold />
          <Label text={getCategoryLabel(course.category, t)} />
        </div>
        {course.subcategory && (
          <div className={styles.category}>
            <Label text={`${t('subcategory')}: `} isBold />
            <Label
              text={getSubcategoryLabel(
                course.category,
                course.subcategory || '',
                t
              )}
            />
          </div>
        )}
        {role === SELLER && (
          <div className={styles.category}>
            <Label text={`${t('smart_contract_balance')}: `} isBold />
            <Label text={`${courseContractBalance} TON`} />
          </div>
        )}
        {role === CUSTOMER && (
          <div className={styles.category}>
            <Label text={`${t('smart_contract_balance')}: `} isBold />
            <Label text={`${purchaseContractBalance} TON`} />
          </div>
        )}
      </div>

      <TonConnectButton />

      {role === SELLER && (
        <>
          {courseContractBalance <= 0 && (
            <div className={styles.warning}>
              {t('course_purchase_not_available')}
            </div>
          )}
          <Button
            onClick={createCourse}
            text={t('activate')}
            icon={<SiHiveBlockchain size={18} />}
            disabled={isActivateButtonDisabled}
            hint={activateButtonHint}
          />
        </>
      )}

      {error && <MessageBox errorMessage={error} />}
      {errorContract && <MessageBox errorMessage={errorContract} />}
      {purchaseErrorContract && (
        <MessageBox errorMessage={purchaseErrorContract} />
      )}
      {role !== SELLER && hintMessage && (
        <div className={styles.hint}>
          <BsInfoCircleFill size={16} />
          {hintMessage}
        </div>
      )}
    </>
  );
}

export default CourseDetails;
