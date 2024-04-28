import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Label from '../../ui/Label/Label';
import styles from './Header.module.css';

const Header = ({ label, hasButtonBack = true, isLabelRight = true }: any) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <>
        {hasButtonBack && (
          <IoIosArrowBack
            onClick={() => navigate(-1)}
            style={{ cursor: 'pointer' }}
            size={20}
          />
        )}

        <Label
          text={label}
          style={{
            isForHeader: true,
            ...(isLabelRight && {
              isRight: true,
            }),
          }}
        />
      </>
    </div>
  );
};

export default Header;
