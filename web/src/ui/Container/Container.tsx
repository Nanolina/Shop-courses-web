import styles from './Container.module.css';

function Container(props: any) {
  return <div className={styles.container}>{props.children}</div>;
}

export default Container;
