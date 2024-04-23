import { IoSearchSharp } from 'react-icons/io5';
import styles from './SearchBar.module.css';

function SearchBar(props: any) {
  return (
    <div className={styles.container}>
      <input className={styles.input} placeholder={props.placeholder} />
      <IoSearchSharp className={styles.icon} color="#8c8c8c" />
    </div>
  );
}

export default SearchBar;
