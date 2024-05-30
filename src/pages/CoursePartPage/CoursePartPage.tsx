import React, { useEffect } from 'react';
import CoursePartForm from '../../components/CoursePartForm/CoursePartForm';
import CoursePartList from '../../components/CoursePartList/CoursePartList';
import Header from '../../components/Header/Header';
import { capitalizeFirstLetter } from '../../functions';
import Container from '../../ui/Container/Container';
import { ICoursePartPageProps } from '../types';

const tg = window.Telegram.WebApp;

function CoursePartPage({
  type,
  parentId,
  items,
  setItems,
  isForm,
  setIsForm,
}: ICoursePartPageProps) {
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
  }, [isForm]);

  return (
    <Container>
      <Header label={`${capitalizeFirstLetter(type)}s`} />
      {isForm ? (
        <CoursePartForm
          type={type}
          parentId={parentId}
          isForm={isForm}
          setIsForm={setIsForm}
        />
      ) : (
        <CoursePartList type={type} items={items} />
      )}
    </Container>
  );
}

export default React.memo(CoursePartPage);
