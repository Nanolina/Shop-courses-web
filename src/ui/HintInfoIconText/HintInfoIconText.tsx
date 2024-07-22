import { BsInfoCircleFill } from 'react-icons/bs';
import { IHintInfoIconTextProps } from '../types';
import styles from './HintInfoIconText.module.css';

function HintInfoIconText({ children }: IHintInfoIconTextProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <BsInfoCircleFill size={22} />
      </div>
      <div className={styles.text}>{children}</div>
    </div>
  );
}

export default HintInfoIconText;
