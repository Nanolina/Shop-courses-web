import styles from './Textarea.module.css';

function Textarea({ value, onChange, placeholder }: any) {
  return (
    <textarea
      className={styles.textarea}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default Textarea;
