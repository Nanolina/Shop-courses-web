import { ITextareaProps } from '../types';
import styles from './Textarea.module.css';

function Textarea({
  value,
  onChange,
  placeholder = '',
  isRequired = false,
}: ITextareaProps) {
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
