import React from 'react';
import CoursePartItem from '../CoursePartItem/CoursePartItem';
import { ICoursePartListProps } from '../types';

function CoursePartList({ type, items }: ICoursePartListProps) {
  return (
    <>
      {items.map((item: any) => (
        <CoursePartItem key={item.id} type={type} item={item} />
      ))}
    </>
  );
}

export default React.memo(CoursePartList);
