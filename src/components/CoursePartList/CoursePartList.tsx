import React from 'react';
import ReadyCoursePart from '../ReadyCoursePart/ReadyCoursePart';
import { ICoursePartListProps } from '../types';

function CoursePartList({
  type,
  items,
  role,
  updatePageData,
}: ICoursePartListProps) {
  return (
    <>
      {items.map((item: any) => (
        <ReadyCoursePart
          item={item}
          type={type}
          role={role}
          updatePageData={updatePageData}
        />
      ))}
    </>
  );
}

export default React.memo(CoursePartList);
