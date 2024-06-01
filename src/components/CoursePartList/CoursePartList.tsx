import React from 'react';
import CoursePartItem from '../CoursePartItem/CoursePartItem';
import { ICoursePartListProps } from '../types';

function CoursePartList({ type, items , updatePageData}: ICoursePartListProps) {
  return (
    <>
      {items.map((item: any) => (
        <CoursePartItem key={item.id} type={type} item={item} updatePageData={updatePageData}/>
      ))}
    </>
  );
}

export default React.memo(CoursePartList);
