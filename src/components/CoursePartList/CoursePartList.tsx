import React from 'react';
import CoursePartItem from '../CoursePartItem/CoursePartItem';

function CoursePartList({ type, items}: any) {
  return (
    <>
      {items.map((item: any) => (
        <CoursePartItem key={item.id} type={type} item={item} />
      ))}
    </>
  );
}

export default React.memo(CoursePartList);
