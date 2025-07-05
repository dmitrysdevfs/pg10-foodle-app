import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectUser } from '../../redux/auth/selectors';
import css from './Navigation.module.css';

export default function Navigation() {
  const isAuthenticated = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  return (
    <nav className={css.nav}>
      <div className={css.container}>
        <Link to="/" className={css.logo}>
          Tasteorama
        </Link>

        <div className={css.links}>
          {isAuthenticated ? (
            <>
              <span className={css.userName}>Hello, {user?.name || 'User'}!</span>
              <button className={css.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className={css.link}>Login</Link>
              <Link to="/auth/register" className={css.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 