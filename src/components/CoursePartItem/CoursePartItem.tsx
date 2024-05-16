import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULE } from '../../consts';
import EditCoursePart from '../EditCoursePart/EditCoursePart';
import ReadyCoursePart from '../ReadyCoursePart/ReadyCoursePart';
import styles from './CoursePartItem.module.css';

function CoursePartItem({ type, item, onDelete }: any) {
  const navigate = useNavigate();
  const [isEdit, setIsEdit]: any = useState(false);
  const [description, setDescription] = useState(item.description);
  const [title, setTitle] = useState(item.name);

  return (
    <div className={styles.container}>
      {!isEdit && (
        <ReadyCoursePart
          item={item}
          onDelete={onDelete}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          navigate={
            type === MODULE
              ? () => navigate(`/module/${item.id}/lesson`)
              : () => {}
          }
        />
      )}
      {isEdit && (
        <EditCoursePart
          type={type}
          description={description}
          setDescription={setDescription}
          title={title}
          setTitle={setTitle}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
        />
      )}
    </div>
  );
}

export default CoursePartItem;
