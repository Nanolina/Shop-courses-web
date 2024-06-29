import Modal from '../Modal/Modal';
import { IModalEarnPointsProps } from '../types';
import styles from './ModalEarnPoints.module.css';

function ModalEarnPoints({
  isOpen,
  onClose,
  courseName,
  deployType,
}: IModalEarnPointsProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
              Thank you for purchasing the course <b>{courseName}</b>!
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ModalEarnPoints;
