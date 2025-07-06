import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsLoggedIn, selectUser } from '../../redux/auth/selectors';
import { logOut } from '../../redux/auth/operations';
import { useNavigate } from 'react-router-dom';
import css from './Navigation.module.css';

export default function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logOut());
    navigate('/');
  };

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
              <button
                className={css.logoutBtn}
                onClick={handleLogout}
              >
                Logout
              </button>
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