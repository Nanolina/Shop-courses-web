import { IOption } from '../../types';
import styles from './Select.module.css';

function Select({ type, selectValue, onChange, options }: any) {
  return (
    <select value={selectValue} onChange={onChange} className={styles.select}>
      <option value="">Choose {type}</option>
      {options.map((option: IOption) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
