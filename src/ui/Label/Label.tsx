import styles from './Label.module.css';

function Label({
  text,
  isRequired,
  style = {},
}: {
  text: string;
  isRequired?: boolean;
  style?: Record<string, boolean>;
}) {
  let className = styles.text;
  if (style.isForHeader) {
    className = styles.textForHeader;
  }

  if (style.isCenter) {
    className += ` ${styles.center}`;
  }
  if (style.isRight) {
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
