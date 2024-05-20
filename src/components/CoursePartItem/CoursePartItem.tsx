import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LESSON, MODULE } from '../../consts';
import EditCoursePart from '../EditCoursePart/EditCoursePart';
import ReadyCoursePart from '../ReadyCoursePart/ReadyCoursePart';
import styles from './CoursePartItem.module.css';

function CoursePartItem({ type, item }: any) {
  const [isEdit, setIsEdit]: any = useState(false);

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
