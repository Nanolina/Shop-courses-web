import { retrieveLaunchParams } from '@tma.js/sdk';
import { useCallback, useState } from 'react';
import { BsInfoCircleFill } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ICourse } from '../../types';
import Container from '../../ui/Container/Container';
import { Loader } from '../../ui/Loader/Loader';
import { createAxiosWithAuth } from '../../utils';
import Modal from '../ModalWindow/Modal';
import { IMyCreatedCourseItemProps } from '../types';
import styles from './MyCreatedCourseItem.module.css';

function MyCreatedCourseItem({
  course,
  updateItem,
  role,
}: any | IMyCreatedCourseItemProps) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { initDataRaw } = retrieveLaunchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const text = `Delete course ${course.name}?`;

  async function handleDelete(event: any) {
    event.stopPropagation();
    setModalOpen(true);
  }

  async function deleteCourse() {
    try {
      if (!initDataRaw) throw new Error('Not enough authorization data');
      const axiosWithAuth = createAxiosWithAuth(initDataRaw);
      await axiosWithAuth.delete<ICourse>(`/course/${course.id}`);
      updateItem();
    } catch (error: any) {
      setError(error.response?.data.message || String(error));
      setIsLoading(false);
    }
  }

  const handleEdit = useCallback(
    (event: any) => {
      event.stopPropagation();
      navigate(`/course/edit/${course.id}`);
    },
    [navigate, course.id]
  );

  if (isLoading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <div
        className={styles.container}
        onClick={(event: any) => {
          event.stopPropagation();
          navigate(`/module/course/${course.id}`);
        }}
      >
        <div className={styles.details}>
          <BsInfoCircleFill
            color="var(--tg-theme-accent-text-color)"
            size={28}
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/course/${course.id}`);
            }}
          />
        </div>
        <img
          src={course.imageUrl || ''}
          alt={course.name}
          className={styles.image}
        />
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
        </div>
        {role === 'seller' && (
          <div className={styles.icons}>
            <MdDeleteForever
              className={styles.cross}
              color="var(--tg-theme-accent-text-color)"
              size={34}
              onClick={handleDelete}
            />
            <FiEdit
              color="var(--tg-theme-accent-text-color)"
              size={28}
              onClick={handleEdit}
            />
          </div>
        )}
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        content={
          <>
            <h2>{text}</h2>
            <p>Are you sure you want to delete it?</p>
          </>
        }
        confirm={deleteCourse}
      />
    </Container>
  );
}

export default MyCreatedCourseItem;
