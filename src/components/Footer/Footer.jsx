import { NavLink } from 'react-router-dom';
import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.footerWrapper}>
        <NavLink to="/" className={css.logoLink}>
          <span className={css.logoText}>Tasteorama</span>
        </NavLink>
        <p className={css.footerTextSettings}>
          &copy; 2025 CookingCompanion. All rights reserved.
        </p>
        <div className={css.footerRoutesLink}>
          <NavLink
            to="/recipes"
            className={css.footerLink}>
            Recipes
          </NavLink>
          <NavLink
            to="/profile"
            className={css.footerLink}
          >
            Account
          </NavLink>
        </div>
      </div>
    </footer>
  );
}
