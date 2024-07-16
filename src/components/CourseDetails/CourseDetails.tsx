import { TonConnectButton } from '@tonconnect/ui-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsInfoCircleFill } from 'react-icons/bs';
import { SiHiveBlockchain } from 'react-icons/si';
import { CUSTOMER, SELLER, USER } from '../../consts';
import { useContract } from '../../context';
import {
  getCSSVariableValue,
  getCategoryLabel,
  getSubcategoryLabel,
} from '../../functions';
import {
  useCourseActions,
  useCourseContract,
  usePurchaseContract,
} from '../../hooks';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import { ICourseDetailsProps } from '../types';
import styles from './CourseDetails.module.css';
import ChekBoxInput from '../../ui/ChekBoxInput/ChekBoxInput';
import Modal from '../Modal/Modal';
import ContractInfoModalContent from './ContractInfoModalContent';

const tg = window.Telegram.WebApp;
const purchaseFee = 0.07;

function CourseDetails({ course, role }: ICourseDetailsProps) {
  const { t } = useTranslation();
  const {
    courseContractBalance,
    purchaseContractBalance,
    hasAcceptedTermsCourse,
    setHasAcceptedTermsCourse,
    hasAcceptedTermsPurchase,
    setHasAcceptedTermsPurchase,
  } = useContract();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showModalFromSeller, setShowModalFromSeller] = useState<boolean>(true);

  const {
    isActivateButtonDisabled,
    activateButtonHint,
    navigateToModulesPage,
    getParamsMainButton,
    hintMessage,
  } = useCourseActions(course, role);

  const {
    errorContract: courseErrorContract,
    createCourse,
    loading: courseLoading,
    contractAddress: courseContractAddress,
  } = useCourseContract(course);

  const {
    errorContract: purchaseErrorContract,
    purchaseCourse,
    loading: purchaseLoading,
    contractAddress: purchaseContractAddress,
  } = usePurchaseContract(course);

  useEffect(() => {
    if (!courseLoading || !purchaseLoading) {
      setDataLoaded(true);
    }
  }, [courseLoading, purchaseLoading]);

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

  return (
    <>
      <div className={styles.info}>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <ContractInfoModalContent showModalFromSeller={showModalFromSeller} />
        </Modal>
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
        {role !== SELLER && role !== CUSTOMER && (
          <div className={styles.checkbox}>
            <ChekBoxInput
              checked={hasAcceptedTermsPurchase}
              type="checkbox"
              onChange={() =>
                setHasAcceptedTermsPurchase(!hasAcceptedTermsPurchase)
              }
              name={t('i_accept_the_terms')}
              id="chekbox"
            >
              <p>
                {t('i_accept_the_terms')}
                <b
                  className={styles.contract}
                  onClick={() => {
                    setModalOpen(!modalOpen);
                    setShowModalFromSeller(false);
                  }}
                >
                  {t('contracts')}
                </b>
                {t('i_accept_the_terms_personal_data')}
              </p>
            </ChekBoxInput>
          </div>
        )}
        {dataLoaded && role === SELLER && (
          <>
            <div className={styles.category}>
              <Label text={`${t('smart_contract_balance')}: `} isBold />
              <Label text={`${courseContractBalance} TON`} />
            </div>
            <div className={styles.contractAddress}>
              <Label text={`${t('smart_contract_address')}: `} isBold />
              <Label text={courseContractAddress} />
            </div>
            <div className={styles.checkbox}>
              <ChekBoxInput
                checked={hasAcceptedTermsCourse}
                type="checkbox"
                onChange={() =>
                  setHasAcceptedTermsCourse(!hasAcceptedTermsCourse)
                }
                name="chekbox"
                id="chekbox"
              >
                <p>
                  {t('i_accept_the_terms')}
                  <b
                    className={styles.contract}
                    onClick={() => {
                      setModalOpen(!modalOpen);
                      setShowModalFromSeller(true);
                    }}
                  >
                    {t('contracts')}
                  </b>
                  {t('i_accept_the_terms_personal_data')}
                </p>
              </ChekBoxInput>
            </div>
          </>
        )}
        {dataLoaded && role === CUSTOMER && (
          <>
            <div className={styles.category}>
              <Label text={`${t('smart_contract_balance')}: `} isBold />
              <Label text={`${purchaseContractBalance} TON`} />
            </div>
            <div className={styles.contractAddress}>
              <Label text={`${t('smart_contract_address')}: `} isBold />
              <Label text={purchaseContractAddress} />
            </div>
          </>
        )}
      </div>

      <TonConnectButton />

      {role === SELLER && (
        <>
          {dataLoaded && courseContractBalance <= 0 && (
            <div className={styles.warning}>{t('course_need_deploy')}</div>
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

      {role === CUSTOMER && dataLoaded && purchaseContractBalance <= 0 && (
        <div className={styles.warning}>{t('purchase_need_deploy')}</div>
      )}

      {courseErrorContract && <MessageBox errorMessage={courseErrorContract} />}
      {purchaseErrorContract && (
        <MessageBox errorMessage={purchaseErrorContract} />
      )}
      {role !== SELLER && hintMessage && (
        <div className={styles.hint}>
          <BsInfoCircleFill size={24} />
          {hintMessage}
        </div>
      )}
    </>
  );
}

export default CourseDetails;
