import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate } from 'react-router-dom';
import { ICourseItemProps } from '../types';
import styles from './CourseItem.module.css';

function CourseItem({ course }: ICourseItemProps) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.container}
      onClick={() => navigate(`/course/${course.id}`)}
    >
      <LazyLoadImage
        alt={course.name}
        src={
          course.imageUrl ||
          'https://res.cloudinary.com/dbrquscbv/image/upload/q_auto/f_auto/c_scale,w_1280/v1720707398/course_nn1fj5.png'
        }
        effect="blur"
        className={styles.image}
      />

      <div className={styles.info}>
        <div className={styles.name}>{course.name}</div>
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
