import classNames from 'classnames';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import Label from '../../ui/Label/Label';
import { IHeaderProps } from '../types';
import styles from './Header.module.css';

const Header = ({
  label,
  hasButtonBack = true,
  isLabelRight = true,
  icon,
}: IHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {hasButtonBack && (
        <IoIosArrowBack
          onClick={() => navigate(-1)}
          className={styles.backButton}
          size={20}
        />
      )}
      {label && (
        <div
          className={classNames(styles.iconLabelContainer, styles.labelRight)}
        >
          {icon}
          <Label
            text={label}
            isRight={isLabelRight}
            isCenter={!isLabelRight}
            isForHeader
          />
        </div>
      )}
    </div>
  );
};

export default Header;
