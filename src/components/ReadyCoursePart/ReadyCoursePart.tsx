import { useMutation, useQueryClient } from '@tanstack/react-query';
import { retrieveLaunchParams } from '@tma.js/sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate } from 'react-router-dom';
import { LESSON, MODULE, SELLER } from '../../consts';
import { getTranslatedType, handleAuthError } from '../../functions';
import { deleteCoursePartAPI } from '../../requests';
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
}: IReadyCoursePartProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { initDataRaw } = retrieveLaunchParams();

  const { singular } = getTranslatedType(type, t);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteCoursePartAPI(type, item.id, initDataRaw),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [`${type}s`, parentId],
      }),
    onError: (error: any) => {
      handleAuthError(error, setError);
    },
  });

  const handleDelete = async (event: any) => {
    event.stopPropagation();
    setModalOpen(true);
  };

  const deleteItem = async () => {
    deleteMutation.mutate();
    setModalOpen(false);
  };

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
        return 'https://res.cloudinary.com/dbrquscbv/image/upload/q_auto/f_auto/c_scale,w_1280/v1720707637/module_vagwor.png';
      case LESSON:
      default:
        return 'https://res.cloudinary.com/dbrquscbv/image/upload/q_auto/f_auto/c_scale,w_1280/v1720707632/lesson_exgdu0.png';
    }
  };

  useEffect(() => {
    if (role === SELLER) {
      setIsSeller(true);
    }
  }, [role]);

  return (
    <div className={styles.container} onClick={navigateHandler}>
      <LazyLoadImage
        src={getImageUrl()}
        alt="cover"
        effect="blur"
        className={styles.image}
      />
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
            {t('delete_type', { type: singular })}
            <b> {item.name}</b>?
          </div>
          <LazyLoadImage
            src="https://res.cloudinary.com/dbrquscbv/image/upload/q_auto/f_auto/c_scale,w_1280/v1720707415/delete_jy0ot5.png"
            alt="Delete"
            effect="blur"
            className={styles.modalImage}
          />
          <div
            className={styles.modalText}
          >{`${type === MODULE ? t('module_all_lessons') : t('this_lesson')}`}</div>
        </div>
      </Modal>

      {deleteMutation.isPending && <Loader />}
      {error && <MessageBox errorMessage={error} />}
    </div>
  );
}

export default React.memo(ReadyCoursePart);
