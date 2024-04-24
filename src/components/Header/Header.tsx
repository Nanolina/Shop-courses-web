import { CiCirclePlus } from 'react-icons/ci';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import styles from './Header.module.css';

const Header = (props: any) => {
  return (
    <div className={styles.container}>
      <Label text="Courses" isForHeader />
      <Button
        text={
          <div className={styles.addButton}>
            <CiCirclePlus size={20} />
            Add
          </div>
        }
      />
    </div>
  );
};

export default Header;
