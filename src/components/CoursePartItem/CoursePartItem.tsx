import React from 'react';
import ReadyCoursePart from '../ReadyCoursePart/ReadyCoursePart';
import { ICoursePartItemProps } from '../types';
import styles from './CoursePartItem.module.css';

function CoursePartItem({ type, item, updatePageData }: ICoursePartItemProps) {
  return (
    <div className={styles.container}>
      <ReadyCoursePart item={item} type={type} updatePageData={updatePageData}/>
    </div>
  );
}

export default React.memo(CoursePartItem);
