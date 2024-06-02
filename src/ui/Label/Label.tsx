import classNames from 'classnames';
import { ILabelProps } from '../types';
import styles from './Label.module.css';

function Label({
  text,
  isRequired = false,
  isForHeader = false,
  isCenter = false,
  isRight = false,
  isPadding = false,
  isBold = false,
  isBig = false,
  isHint = false,
}: ILabelProps) {
  const className = classNames(styles.text, {
    [styles.textForHeader]: isForHeader,
    [styles.center]: isCenter,
    [styles.right]: isRight,
    [styles.paddingLeft]: isPadding,
    [styles.bold]: isBold,
    [styles.bigSize]: isBig,
    [styles.hint]: isHint,
  });

  return (
    <div className={className}>
      {text}
      {isRequired && ' *'}
    </div>
  );
}

export default Label;
