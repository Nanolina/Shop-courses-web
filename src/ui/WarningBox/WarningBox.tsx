import styles from './WarningBox.module.css';

function WarningBox({ children }: any) {
  return <div className={styles.container}>{children}</div>;
}

export default WarningBox;
