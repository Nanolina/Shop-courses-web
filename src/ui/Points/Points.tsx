import { retrieveLaunchParams } from '@tma.js/sdk';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsInfoCircleFill } from 'react-icons/bs';
import { createAxiosWithAuth } from '../../functions';
import styles from './Points.module.css';

function Points() {
  const { t } = useTranslation();

  const [points, setPoints] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const { initDataRaw } = retrieveLaunchParams();

  const handleGetPoints = useCallback(async () => {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      const response = await axiosWithAuth.get<number>(`/points`);
      setPoints(response.data);
    } catch (error: any) {}
  }, []);

  useEffect(() => {
    handleGetPoints();
  }, []);

  return (
    <div className={styles.points}>
      <BsInfoCircleFill size={16} onClick={() => setModalOpen(!modalOpen)} />
      {t('my_points')}: <b>{points}</b>
    </div>
  );
}

export default Points;
