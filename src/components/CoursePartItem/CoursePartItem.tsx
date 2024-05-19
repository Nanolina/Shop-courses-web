import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULE } from '../../consts';
import EditCoursePart from '../EditCoursePart/EditCoursePart';
import ReadyCoursePart from '../ReadyCoursePart/ReadyCoursePart';
import styles from './CoursePartItem.module.css';

function CoursePartItem({ type, item, onDelete, parentId }: any) {
  const navigate = useNavigate();
  const [isEdit, setIsEdit]: any = useState(false);
  const [itemState] = useState(item);
  console.log('itemState', itemState);
  const navigateHandler = useCallback(() => {
    if (type === MODULE) {
      navigate(`/module/${item.id}/lesson`);
    }
  }, [navigate, item.id, type]);

  return (
    <div className={styles.container}>
      {!isEdit ? (
        <ReadyCoursePart
          item={itemState}
          onDelete={onDelete}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          navigate={navigateHandler}
        />
      ) : (
        <EditCoursePart
          item={itemState}
          type={type}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
        />
      )}
    </div>
  );
}

export default React.memo(CoursePartItem);
