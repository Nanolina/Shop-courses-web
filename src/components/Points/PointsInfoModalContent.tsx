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
          <div className={styles.text}>{t('modal.offers')}!</div>
          <div className={styles.subtitle}>{t('modal.how_earn_points')}?</div>
          <div className={styles.imageContainer}>
            <LazyLoadImage
              src="https://res.cloudinary.com/dbrquscbv/image/upload/q_auto/f_auto/c_scale,w_1280/v1720707437/earn-points_tzl8nx.svg"
              alt="Earn points"
              effect="blur"
              className={styles.image}
            />
          </div>
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
          <div className={styles.imageContainer}>
            <LazyLoadImage
              src="https://res.cloudinary.com/dbrquscbv/image/upload/q_auto/f_auto/c_scale,w_1280/v1720707668/spend-points_h1wgll.png"
              alt="Spend points"
              effect="blur"
              className={styles.image}
            />
          </div>
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
          <div className={styles.imageContainer}>
            <LazyLoadImage
              src="https://res.cloudinary.com/dbrquscbv/image/upload/q_auto/f_auto/c_scale,w_1280/v1720707370/bonuses_gnpkla.png"
              alt="Why it's beneficial"
              effect="blur"
              className={styles.image}
            />
          </div>
          <div className={styles.text}>{t('modal.additional_benefits')}!</div>
        </div>
      );
    default:
      return null;
  }
};

export default PointsInfoModalContent;
