import { IButtonProps } from '../types';
import styles from './Button.module.css';

function Button({ text, icon, ...props }: IButtonProps) {
  return (
    <button {...props} className={styles.button} onClick={props.onClick}>
      {icon}
      {text}
    </button>
  );
}

export default Button;
