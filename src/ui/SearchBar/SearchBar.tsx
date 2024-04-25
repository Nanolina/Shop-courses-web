import { IoSearchSharp } from 'react-icons/io5';
import styles from './SearchBar.module.css';

function SearchBar() {
  return (
    <div className={styles.container}>
      <input className={styles.input} placeholder="Search" />
      <IoSearchSharp className={styles.icon} color="#8c8c8c" size={20} />
    </div>
  );
}

export default SearchBar;
