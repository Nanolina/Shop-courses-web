import { FiEdit } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { LESSONS, MODULES } from '../../consts';
import styles from './ReadyCoursePart.module.css';

function ReadyCoursePart({
  type,
  lesson,
  module,
  onDelete,
  isEdit,
  setIsEdit,
}: any) {
  const moduleType = type === MODULES;
  const lessonType = type === LESSONS;
  const navigate = useNavigate();

  return (
    <>
      {moduleType && (
        <div className={styles.container}>
          <img
            className={styles.cover}
            src="https://avatars.githubusercontent.com/u/39895671?v=4"
            alt="cover"
          />
          <div
            className={styles.info}
            onClick={() => navigate(`/module/${module.id}/lesson`)}
          >
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
                setIsEdit(!isEdit);
              }}
            />
          </div>
        </div>
      )}
      {lessonType && (
        <div
          className={styles.container}
          // onClick={() => navigate(`/module/${module.id}/lesson`)} Добавить открытие урока на эту кнопку
        >
          <img
            className={styles.cover}
            src="https://avatars.githubusercontent.com/u/39895671?v=4"
            alt="cover"
          />
          <div className={styles.info}>
            <div className={styles.name}>{lesson.name}</div>
            <p className={styles.description}>{lesson.description}</p>
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
                setIsEdit(!isEdit);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ReadyCoursePart;
