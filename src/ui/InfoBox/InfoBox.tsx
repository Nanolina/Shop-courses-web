import styles from './InfoBox.module.css';

function InfoBox({ children }: any) {
  return <div className={styles.container}>{children}</div>;
}

export default InfoBox;
