import { FallingLines } from 'react-loader-spinner';
import styles from './Loader.module.css';

export const Loader = () => {
  return (
    <div className={styles.container}>
      <FallingLines
        color="var(--tg-theme-accent-text-color)"
        width="100"
        visible={true}
      />
    </div>
  );
};
