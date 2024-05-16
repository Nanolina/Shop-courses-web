import { FiEdit } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import styles from './ReadyModule.module.css';

function ReadyModule({ module, onDelete, isEdit, setIsEdit }: any) {
  return (
    <div className={styles.container}>
      <img
        className={styles.cover}
        src="https://avatars.githubusercontent.com/u/39895671?v=4"
        alt="cover"
      />
      <div className={styles.info}>
        <div className={styles.name}>{module.name}</div>
        <p className={styles.description}>{module.description}</p>
      </div>
      <div className={styles.icons}>
        <MdDeleteForever
          className={styles.cross}
          color="var(--tg-theme-accent-text-color)"
          size={20}
          onClick={onDelete}
        />
        <FiEdit
          color="var(--tg-theme-accent-text-color)"
          size={18}
          onClick={() => {
            setIsEdit(() => !isEdit);
          }}
        />
      </div>
    </div>
  );
}

export default ReadyModule;
