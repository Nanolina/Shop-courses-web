import React, { useCallback, useEffect, useState } from 'react';
import CoursePartForm from '../../components/CoursePartForm/CoursePartForm';
import CoursePartList from '../../components/CoursePartList/CoursePartList';
import Header from '../../components/Header/Header';
import { capitalizeFirstLetter } from '../../functions';
import Container from '../../ui/Container/Container';
import { ICoursePartPageProps } from '../types';

const tg = window.Telegram.WebApp;

function CoursePartPage({ type, parentId, items }: ICoursePartPageProps) {
  const [isForm, setIsForm] = useState<boolean>(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleForm = useCallback(() => setIsForm(!isForm), []);

  useEffect(() => {
    tg.MainButton.setParams({
      text: `Create new ${type}`,
    });

    tg.onEvent('mainButtonClicked', toggleForm);
    return () => tg.offEvent('mainButtonClicked', toggleForm);
  }, [isForm, setIsForm, toggleForm, type, parentId]);

  useEffect(() => {
    tg.MainButton.show();
  }, []);

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
