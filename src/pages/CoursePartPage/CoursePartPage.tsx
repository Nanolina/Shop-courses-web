import React, { useEffect } from 'react';
import CoursePartForm from '../../components/CoursePartForm/CoursePartForm';
import CoursePartList from '../../components/CoursePartList/CoursePartList';
import Header from '../../components/Header/Header';
import Container from '../../ui/Container/Container';

const tg = window.Telegram.WebApp;

function CoursePartPage({
  type,
  parentId,
  items,
  setItems,
  isForm,
  setIsForm,
}: any) {
  useEffect(() => {
    tg.MainButton.setParams({
      text: isForm ? 'Cancel' : `Create new ${type}`,
    });

    const toggleForm = () => setIsForm(!isForm);
    tg.onEvent('mainButtonClicked', toggleForm);
    return () => tg.offEvent('mainButtonClicked', toggleForm);
  }, [isForm, setIsForm, type]);

  useEffect(() => {
    isForm ? tg.MainButton.hide() : tg.MainButton.show();
    return () => console.log('CoursePartPage2');
  }, [isForm]);

  return (
    <Container>
      <Header label={`${type.charAt(0).toUpperCase() + type.slice(1)}s`} />
      {isForm ? (
        <CoursePartForm
          type={type}
          parentId={parentId}
          isForm={isForm}
          setIsForm={setIsForm}
        />
      ) : (
        <CoursePartList
          type={type}
          items={items}
          setItems={setItems}
          parentId={parentId}
        />
      )}
    </Container>
  );
}

export default React.memo(CoursePartPage);
