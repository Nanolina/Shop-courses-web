import { IoSearchSharp } from 'react-icons/io5';
import styles from './SearchBar.module.css';
import { useTranslation } from 'react-i18next';
import { ISearch } from '../types';

function SearchBar({ onChange }: ISearch) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        placeholder={t('search')}
        onChange={onChange}
      />
      <IoSearchSharp className={styles.icon} color="#8c8c8c" size={20} />
    </div>
  );
}

export default SearchBar;
