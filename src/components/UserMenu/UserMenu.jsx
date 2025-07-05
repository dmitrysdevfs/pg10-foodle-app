import { useSelector, useDispatch } from 'react-redux';
import css from './UserMenu.module.css';
import { selectUser, selectIsLoggedIn } from '../../redux/auth/selectors';
import { logOut } from '../../redux/auth/operations';

export default function UserMenu() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleLogout = () => {
    dispatch(logOut());
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={css.userMenu}>
      <p className={css.welcome}>Welcome, {user.name || 'User'}!</p>
      <button type="button" className={css.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
