import { useState } from 'react';
import { LESSONS, MODULES } from '../../consts';
import EditCoursePart from '../EditCoursePart/EditCoursePart';
import ReadyCoursePart from '../ReadyCoursePart/ReadyCoursePart';
import styles from './CoursePartItem.module.css';

function CoursePartItem({ type, module, onDelete, lesson }: any) {
  const modDescription = module ? module.description : '';
  const modTitle = module ? module.name : '';
  const lesDescription = lesson ? lesson.description : '';
  const lesTitle = lesson ? lesson.name : '';

  const [isEdit, setIsEdit]: any = useState(false);
  const [setModDescription] = useState(modDescription);
  const [setModTitle] = useState(modTitle);
  const [setLesDescription] = useState(lesDescription);
  const [setLesTitle] = useState(lesTitle);

  return (
    <div className={styles.modulesItem}>
      {!isEdit && type === MODULES && (
        <ReadyCoursePart
          type={type}
          module={module}
          onDelete={onDelete}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
        />
      )}
      {isEdit && type === MODULES && (
        <EditCoursePart
          type={type}
          description={modDescription}
          setDescription={setModDescription}
          title={modTitle}
          setTitle={setModTitle}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
        />
      )}
      {!isEdit && type === LESSONS && (
        <ReadyCoursePart
          type={type}
          lesson={lesson}
          onDelete={onDelete}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
        />
      )}
      {isEdit && type === LESSONS && (
        <EditCoursePart
          type={type}
          description={lesDescription}
          setDescription={setLesDescription}
          title={lesTitle}
          setTitle={setLesTitle}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
        />
      )}
    </div>
  );
}

export default CoursePartItem;
