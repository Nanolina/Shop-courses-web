import React from 'react';
import CoursePartItem from '../CoursePartItem/CoursePartItem';
import { ICoursePartListProps } from '../types';

function CoursePartList({ type, items , role, updatePageData}: ICoursePartListProps) {
  return (
    <>
      {items.map((item: any) => (
        <CoursePartItem key={item.id} type={type} item={item} role={role} updatePageData={updatePageData}/>
      ))}
    </>
  );
}

export default React.memo(CoursePartList);
