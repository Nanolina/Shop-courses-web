import { useTranslation } from 'react-i18next';
import { useModal } from '../../context';
import Modal from '../Modal/Modal';
import styles from './ModalEarnPoints.module.css';

function ModalEarnPoints() {
  const { t } = useTranslation();

  const { isOpen, hideModal, courseName, deployType } = useModal();

  return (
    <Modal isOpen={isOpen} onClose={hideModal}>
      <div className={styles.container}>
        <h3 className={styles.hooray}>{t('modal.hooray')}</h3>
        <img src="/reward.png" alt="Earn points" className={styles.image} />
        <div className={styles.title}>
          {t('modal.earned_points')}
          <div className={styles.points}>20 {t('modal.points')} 🎉</div>
        </div>
        <div className={styles.thanks}>
          {deployType === 'create' ? (
            <>
              {t('modal.activating')} <b>{courseName}</b>
              {t('modal.blockchain')}
            </>
          ) : (
            <>
              {t('modal.purchasing')}{' '}
              <b className={styles.courseName}> {courseName}!</b>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ModalEarnPoints;
