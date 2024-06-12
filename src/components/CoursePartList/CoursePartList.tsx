import React from 'react';
import { FiBox } from 'react-icons/fi';
import ReadyCoursePart from '../ReadyCoursePart/ReadyCoursePart';
import { ICoursePartListProps } from '../types';
import styles from './CoursePartList.module.css';

function CoursePartList({
  type,
  parentId,
  items,
  role,
  updateItems,
}: ICoursePartListProps) {
  return (
    <>
      {!items.length ? (
        <>
          <img src="/no-items.png" alt="No items" className={styles.image} />
          <div className={styles.notCreatedContainer}>
            <FiBox size={24} color="var(--tg-theme-accent-text-color)" />
            <h4>You have not created any {type}s yet</h4>
          </div>
        </>
      ) : (
        items.map((item: any) => (
          <ReadyCoursePart
            item={item}
            type={type}
            parentId={parentId}
            role={role}
            updateItems={updateItems}
          />
        ))
      )}
    </>
  );
}

export default React.memo(CoursePartList);
