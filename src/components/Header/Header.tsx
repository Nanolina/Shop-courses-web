import { CiCirclePlus } from 'react-icons/ci';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button/Button';
import Label from '../../ui/Label/Label';
import styles from './Header.module.css';

const Header = (props: any) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {props.type === 'main' ? (
        <>
          <Label text="Courses" isForHeader />
          <Button
            text={
              <div className={styles.addButton}>
                <CiCirclePlus size={20} />
                Add
              </div>
            }
          />
        </>
      ) : (
        <>
          <IoIosArrowBack
            onClick={() => navigate(-1)}
            style={{ cursor: 'pointer' }}
          />
          <Label text={props.label} />
        </>
      )}
    </div>
  );
};

export default Header;
