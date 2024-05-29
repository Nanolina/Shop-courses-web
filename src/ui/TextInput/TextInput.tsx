import { ITextInputProps } from '../types';
import styles from './TextInput.module.css';

function TextInput({
  value,
  onChange,
  placeholder = '',
  isRequired = false,
}: ITextInputProps) {
  return (
    <input
      className={styles.input}
      type="text"
      placeholder={`${placeholder}${isRequired ? ' *' : ''}`}
      value={value}
      onChange={onChange}
    />
  );
}

export default TextInput;
