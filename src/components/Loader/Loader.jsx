import styles from './Loader.module.css';

const Loader = () => (
  <div className={styles.loader} aria-label="Loading">
    <div className={styles.spinner}></div>
  </div>
);

export default Loader;
