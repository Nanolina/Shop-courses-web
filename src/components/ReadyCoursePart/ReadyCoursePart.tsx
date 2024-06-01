import { retrieveLaunchParams } from '@tma.js/sdk';
import React, { useCallback, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { LESSON, MODULE } from '../../consts';
import { Loader } from '../../ui/Loader/Loader';
import { createAxiosWithAuth } from '../../utils';
import Modal from '../ModalWindow/Modal';
import { IReadyCoursePartProps } from '../types';
import styles from './ReadyCoursePart.module.css';

function ReadyCoursePart({
  item,
  type,
  updatePageData,
}: IReadyCoursePartProps) {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSeller, setIsSeller] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { initDataRaw } = retrieveLaunchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const text = `Delete ${type} ${item.name} ?`

  async function handleDelete(event: any) {
    event.stopPropagation();
    setModalOpen(true);
  }

  async function deleteItem() {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      await axiosWithAuth.delete(`/${type}/${item.id}`);
      updatePageData();
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }

  const handleEdit = useCallback(
    (event: React.MouseEvent<SVGElement>) => {
      event.stopPropagation();
      navigate(`/course-part/${type}/${item.id}`);
    },
    [item.id, navigate, type]
  );

  const navigateHandler = useCallback(() => {
    if (type === MODULE) {
      navigate(`/lesson/module/${item.id}`);
    } else if (type === LESSON) {
      navigate(`/lesson/${item.id}`);
    }
  }, [navigate, item.id, type]);

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container} onClick={navigateHandler}>
      <img className={styles.cover} src={`${item.imageUrl}`} alt="cover" />
      <div className={styles.info}>
        <div className={styles.name}>{item.name}</div>
        <p className={styles.description}>{item.description}</p>
      </div>
      {isSeller && (
        <div className={styles.icons}>
          <MdDeleteForever
            className={styles.cross}
            color="var(--tg-theme-accent-text-color)"
            size={24}
            onClick={handleDelete}
          />
          <FiEdit
            color="var(--tg-theme-accent-text-color)"
            size={20}
            onClick={handleEdit}
          />
        </div>
      )}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        content={
          <>
            <h2>{text}</h2>
            <p>Are you sure you want to delete it?</p>
          </>
        }
        confirm={deleteItem}
      />
    </div>
  );
}

export default React.memo(ReadyCoursePart);
