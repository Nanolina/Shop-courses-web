import { IContainerProps } from '../types';
import styles from './Container.module.css';

function Container({ grayContainer = true, children }: IContainerProps) {
  const className = `${styles.container} ${
    grayContainer ? styles.grayContainer : ''
  }`;
  return <div className={className}>{children}</div>;
}

export default Container;
