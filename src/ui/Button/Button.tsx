import { BsInfoCircleFill } from 'react-icons/bs';
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
      {hint && (
        <div className={styles.hint}>
          <BsInfoCircleFill size={24} />
          <div>{hint}</div>
        </div>
      )}
    </div>
  );
}

export default Button;
