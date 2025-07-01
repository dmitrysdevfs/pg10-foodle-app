import { NavLink } from 'react-router-dom';
import css from './Header.module.css';
import clsx from 'clsx';

const buildLinkClass = ({ isActive }) => {
  return clsx(css.link, isActive && css.active);
};

export default function Header() {
  return (
    <>
      <header className={css.headerNav}>
        <div className={css.inner}>
          <NavLink to="/" className={css.logoLink}>
            <span className={css.logoText}>Tasteorama</span>
            <button className={css.burgerButton}></button>
          </NavLink>
          <nav className={css.nav}>
            <NavLink to="/" className={buildLinkClass}>
              Recipes
            </NavLink>
            <NavLink to='/login' className={buildLinkClass}>Log in</NavLink>
            <NavLink to='/register' className={buildLinkClass}>Register</NavLink>
          </nav>
        </div>
      </header>
    </>
  );
}