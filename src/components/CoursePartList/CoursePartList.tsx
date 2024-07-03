import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiBox } from 'react-icons/fi';
import { getTranslatedType } from '../../functions';
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
  const { t } = useTranslation();

  const { singular_genitive_case } = getTranslatedType(type, t);

  return (
    <>
      {!items.length ? (
        <>
          <img src="/no-items.png" alt="No items" className={styles.image} />
          <div className={styles.notCreatedContainer}>
            <FiBox size={24} color="var(--tg-theme-accent-text-color)" />
            <h4>{t('not_created_type', { type: singular_genitive_case })}</h4>
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
