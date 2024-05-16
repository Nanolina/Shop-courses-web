import { FiEdit } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import styles from './ReadyCoursePart.module.css';

function ReadyCoursePart({ item, onDelete, isEdit, setIsEdit, navigate }: any) {
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
          onClick={(event) => {
            event.stopPropagation();
            onDelete(item.id);
          }}
        />
        <FiEdit
          color="var(--tg-theme-accent-text-color)"
          size={20}
          onClick={(event) => {
            event.stopPropagation();
            setIsEdit(!isEdit);
          }}
        />
      </div>
    </div>
  );
}

export default ReadyCoursePart;
