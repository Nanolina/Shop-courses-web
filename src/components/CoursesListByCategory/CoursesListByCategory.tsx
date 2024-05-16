import { IoIosArrowForward } from 'react-icons/io';
import { capitalizeFirstLetter } from '../../functions';
import { ICourse } from '../../types';
import Label from '../../ui/Label/Label';
import CourseItem from '../CourseItem/CourseItem';
import styles from './CoursesListByCategory.module.css';

function CoursesListByCategory({ category, courses }: any) {
  return (
    <div className={styles.container}>
      <div className={styles.labelsContainer}>
        <Label text={capitalizeFirstLetter(category)} />
        <div className={styles.textAll}>
          All <IoIosArrowForward size={15} />
        </div>
      </div>
      <div className={styles.courseWrapper}>
        {courses.map((course: ICourse) => (
          <CourseItem course={course} key={course.id} />
        ))}
      </div>
    </div>
  );
}

export default CoursesListByCategory;
