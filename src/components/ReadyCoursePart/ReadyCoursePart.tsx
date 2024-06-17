import { retrieveLaunchParams } from '@tma.js/sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { LESSON, MODULE, SELLER } from '../../consts';
import { createAxiosWithAuth, handleAuthError } from '../../functions';
import { Loader } from '../../ui/Loader/Loader';
import { MessageBox } from '../../ui/MessageBox/MessageBox';
import Modal from '../Modal/Modal';
import { IReadyCoursePartProps } from '../types';
import styles from './ReadyCoursePart.module.css';

function ReadyCoursePart({
  item,
  type,
  parentId,
  role,
  updateItems,
}: IReadyCoursePartProps) {
  const navigate = useNavigate();
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { initDataRaw } = retrieveLaunchParams();

  async function handleDelete(event: any) {
    event.stopPropagation();
    setModalOpen(true);
  }

  async function deleteItem() {
    setIsLoading(true);
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      await axiosWithAuth.delete(`/${type}/${item.id}`);
      updateItems();
    } catch (error: any) {
      handleAuthError(error, setError);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = useCallback(
    (event: React.MouseEvent<SVGElement>) => {
      event.stopPropagation();
      navigate(`/course-part/edit/${parentId}/${type}/${item.id}`);
    },
    [item.id, navigate, parentId, type]
  );

  const navigateHandler = useCallback(() => {
    if (type === MODULE) {
      navigate(`/lesson/module/${item.id}`);
    } else if (type === LESSON) {
      navigate(`/lesson/${item.id}`);
    }
  }, [navigate, item.id, type]);

  const getImageUrl = () => {
    if (item.imageUrl) {
      return item.imageUrl;
    }
    switch (type) {
      case MODULE:
        return '/module.png';
      case LESSON:
        return '/lesson.png';
      default:
        return '/lesson.png';
    }
  };

  useEffect(() => {
    if (role === SELLER) {
      setIsSeller(true);
    }
  }, [role]);

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container} onClick={navigateHandler}>
      <img className={styles.image} src={getImageUrl()} alt="cover" />
      <div className={styles.info}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.description}>{item.description}</div>
      </div>
      {isSeller && (
        <div className={styles.icons}>
          <MdDelete
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
          <div className={styles.modalTextContainer}>
            <div>
              {`Are you sure you want to delete ${type} `}
              <b>{item.name}</b>?
            </div>
            <div>{`${type === MODULE ? 'This module and all lessons' : 'This lesson'} will be irretrievably deleted`}</div>
          </div>
        }
        confirm={deleteItem}
      />
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default React.memo(ReadyCoursePart);
