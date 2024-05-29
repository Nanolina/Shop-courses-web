import React, { useState } from 'react';
import EditCoursePart from '../EditCoursePart/EditCoursePart';
import ReadyCoursePart from '../ReadyCoursePart/ReadyCoursePart';
import { ICoursePartItemProps } from '../types';
import styles from './CoursePartItem.module.css';

function CoursePartItem({ type, item }: ICoursePartItemProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      {!isEdit ? (
        <ReadyCoursePart
          item={item}
          type={type}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
        />
      ) : (
        <EditCoursePart
          item={item}
          type={type}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
        />
      )}
    </div>
  );
}

export default React.memo(CoursePartItem);
