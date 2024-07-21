import HintInfoIconText from '../HintInfoIconText/HintInfoIconText';
import { IButtonProps } from '../types';
import styles from './Button.module.css';

function Button({ text, icon, hint, ...props }: IButtonProps) {
  return (
    <div className={styles.container}>
      <button
        {...props}
        className={`${styles.button} ${props.disabled ? styles.disabled : ''}`}
        onClick={props.onClick}
      >
        {icon}
        {text}
      </button>
      {hint && <HintInfoIconText>{hint}</HintInfoIconText>}
    </div>
  );
}

export default Button;
