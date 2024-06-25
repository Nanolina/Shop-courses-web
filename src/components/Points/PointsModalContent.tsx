import React from 'react';
import { IPointsModalContentProps } from '../types';
import styles from './PointsModalContent.module.css';

const PointsModalContent: React.FC<IPointsModalContentProps> = ({ page }) => {
  switch (page) {
    case 1:
      return (
        <div className={styles.container}>
          <h2 className={styles.title}>Earn points and get more benefits!</h2>
          Our online video course marketplace offers you a unique opportunity to
          earn points for active participation and get nice bonuses for it.
          Here's how it works:
          <h4 className={styles.subtitle}>How do I earn points?</h4>
          <img
            src="/earn-points.svg"
            alt="Earn points"
            className={styles.image}
          />
          <ul className={styles.list}>
            <li>
              <strong>Activating courses:</strong> Earn points for sending your
              courses to the blockchain.
            </li>
            <li>
              <strong>Course purchases:</strong> Earn points for every course
              purchase on our platform.
            </li>
            <li>
              <strong>Reviews and invitations (in the future):</strong> Soon you
              will be able to earn points for writing reviews and inviting
              friends.
            </li>
          </ul>
        </div>
      );
    case 2:
      return (
        <div className={styles.container}>
          <h2 className={styles.subtitle}>What can I spend my points on?</h2>
          <img
            src="/spend-points.png"
            alt="Spend points"
            className={styles.image}
          />
          <ul className={styles.list}>
            <li>
              <strong>Exchange for tokens:</strong> In the future you will be
              able to exchange your points for tokens and use them as you see
              fit.
            </li>
            <li>
              <strong>Course discounts:</strong> Use your points to get
              discounts on course purchases.
            </li>
          </ul>
        </div>
      );
    case 3:
      return (
        <div className={styles.container}>
          <h2 className={styles.subtitle}>Why it's beneficial</h2>
          <img
            src="/bonuses.png"
            alt="Why it's beneficial"
            className={styles.image}
          />
          <div className={styles.text}></div>
          Our users receive additional benefits for actively participating on
          the platform. Earn points and enjoy the benefits we offer. The more
          you participate, the more bonuses you get!
        </div>
      );
    default:
      return null;
  }
};

export default PointsModalContent;
