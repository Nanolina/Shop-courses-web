import { ITextInputProps } from '../types';
import styles from './TextInput.module.css';

function TextInput({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  disabled = false,
  isRequired = false,
}: ITextInputProps) {
  return (
    <input
      disabled={disabled}
      className={styles.input}
      type={type}
      placeholder={`${placeholder}${isRequired ? ' *' : ''}`}
      value={value}
      onChange={onChange}
    />
  );
}

export default TextInput;
