import { FallingLines } from 'react-loader-spinner';
import styles from './Loader.module.css';

interface ILoaderProps {
  hasBackground?: boolean;
}
export const Loader: React.FC<ILoaderProps> = ({ hasBackground = false }) => {
  return (
    <div
      className={
        hasBackground
          ? `${styles.container} ${styles.hasBackground}`
          : styles.container
      }
    >
      <FallingLines
        color="var(--tg-theme-accent-text-color)"
        width="100"
        visible={true}
      />
    </div>
  );
};
