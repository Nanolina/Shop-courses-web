import { IChekBoxInputProps } from '../types';
import styles from './ChekBoxInput.module.css';

function ChekBoxInput({
  onChange,
  type = 'text',
  placeholder = '',
  disabled = false,
  isRequired = false,
  id = '',
  name = '',
  checked,
  children,
}: IChekBoxInputProps) {
  return (
    <>
      <input
        disabled={disabled}
        className={styles.input}
        type={type}
        placeholder={`${placeholder}${isRequired ? ' *' : ''}`}
        onChange={onChange}
        id={id}
        name={name}
        checked={checked}
      />
      <label className={styles.label} htmlFor={id}>
        {children}
      </label>
    </>
  );
}

export default ChekBoxInput;
