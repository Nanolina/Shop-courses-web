import { IButtonProps } from '../types';
import styles from './Button.module.css';

function Button({ text, ...props }: IButtonProps) {
  return (
    <button {...props} className={styles.button} onClick={props.onClick}>
      {text}
    </button>
  );
}

export default Button;
