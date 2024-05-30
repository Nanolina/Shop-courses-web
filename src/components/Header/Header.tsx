import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Label from '../../ui/Label/Label';
import { IHeaderProps } from '../types';
import styles from './Header.module.css';

const Header = ({
  label,
  hasButtonBack = true,
  isLabelRight = true,
}: IHeaderProps) => {
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
        {isLabelRight && label && (
          <Label text={label} isForHeader={true} isRight={true} />
        )}
        {!isLabelRight && label && <Label text={label} isForHeader={true} />}
      </>
    </div>
  );
};

export default Header;
