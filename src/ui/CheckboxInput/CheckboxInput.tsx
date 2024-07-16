import { ICheckboxInputProps } from '../types';
import styles from './CheckboxInput.module.css';

function CheckboxInput({
  onChange,
  disabled = false,
  id,
  checked,
  children,
}: ICheckboxInputProps) {
  return (
    <>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.input}
      />
      <label className={styles.label} htmlFor={id}>
        {children}
      </label>
    </>
  );
}

export default CheckboxInput;
