import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiBox } from 'react-icons/fi';
import ReadyCoursePart from '../ReadyCoursePart/ReadyCoursePart';
import { ICoursePartListProps } from '../types';
import styles from './CoursePartList.module.css';

function CoursePartList({
  type,
  parentId,
  items,
  role,
  updateItems,
}: ICoursePartListProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Translate type depending on the current language
  const translatedType =
    currentLanguage === 'ru' ? (type === 'module' ? 'модуля' : 'урока') : type; // for English leave the original

  return (
    <>
      {!items.length ? (
        <>
          <img src="/no-items.png" alt="No items" className={styles.image} />
          <div className={styles.notCreatedContainer}>
            <FiBox size={24} color="var(--tg-theme-accent-text-color)" />
            <h4>{t('not_created_type', { type: translatedType })}</h4>
          </div>
        </>
      ) : (
        items.map((item: any) => (
          <ReadyCoursePart
            item={item}
            type={type}
            parentId={parentId}
            role={role}
            updateItems={updateItems}
          />
        ))
      )}
    </>
  );
}

export default React.memo(CoursePartList);
