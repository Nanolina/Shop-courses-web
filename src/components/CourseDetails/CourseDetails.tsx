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
import CheckboxInput from '../../ui/CheckboxInput/CheckboxInput';
import Label from '../../ui/Label/Label';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import Modal from '../Modal/Modal';
import { ICourseDetailsProps } from '../types';
import ContractInfoModalContent from './ContractInfoModalContent';
import styles from './CourseDetails.module.css';
import { LuHeartHandshake } from 'react-icons/lu';

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
  const [dataLoadedFromBlockchain, setDataLoadedFromBlockchain] =
    useState<boolean>(false);
  const [modalContractOpen, setModalContractOpen] = useState<boolean>(false);
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
    showModalCourse,
    setShowModalCourse,
  } = useCourseContract(course);

  const {
    errorContract: purchaseErrorContract,
    purchaseCourse,
    showModalPurchase,
    setShowModalPurchase,
    loading: purchaseLoading,
    contractAddress: purchaseContractAddress,
  } = usePurchaseContract(course);

  useEffect(() => {
    if (!courseLoading || !purchaseLoading) {
      setDataLoadedFromBlockchain(true);
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
        <Modal
          isOpen={showModalCourse || showModalPurchase}
          onClose={() => {
            setShowModalCourse(false);
            setShowModalPurchase(false);
          }}
        >
          <div className={styles.modalInfo}>
            <p className={styles.dearUser}>{t('dear_user')}</p>
            <p className={styles.updatingData}>{t('updating_data')}</p>
            <div className={styles.hint}>{t('dont_close')}</div>
            <p className={styles.action}>{t('action_prescription')}</p>
            <p className={styles.thankYou}>
              {t('thank_you')}
              <LuHeartHandshake className={styles.heart} />
            </p>
          </div>
        </Modal>
        <Modal
          isOpen={modalContractOpen}
          onClose={() => setModalContractOpen(false)}
        >
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
            <CheckboxInput
              checked={hasAcceptedTermsPurchase}
              onChange={() =>
                setHasAcceptedTermsPurchase(!hasAcceptedTermsPurchase)
              }
              id="hasAcceptedTermsPurchase"
            >
              <p>
                {t('i_accept_the_terms')}
                <b
                  className={styles.contract}
                  onClick={() => {
                    setModalContractOpen(!modalContractOpen);
                    setShowModalFromSeller(false);
                  }}
                >
                  {t('contracts')}
                </b>
                {t('i_accept_the_terms_personal_data')}
              </p>
            </CheckboxInput>
          </div>
        )}
        {dataLoadedFromBlockchain && role === SELLER && (
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
              <CheckboxInput
                checked={hasAcceptedTermsCourse}
                onChange={() =>
                  setHasAcceptedTermsCourse(!hasAcceptedTermsCourse)
                }
                id="hasAcceptedTermsCourse"
              >
                <p>
                  {t('i_accept_the_terms')}
                  <b
                    className={styles.contract}
                    onClick={() => {
                      setModalContractOpen(!modalContractOpen);
                      setShowModalFromSeller(true);
                    }}
                  >
                    {t('contracts')}
                  </b>
                  {t('i_accept_the_terms_personal_data')}
                </p>
              </CheckboxInput>
            </div>
          </>
        )}
        {dataLoadedFromBlockchain && role === CUSTOMER && (
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
          {dataLoadedFromBlockchain && courseContractBalance <= 0 && (
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

      {role === CUSTOMER &&
        dataLoadedFromBlockchain &&
        purchaseContractBalance <= 0 && (
          <div className={styles.warning}>{t('purchase_need_deploy')}</div>
        )}

      {role !== SELLER && hintMessage && (
        <div className={styles.hint}>
          <BsInfoCircleFill size={24} />
          {hintMessage}
        </div>
      )}

      {courseErrorContract && <MessageBox errorMessage={courseErrorContract} />}
      {purchaseErrorContract && (
        <MessageBox errorMessage={purchaseErrorContract} />
      )}
    </>
  );
}

export default CourseDetails;
