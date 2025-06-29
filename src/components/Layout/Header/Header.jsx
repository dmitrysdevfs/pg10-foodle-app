import { NavLink } from 'react-router-dom';
import css from './Header.module.css';
import Logo from '../../assets/icon-layout';
import clsx from 'clsx';

const buildLinkClass = ({ isActive }) => {
  return clsx(css.link, isActive && css.active);
};

export default function Header() {
  return (
    <>
      <header className={css.headerNav}>
        <nav className={css.nav}>
          <ul className={css.navList}>
            <li className={css.navItem}>
              <NavLink to="/">
                <img className={css.logoNav} src={Logo} alt="logo" />
              </NavLink>
              Tasteorama
            </li>
            <li>
              <NavLink to="/" className={buildLinkClass}>
                Home Page
              </NavLink>
            </li>
            <li className={css.navItem}>
              <NavLink to="/movies" className={buildLinkClass}>
                Movie Page
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
