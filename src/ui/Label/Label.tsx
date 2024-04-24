import styles from './Label.module.css';

function Label(props: any) {
  return (
    <div className={props.isForHeader ? styles.textForHeader : styles.text}>
      {props.text}
    </div>
  );
}

export default Label;
