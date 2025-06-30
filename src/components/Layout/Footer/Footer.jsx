import { NavLink } from 'react-router-dom';
import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer>
      <div>
        <NavLink to="/" className={css.logoLink}>
          <span className={css.logoText}>Tasteorama</span>
        </NavLink>
      </div>
    </footer>
  );
}
