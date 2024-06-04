import { IContainerProps } from '../types';
import styles from './Container.module.css';

function Container({ children }: IContainerProps) {
  return <div className={styles.container}>{children}</div>;
}

export default Container;
