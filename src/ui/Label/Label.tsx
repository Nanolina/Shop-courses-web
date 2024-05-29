import { ILabelProps } from '../types';
import styles from './Label.module.css';

function Label({
  text,
  isRequired = false,
  isForHeader = false,
  isCenter = false,
  isRight = false,
}: ILabelProps) {
  let className = isForHeader ? styles.textForHeader : styles.text;

  if (isCenter) {
    className += ` ${styles.center}`;
  }
  if (isRight) {
    className += ` ${styles.right}`;
  }

  return (
    <div className={className}>
      {text}
      {isRequired ? ' *' : ''}
    </div>
  );
}

export default Label;
