import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Label from '../../ui/Label/Label';
import styles from './Header.module.css';

const Header = (props: any) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <>
        <IoIosArrowBack
          onClick={() => navigate(-1)}
          style={{ cursor: 'pointer' }}
          size={20}
        />
        <Label text={props.label} />
      </>
    </div>
  );
};

export default Header;
