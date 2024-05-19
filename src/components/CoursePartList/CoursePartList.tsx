import React, { useCallback } from 'react';
import CoursePartItem from '../CoursePartItem/CoursePartItem';

function CoursePartList({ type, items, setItems, parentId }: any) {
  const deleteItem = useCallback(
    (id: string) => {
      setItems((prevItems: any) => prevItems.filter((item: any) => item.id !== id));
    },
    [setItems]
  );

  return (
    <>
      {items.map((item: any) => (
        <CoursePartItem
          key={item.id}
          type={type}
          item={item}
          parentId={parentId}
          onDelete={() => deleteItem(item.id)}
        />
      ))}
    </>
  );
}

export default React.memo(CoursePartList);
