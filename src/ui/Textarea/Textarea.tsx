import styles from './Textarea.module.css';

function Textarea({ value, onChange, placeholder, isRequired }: any) {
  return (
    <textarea
      className={styles.textarea}
      placeholder={`${placeholder}${isRequired ? ' *' : ''}`}
      value={value}
      onChange={onChange}
    />
  );
}

export default Textarea;
