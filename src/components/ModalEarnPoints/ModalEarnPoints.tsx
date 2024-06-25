import Modal from '../Modal/Modal';
import { IModalEarnPointsProps } from '../types';
import styles from './ModalEarnPoints.module.css';

function ModalEarnPoints({
  isOpen,
  onClose,
  courseName,
}: IModalEarnPointsProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<h3 className={styles.hooray}>Hooray!</h3>}
      content={
        <>
          <div className={styles.title}>
            You've earned <div className={styles.points}>20 points 🎉</div>
          </div>
          <div>
            Thank you for activating the course
            <b> {courseName}</b> in the TON blockchain!
          </div>
        </>
      }
      imageUrl="/reward.png"
    />
  );
}

export default ModalEarnPoints;
