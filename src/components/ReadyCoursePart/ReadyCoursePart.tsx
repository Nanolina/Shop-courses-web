import React, { useCallback } from 'react';
import { FiEdit } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { DELETE, LESSON, MODULE } from '../../consts';
import { IReadyCoursePartProps } from '../types';
import styles from './ReadyCoursePart.module.css';

function ReadyCoursePart({
  item,
  type,
  isEdit,
  setIsEdit,
}: IReadyCoursePartProps) {
  const tg = window.Telegram.WebApp;
  const navigate = useNavigate();

  async function handleDelete(event: React.MouseEvent<SVGElement>) {
    event.stopPropagation();
    tg.sendData(
      JSON.stringify({
        type,
        id: item.id,
        method: DELETE,
      })
    );
  }

  const handleEdit = useCallback(
    (event: React.MouseEvent<SVGElement>) => {
      event.stopPropagation();
      //setIsEdit(!isEdit);
      navigate(`/course-part/${type}/${item.id}`);
    },
    [ item.id, navigate, type]
  );

  const navigateHandler = useCallback(() => {
    if (type === MODULE) {
      navigate(`/lesson/module/${item.id}`);
    } else if (type === LESSON) {
      navigate(`/lesson/${item.id}`);
    }
  }, [navigate, item.id, type]);

  return (
    <div className={styles.container} onClick={navigateHandler}>
      <img className={styles.cover} src={`${item.imageUrl}`} alt="cover" />
      <div className={styles.info}>
        <div className={styles.name}>{item.name}</div>
        <p className={styles.description}>{item.description}</p>
      </div>
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
    </div>
  );
}

export default React.memo(ReadyCoursePart);
