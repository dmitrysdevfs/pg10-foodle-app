import { useSelector, useDispatch } from 'react-redux';
import css from './UserMenu.module.css';
import { selectUser, selectIsLoggedIn } from '../../redux/auth/selectors';
import { logout } from '../../redux/auth/authSlice';

export default function UserMenu() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Не рендеримо компонент, якщо користувач не залогінений
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={css.userMenu}>
      <p className={css.welcome}>Welcome, {user?.name || 'User'}!</p>
      <button type="button" className={css.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
