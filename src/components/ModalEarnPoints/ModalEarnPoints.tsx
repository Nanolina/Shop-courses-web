import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useModal } from '../../context';
import { pointsNumber } from '../../data';
import Modal from '../Modal/Modal';
import styles from './ModalEarnPoints.module.css';

function ModalEarnPoints() {
  const { t } = useTranslation();

  const { isOpen, hideModal, courseName, deployType } = useModal();

  return (
    <Modal isOpen={isOpen} onClose={hideModal}>
      <div className={styles.container}>
        <h3 className={styles.hooray}>{t('modal.hooray')}</h3>
        <LazyLoadImage
          src="https://res.cloudinary.com/dbrquscbv/image/upload/q_auto/f_auto/c_scale,w_1280/v1720707659/reward_etxdqk.png"
          alt="Earn points"
          effect="blur"
          className={styles.image}
        />
        <div className={styles.title}>
          {t('modal.earned_points')}
          <div className={styles.points}>
            {pointsNumber} {t('modal.points')} 🎉
          </div>
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
