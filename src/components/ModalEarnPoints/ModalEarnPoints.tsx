import { useModal } from '../../context';
import Modal from '../Modal/Modal';
import styles from './ModalEarnPoints.module.css';

function ModalEarnPoints() {
  const { isOpen, hideModal, courseName, deployType } = useModal();

  return (
    <Modal isOpen={isOpen} onClose={hideModal}>
      <div className={styles.container}>
        <h3 className={styles.hooray}>Hooray!</h3>
        <img src="/reward.png" alt="Earn points" className={styles.image} />
        <div className={styles.title}>
          You've earned <div className={styles.points}>20 points 🎉</div>
        </div>
        <div className={styles.thanks}>
          {deployType === 'create' ? (
            <>
              Thank you for activating the course <b>{courseName}</b> in the TON
              blockchain!
            </>
          ) : (
            <>
              Thank you for purchasing the course
              <b className={styles.courseName}> {courseName}!</b>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ModalEarnPoints;
