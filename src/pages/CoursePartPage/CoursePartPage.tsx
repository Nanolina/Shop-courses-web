import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CoursePartList from '../../components/CoursePartList/CoursePartList';
import Header from '../../components/Header/Header';
import { SELLER } from '../../consts';
import { capitalizeFirstLetter } from '../../functions';
import Container from '../../ui/Container/Container';
import { ICoursePartPageProps } from '../types';

const tg = window.Telegram.WebApp;

function CoursePartPage({
  type,
  parentId,
  items,
  role,
  updatePageData,
}: ICoursePartPageProps) {
  const navigate = useNavigate();
  const navigateToForm = useCallback(() => {
    navigate(`/edit/coursePart/${type}/${parentId}`);
  }, [navigate, parentId, type]);

  useEffect(() => {
    tg.MainButton.hide();
    if (role === SELLER) {
      tg.MainButton.setParams({
        text: `Create new ${type}`,
      });
      tg.MainButton.show();
      tg.onEvent('mainButtonClicked', navigateToForm);
      return () => tg.offEvent('mainButtonClicked', navigateToForm);
    }
  }, [type, parentId, role, navigate, navigateToForm]);

  return (
    <Container>
      <Header label={`${capitalizeFirstLetter(type)}s`} />
      <CoursePartList
        type={type}
        items={items}
        updatePageData={updatePageData}
        role={role}
      />
    </Container>
  );
}

export default React.memo(CoursePartPage);
