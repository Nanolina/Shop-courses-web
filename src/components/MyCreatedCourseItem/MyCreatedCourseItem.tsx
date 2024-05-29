import { useCallback, useState } from 'react';
import { BsInfoCircleFill } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { COURSE, DELETE } from '../../consts';
import CreateCourseFormPage from '../../pages/CreateCourseFormPage/CreateCourseFormPage';
import Container from '../../ui/Container/Container';
import { IMyCreatedCourseItemProps } from '../types';
import styles from './MyCreatedCourseItem.module.css';

function MyCreatedCourseItem({ course }: IMyCreatedCourseItemProps) {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const tg = window.Telegram.WebApp;

  async function handleDelete(event: any) {
    event.stopPropagation();
    tg.sendData(
      JSON.stringify({
        type: COURSE,
        id: course.id,
        method: DELETE,
      })
    );
  }

  const handleEdit = useCallback(
    (event: any) => {
      event.stopPropagation();
      setIsEdit(!isEdit);
    },
    [isEdit, setIsEdit]
  );

  return (
    <Container>
      <div
        className={styles.container}
        onClick={(event: any) => {
          event.stopPropagation();
          navigate(`/course/${course.id}/module`);
        }}
      >
        <img
          src={course.imageUrl || ''}
          alt={course.name}
          className={styles.image}
        />
        {!isEdit ? (
          <>
            <div className={styles.icons}>
              <MdDeleteForever
                className={styles.cross}
                color="var(--tg-theme-accent-text-color)"
                size={28}
                onClick={handleDelete}
              />
              <FiEdit
                color="var(--tg-theme-accent-text-color)"
                size={22}
                onClick={handleEdit}
              />
            </div>
            <div className={styles.info}>
              <div className={styles.name}>{course.name}</div>
              <div className={styles.price}>
                {course.price}{' '}
                {course.currency === 'TON' ? (
                  <img
                    src="/toncoin-logo.png"
                    alt="TON"
                    className={styles.toncoin}
                  />
                ) : (
                  course.currency
                )}
              </div>
              <BsInfoCircleFill
                color="var(--tg-theme-accent-text-color)"
                size={28}
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/course/${course.id}`);
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div className={styles.arrowBack}>
              <IoIosArrowBack
                onClick={handleEdit}
                style={{ cursor: 'pointer' }}
                size={24}
              />
            </div>
            <CreateCourseFormPage />
          </>
        )}
      </div>
    </Container>
  );
}

export default MyCreatedCourseItem;
