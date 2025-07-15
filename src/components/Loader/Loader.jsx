import styles from './Loader.module.css';
import clsx from 'clsx';

const Loader = ({ className }) => (
  <div className={styles.loader} aria-label="Loading">
    <div className={clsx(styles.spinner, className)}></div>
  </div>
);

export default Loader;
