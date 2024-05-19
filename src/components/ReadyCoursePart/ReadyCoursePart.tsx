import React, { useCallback } from 'react';
import { FiEdit } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import styles from './ReadyCoursePart.module.css';

function ReadyCoursePart({ item, onDelete, isEdit, setIsEdit, navigate }: any) {
  const handleDelete = useCallback(
    (event: any) => {
      event.stopPropagation();
      onDelete(item.id);
    },
    [onDelete, item.id]
  );

  const handleEdit = useCallback(
    (event: any) => {
      event.stopPropagation();
      setIsEdit(!isEdit);
    },
    [isEdit, setIsEdit]
  );

  return (
    <div className={styles.container} onClick={navigate}>
      <img
        className={styles.cover}
        src="https://avatars.githubusercontent.com/u/39895671?v=4"
        alt="cover"
      />
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
