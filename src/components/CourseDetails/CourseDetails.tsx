import { TonConnectButton } from '@tonconnect/ui-react';
import { useTranslation } from 'react-i18next';
import { SiHiveBlockchain } from 'react-icons/si';
import { CUSTOMER, SELLER } from '../../consts';
import { getCategoryLabel, getSubcategoryLabel } from '../../functions';
import { useCourseActions, useCourseContract } from '../../hooks';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import ModalEarnPoints from '../ModalEarnPoints/ModalEarnPoints';
import { ICourseDetailsProps } from '../types';
import styles from './CourseDetails.module.css';

function CourseDetails({ course, role }: ICourseDetailsProps) {
  const { t } = useTranslation();

  const {
    modalOpen,
    setModalOpen,
    deployType,
    isLoading,
    error,
    isActivateButtonDisabled,
    activateButtonHint,
  } = useCourseActions(course, role);

  const { createCourse, errorContract, balance } = useCourseContract(
    course,
    role
  );

  if (isLoading) return <Loader />;

  return (
    <>
      <div>modalOpen: {modalOpen ? 'true' : 'false'}</div>
      <div>deployType: {deployType}</div>
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
