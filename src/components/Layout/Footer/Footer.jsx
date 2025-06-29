import { NavLink } from 'react-router-dom';
import Logo from '../../assets/icon-layout';
import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer>
      <div>
        <NavLink to="/">
          <img className={css.logoNav} src={Logo} alt="logo" />
        </NavLink>
        Tasteorama
      </div>
    </footer>
  );
}
