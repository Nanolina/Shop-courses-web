import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsInfoCircleFill } from 'react-icons/bs';
import { usePoints } from '../../context';
import styles from './Points.module.css';

function Points() {
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { points } = usePoints();

  return (
    <div className={styles.points}>
      <BsInfoCircleFill size={16} onClick={() => setModalOpen(!modalOpen)} />
      {t('my_points')}: <b>{points}</b>
    </div>
  );
}

export default Points;
