import { TonConnectButton } from '@tonconnect/ui-react';
import { useEffect } from 'react';
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

const tg = window.Telegram.WebApp;
const purchaseFee = 0.1;

function CourseDetails({ course, role }: ICourseDetailsProps) {
  const { t } = useTranslation();

  const {
    isLoading,
    error,
    isActivateButtonDisabled,
    activateButtonHint,
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

  const { wallet } = useTonConnect();

  useEffect(() => {
    if (role === USER) {
      const buttonColor = getCSSVariableValue('--tg-theme-button-color');
      tg.MainButton.setParams({
        text: `${t('buy')} ${course.price + purchaseFee} ${course.currency}`,
        is_active: !!wallet,
        color: !!wallet ? buttonColor : '#e6e9e9',
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
  }, [course, navigateToModulesPage, purchaseCourse, role, wallet, t]);

  if (isLoading) return <Loader />;

  return (
    <>
      <div className={styles.info}>
        <div>customerId {customerId}</div>
        <div>contractCourseAddress {contractAddress}</div>
        <div>purchaseContractAddress {purchaseContractAddress}</div>
        <div>purchaseBalance {purchaseBalance}</div>
        <div>purchaseErrorContract {purchaseErrorContract}</div>
        <div>courseErrorContract {errorContract}</div>
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
    </>
  );
}

export default CourseDetails;
