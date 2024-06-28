import { IoSearchSharp } from 'react-icons/io5';
import styles from './SearchBar.module.css';
import { useTranslation } from 'react-i18next';

function SearchBar({ funOnChange }: any) {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        placeholder={t('search')}
        onChange={funOnChange}
      />
      <IoSearchSharp className={styles.icon} color="#8c8c8c" size={20} />
    </div>
  );
}

export default SearchBar;
