import { TonConnectButton } from '@tonconnect/ui-react';
import { useCallback, useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { IoIosArrowBack } from 'react-icons/io';
import { MdDeleteForever } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { COURSE, DELETE } from '../../consts';
import { useContract } from '../../hooks/useContract';
import CreateCourseFormPage from '../../pages/CreateCourseFormPage/CreateCourseFormPage';
import { ICourse } from '../../types';
import Button from '../../ui/Button/Button';
import Container from '../../ui/Container/Container';
import styles from './MyCreatedCourseItem.module.css';

function MyCreatedCourseItem({ course }: { course: ICourse }) {
  const navigate = useNavigate();
  const { createCourse } = useContract();
  const [isEdit, setIsEdit]: any = useState(false);

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
            </div>
            <div className={styles.walletContainer}>
              <div>
                In order for your course to appear in the store, it must be
                submitted to the blockchain. You need to click on the button
                below to connect your wallet. This wallet will receive funds
                from the sale of your course.
              </div>
              <TonConnectButton />
              <div>
                Click on the button below to activate the course. You will have
                to pay to rent a smart contract on the blockchain for your
                course to exist there
              </div>
              <Button
                text="Activate"
                onClick={(event: any) => {
                  event.stopPropagation();
                  createCourse(course.id, BigInt(course.price));
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
