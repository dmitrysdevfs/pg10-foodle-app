import { NavLink, useLocation } from 'react-router-dom';
import css from './Footer.module.css';
import LogoIcon from '../../assets/castom-icons/LogoIcon.svg';

export default function Footer() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/auth/login' ||
    location.pathname === '/auth/register';
  return (
    <footer className={css.footer}>
      <div className={css.footerWrapper}>
        <NavLink to="/" className={css.logoLink}>
          <LogoIcon className={css.logo} />
          <span className={css.logoText}>Tasteorama</span>
        </NavLink>
        <p className={css.footerTextSettings}>
          &copy; 2025 CookingCompanion. All rights reserved.
        </p>
        <div className={css.footerRoutesLink}>
          <NavLink to="/" className={css.footerLink}>
            Recipes
          </NavLink>
          {!isAuthPage && (
            <NavLink to="/profile" className={css.footerLink}>
              Account
            </NavLink>
          )}
        </div>
      </div>
    </footer>
  );
}
