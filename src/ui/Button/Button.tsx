import styles from './Button.module.css';

function Button(props: any) {
  return (
    <button {...props} className={styles.button}>
      {props.text}
    </button>
  );
}

export default Button;
