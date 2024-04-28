import styles from './TextArea.module.css';

function TextArea({ value, onChange, placeholder }: any) {
  return (
    <textarea
      className={styles.textArea}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default TextArea;
