import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CoursePartList from '../../components/CoursePartList/CoursePartList';
import Header from '../../components/Header/Header';
import { SELLER } from '../../consts';
import { capitalizeFirstLetter, getTranslatedType } from '../../functions';
import Container from '../../ui/Container/Container';
import { ICoursePartPageProps } from '../types';

const tg = window.Telegram.WebApp;

function CoursePartPage({
  type,
  parentId,
  items,
  role,
  updateItems,
}: ICoursePartPageProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { singular, plural } = getTranslatedType(type, t);

  const navigateToForm = useCallback(() => {
    navigate(`/course-part/create/${type}/${parentId}`);
  }, [navigate, parentId, type]);

  useEffect(() => {
    tg.MainButton.hide();
    if (role === SELLER) {
      tg.MainButton.setParams({
        text: `${t('create_type', { type: singular })}`,
      });
      tg.MainButton.show();
      tg.onEvent('mainButtonClicked', navigateToForm);
      return () => tg.offEvent('mainButtonClicked', navigateToForm);
    }
  }, [type, parentId, role, navigate, navigateToForm, t, singular]);

  return (
    <Container>
      <Header label={`${capitalizeFirstLetter(plural)}`} />
      <CoursePartList
        type={type}
        parentId={parentId}
        items={items}
        role={role}
        updateItems={updateItems}
      />
    </Container>
  );
}

export default React.memo(CoursePartPage);
