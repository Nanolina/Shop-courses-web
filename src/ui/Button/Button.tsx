import styles from './Button.module.css';

function Button(props: any) {
  return (
    <button
      {...props}
      className={
        props.isBlack ? styles.blackButton : styles.button
      }
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}

export default Button;
