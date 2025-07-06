import { NavLink, useLocation } from 'react-router-dom';
import styles from './ProfileNavigation.module.css';
import { useSelector } from 'react-redux';
import {
  selectOwnTotalItems,
  selectFavoriteTotalItems,
} from '../../../redux/profile/selectors';

const ProfileNavigation = () => {
  const location = useLocation();
  const isOwn = location.pathname.includes('/own');
  const totalOwn = useSelector(selectOwnTotalItems);
  const totalFavorites = useSelector(selectFavoriteTotalItems);

  const totalRecipes = isOwn ? totalOwn : totalFavorites;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>My profile</h1>

      <div className={styles.tabs}>
        <NavLink
          to="/profile/own"
          className={({ isActive }) =>
            isActive ? `${styles.tab} ${styles.active}` : styles.tab
          }
        >
          My recipes
        </NavLink>
        <NavLink
          to="/profile/favorites"
          className={({ isActive }) =>
            isActive ? `${styles.tab} ${styles.active}` : styles.tab
          }
        >
          Saved recipes
        </NavLink>
      </div>

      <p className={styles.count}>{totalRecipes} recipes</p>
    </div>
  );
};

export default ProfileNavigation;
