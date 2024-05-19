import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULE } from '../../consts';
import EditCoursePart from '../EditCoursePart/EditCoursePart';
import ReadyCoursePart from '../ReadyCoursePart/ReadyCoursePart';
import styles from './CoursePartItem.module.css';

function CoursePartItem({ type, item, onDelete, }: any) {
  const navigate = useNavigate();
  const [isEdit, setIsEdit]: any = useState(false);
  const navigateHandler = useCallback(() => {
    if (type === MODULE) {
      navigate(`/module/${item.id}/lesson`);
    }
  }, [navigate, item.id, type]);

  return (
    <div className={styles.container}>
      {!isEdit ? (
        <ReadyCoursePart
          item={item}
          type={type}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          navigate={navigateHandler}
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
