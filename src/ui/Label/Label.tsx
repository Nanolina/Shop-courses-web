import styles from './Label.module.css';

function Label({
  text,
  isRequired,
  isForHeader = false,
  isCenter = false,
  isRight = false,
}: {
  text: string;
  isRequired?: boolean;
  isForHeader?: boolean;
  isCenter?: boolean;
  isRight?: boolean;
}) {
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
