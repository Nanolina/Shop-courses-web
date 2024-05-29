import { IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter } from '../../functions';
import { ICourse } from '../../types';
import Label from '../../ui/Label/Label';
import CourseItem from '../CourseItem/CourseItem';
import { ICoursesListByCategoryProps } from '../types';
import styles from './CoursesListByCategory.module.css';

function CoursesListByCategory({
  category,
  courses,
}: ICoursesListByCategoryProps) {
  const navigate = useNavigate();
  const categoryToLowerCase = category.toLowerCase();

  return (
    <div className={styles.container}>
      <div className={styles.labelsContainer}>
        <Label text={capitalizeFirstLetter(category)} />
        <div
          className={styles.textAll}
          onClick={() => {
            console.log(category);
            navigate(`course/category/${categoryToLowerCase}`);
          }}
        >
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
