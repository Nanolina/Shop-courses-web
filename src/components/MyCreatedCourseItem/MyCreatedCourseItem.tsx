import { TonConnectButton } from '@tonconnect/ui-react';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../../hooks/useContract';
import { ICourse } from '../../types';
import Button from '../../ui/Button/Button';
import Container from '../../ui/Container/Container';
import styles from './CourseItem.module.css';

function MyCreatedCourseItem({ course }: { course: ICourse }) {
  const navigate = useNavigate();
  const { createCourse } = useContract();

  return (
    <Container>
      <div
        className={styles.container}
        onClick={(event: any) => {
          event.stopPropagation();
          navigate(`/course/${course.id}`);
        }}
      >
        <img
          src={course.image?.url || ''}
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
        <div className={styles.walletContainer}>
          <div>
            In order for your course to appear in the store, it must be
            submitted to the blockchain. You need to click on the button below
            to connect your wallet. This wallet will receive funds from the sale
            of your course.
          </div>
          <TonConnectButton />
          <div>
            Click on the button below to activate the course. You will have to
            pay to rent a smart contract on the blockchain for your course to
            exist there
          </div>
          <Button
            text="Activate"
            onClick={(event: any) => {
              event.stopPropagation();
              createCourse(course.id, BigInt(course.price));
            }}
          />
        </div>
      </div>
    </Container>
  );
}

export default MyCreatedCourseItem;
