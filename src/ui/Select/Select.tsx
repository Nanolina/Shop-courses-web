import { useTranslation } from 'react-i18next';
import { IOption, ISelectProps } from '../types';
import styles from './Select.module.css';

function Select({
  type,
  selectValue,
  onChange,
  options,
  isRequired = false,
}: ISelectProps) {
  const { t } = useTranslation();

  return (
    <select value={selectValue} onChange={onChange} className={styles.select}>
      <option value="">
        {t('choose')}
        {isRequired ? ' *' : ''}
      </option>
      {options?.map((option: IOption) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
