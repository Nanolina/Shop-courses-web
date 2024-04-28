import styles from './TextInput.module.css';

function TextInput({ value, onChange, placeholder }: any) {
  return (
    <input
      className={styles.input}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default TextInput;
