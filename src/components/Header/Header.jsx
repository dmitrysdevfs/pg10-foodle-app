import { NavLink } from 'react-router-dom';
import css from './Header.module.css';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header className={clsx(css.headerNav, isScrolled && css.scrolled)}>
        <div className="container">
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
              className={clsx(
                css.nav,
                isMenuOpen && css.navMobileOpen,
                isMenuOpen && isScrolled && css.scrolled
              )}
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
                  <NavLink
                    to="/auth/register"
                    className={({ isActive }) =>
                      clsx(css.linkBtn, isActive && css.activeBtn)
                    }
                  >
                    Register
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
