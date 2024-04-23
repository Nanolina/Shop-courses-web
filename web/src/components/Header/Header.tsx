import { GiHamburgerMenu } from 'react-icons/gi';
import Label from '../../ui/Label/Label';
import styles from './Header.module.css';

const Header = (props: any) => {
  return (
    <div className={styles.header}>
      <GiHamburgerMenu />
      <Label text="Courses" isForHeader />
    </div>
  );
};

export default Header;
