import { retrieveLaunchParams } from '@tma.js/sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { initDataRaw } = retrieveLaunchParams();

  // Translate type depending on the current language
  const translatedType =
    currentLanguage === 'ru' ? (type === 'module' ? 'модуль' : 'урок') : type; // for English leave the original

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
        confirm={deleteItem}
        buttonRightText={t('delete')}
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalText}>
            {t('delete_type', { type: translatedType })}
            <b> {item.name}</b>?
          </div>
          <img src="/delete.png" alt="Delete" className={styles.modalImage} />
          <div
            className={styles.modalText}
          >{`${type === MODULE ? t('module_all_lessons') : t('this_lesson')}`}</div>
        </div>
      </Modal>
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default React.memo(ReadyCoursePart);
