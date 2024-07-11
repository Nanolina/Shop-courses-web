import React from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { IPointsInfoModalContentProps } from '../types';
import styles from './PointsInfoModalContent.module.css';

const PointsInfoModalContent: React.FC<IPointsInfoModalContentProps> = ({
  page,
}) => {
  const { t } = useTranslation();

  switch (page) {
    case 1:
      return (
        <div className={styles.container}>
          <h2 className={styles.title}>{t('modal.benefits')}!</h2>
          {t('modal.offers')}:
          <h4 className={styles.subtitle}>{t('modal.how_earn_points')}?</h4>
          <LazyLoadImage
            src="/earn-points.svg"
            alt="Earn points"
            effect="blur"
            className={styles.image}
          />
          <ul className={styles.list}>
            <li>
              <strong>{t('modal.activating_courses')}:</strong>{' '}
              {t('modal.earn_for_blockchain')}.
            </li>
            <li>
              <strong>{t('modal.course_purchases')}:</strong>{' '}
              {t('modal.earn_for_purchase')}.
            </li>
            <li>
              <strong>{t('modal.reviews_and_invitations')}:</strong>{' '}
              {t('modal.earn_for_reviews')}.
            </li>
          </ul>
        </div>
      );
    case 2:
      return (
        <div className={styles.container}>
          <h2 className={styles.subtitle}>{t('modal.spend')}?</h2>
          <LazyLoadImage
            src="/spend-points.png"
            alt="Spend points"
            effect="blur"
            className={styles.image}
          />
          <ul className={styles.list}>
            <li>
              <strong>{t('modal.exchange')}:</strong>{' '}
              {t('modal.future_exchange')}.
            </li>
            <li>
              <strong>{t('modal.discounts')}:</strong>{' '}
              {t('modal.discounts_purchases')}.
            </li>
          </ul>
        </div>
      );
    case 3:
      return (
        <div className={styles.container}>
          <h2 className={styles.subtitle}>{t('modal.why_its_beneficial')}?</h2>
          <LazyLoadImage
            src="/bonuses.png"
            alt="Why it's beneficial"
            effect="blur"
            className={styles.image}
          />
          <div className={styles.text}></div>
          {t('modal.additional_benefits')}!
        </div>
      );
    default:
      return null;
  }
};

export default PointsInfoModalContent;
