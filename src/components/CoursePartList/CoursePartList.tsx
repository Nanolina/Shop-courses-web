import CoursePartItem from '../CoursePartItem/CoursePartItem';

function CoursePartList({ type, items, setItems }: any) {
  function deleteItem(id: any) {
    setItems(items.filter((item: any) => item.id !== id));
  }

  return (
    <>
      {items.map((item: any) => (
        <CoursePartItem
          key={item.id}
          type={type}
          item={item}
          onDelete={() => deleteItem(item.id)}
        />
      ))}
    </>
  );
}

export default CoursePartList;
