import { TonConnectButton } from '@tonconnect/ui-react';
import Label from '../../ui/Label/Label';
import { ICourseDetailsProps } from '../types';
import styles from './CourseDetails.module.css';

function CourseDetails({ name, description, isUser }: ICourseDetailsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <Label text={name} isBig isBold />
        <p className={styles.descriptionText}>{description}</p>
      </div>
      {isUser && <TonConnectButton className={styles.connectWalletButton} />}
    </div>
  );
}

export default CourseDetails;
