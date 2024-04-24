import { ICourse } from '../../types';
import styles from './CourseItem.module.css';

function CourseItem({ course }: { course: ICourse }) {
  return (
    <div className={styles.container}>
      <img src={course.image} alt={course.name} className={styles.image} />
      <div className={styles.info}>
        <div>{course.name}</div>
        <div className={styles.price}>
          {course.price}{' '}
          {course.currency ? (
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
