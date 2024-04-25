import styles from './Button.module.css';

function Button(props: any) {
  return (
    <button
      {...props}
      className={
        props.color === 'gray' ? styles.buttonGray : styles.buttonGreen
      }
    >
      {props.text}
    </button>
  );
}

export default Button;
