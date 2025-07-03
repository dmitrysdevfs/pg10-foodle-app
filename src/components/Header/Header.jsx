import { NavLink } from 'react-router-dom';
import css from './Header.module.css';
import clsx from 'clsx';
import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BsXCircle } from 'react-icons/bs';
import LogoIcon from '../../assets/castom-icons/LogoIcon.svg';
import UserMenu from '../UserMenu/UserMenu.jsx';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/auth/selectors';

const buildLinkClass = ({ isActive }) => {
  return clsx(css.link, isActive && css.active);
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className={css.headerNav}>
        <div className={css.inner}>
          <NavLink to="/" className={css.logoLink}>
            <LogoIcon className={css.logo} />
            <span className={css.logoText}>Tasteorama</span>
          </NavLink>
          <button
            className={css.burgerButton}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <BsXCircle /> : <RxHamburgerMenu />}
          </button>

          <nav
            className={clsx(css.nav, isMenuOpen && css.navMobileOpen)}
            onClick={closeMenu}
          >
            <NavLink to="/" className={buildLinkClass}>
              Recipes
            </NavLink>

            {isLoggedIn ? (
              <UserMenu />
            ) : (
              <>
                <NavLink to="/auth/login" className={buildLinkClass}>
                  Log in
                </NavLink>
                <NavLink to="/auth/register" className={buildLinkClass}>
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
