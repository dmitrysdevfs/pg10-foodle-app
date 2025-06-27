import { Link } from 'react-router-dom';
import css from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404</h1>
      <p className={css.subtitle}>Page Not Found</p>
      <p className={css.description}>
        The page you are looking for does not exist.
      </p>
      <Link to="/" className={css.button}>
        Back to Home
      </Link>
    </div>
  );
} 