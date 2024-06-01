import { useCallback, useState } from 'react';
import { BsInfoCircleFill } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom'
import Container from '../../ui/Container/Container';
import { IMyCreatedCourseItemProps } from '../types';
import styles from './MyCreatedCourseItem.module.css';
import Modal from '../ModalWindow/Modal';

function MyCreatedCourseItem({ course }: IMyCreatedCourseItemProps) {
  const navigate = useNavigate();
  //const [isSeller, setIsSeller] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);

  async function handleDelete(event: any) {
    event.stopPropagation();
    setModalOpen(true)
  }

  function deleteCourse(){
    console.log('Delete')
  }

  const handleEdit = useCallback(
    (event: any) => {
      event.stopPropagation();
      navigate(`/course/edit/${course.id}`);
    },
    [navigate, course.id]
  );

  return (
    <Container>
      <div
        className={styles.container}
        onClick={(event: any) => {
          event.stopPropagation();
          navigate(`/module/course/${course.id}`);
        }}
      >
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
        {/* {isSeller && ( */}
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
            <BsInfoCircleFill
              color="var(--tg-theme-accent-text-color)"
              size={28}
              onClick={(event) => {
                event.stopPropagation();
                navigate(`/course/${course.id}`);
              }}
            />
          </>
        {/* )}*/}
      </div>
      <Modal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  content={<><h2>Delete course?</h2><p>Вы уверены, что хотите удалить это?</p></>}
  confirm={deleteCourse}
/>
    </Container>
  );
}

export default MyCreatedCourseItem;
