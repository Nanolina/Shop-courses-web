import { useTranslation } from 'react-i18next';
import { IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { getCategoryLabel } from '../../functions';
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
  const { t } = useTranslation();

  const categoryLabel = getCategoryLabel(category, t);

  return (
    <div className={styles.container}>
      <div className={styles.labelsContainer}>
        <Label text={categoryLabel} isBold isBig />
        <div
          className={styles.textAll}
          onClick={() => {
            navigate(`course/category/${category}`);
          }}
        >
          {t('all')} <IoIosArrowForward size={15} />
        </div>
      </div>
      <div className={styles.courseWrapper}>
        {courses.slice(0, 10).map((course: ICourse) => (
          <CourseItem course={course} key={course.id} />
        ))}
      </div>
    </div>
  );
}

export default CoursesListByCategory;
