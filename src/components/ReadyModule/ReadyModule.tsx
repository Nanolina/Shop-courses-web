import { FiEdit } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import styles from './ReadyModule.module.css';

function ReadyModule({ module, onDelete, isEdit, setIsEdit }: any) {
  return (
    <>
      <img
        className={styles.cover}
        src="https://avatars.githubusercontent.com/u/39895671?v=4"
        alt="cover"
      />
      <div className={styles.info}>
        <h3>{module.name}</h3>
        <p>{module.description}</p>
      </div>
      <div className={styles.icons}>
        <RxCross2
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
    </>
  );
}

export default ReadyModule;
