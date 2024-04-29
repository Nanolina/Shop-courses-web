import { useNavigate } from 'react-router-dom';
import { ICourse } from '../../types';
import styles from './CourseItem.module.css';

function CourseItem({ course }: { course: ICourse }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.container}
      onClick={() => navigate(`/course/${course.id}`)}
    >
      <img
        src={course.image?.url || ''}
        alt={course.name}
        className={styles.image}
      />

      <div className={styles.info}>
        <div>{course.name}</div>
        <div className={styles.price}>
          {course.price}{' '}
          {course.currency === 'TON' ? (
            <img src="/toncoin-logo.png" alt="TON" className={styles.toncoin} />
          ) : (
            course.currency
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseItem;
