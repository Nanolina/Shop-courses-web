import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsInfoCircleFill } from 'react-icons/bs';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { usePoints } from '../../context';
import Modal from '../Modal/Modal';
import styles from './Points.module.css';
import PointsInfoModalContent from './PointsInfoModalContent';

function Points() {
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const { points } = usePoints();

  const handleNext = () => {
    setPage((prevPage) => (prevPage < 3 ? prevPage + 1 : prevPage));
  };

  const handlePrevious = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  return (
    <div className={styles.container}>
      <div className={styles.points} onClick={() => setModalOpen(true)}>
        <BsInfoCircleFill size={16} />
        {t('my_points')}: <b>{points}</b>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <PointsInfoModalContent page={page} />
        <div className={styles.navigation}>
          {page > 1 && (
            <FaArrowLeft
              onClick={handlePrevious}
              className={`${styles.arrow} ${styles.left}`}
              size={24}
            />
          )}
          {page < 3 && (
            <FaArrowRight
              onClick={handleNext}
              className={`${styles.arrow} ${styles.right}`}
              size={24}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Points;
