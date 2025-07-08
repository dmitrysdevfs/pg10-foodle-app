import { NavLink, useLocation } from 'react-router-dom';
import s from './ProfileNavigation.module.css';
import { useSelector } from 'react-redux';
import {
  selectOwnTotalItems,
  selectFavoriteTotalItems,
} from '../../../redux/profile/selectors';

const ProfileNavigation = () => {
  const tabs = [
    { path: '/profile/own', label: 'My profile' },
    { path: '/profile/favorites', label: 'Saved recipes' },
  ];

  const location = useLocation();
  const isOwn = location.pathname.includes('/own');
  const totalOwn = useSelector(selectOwnTotalItems);
  const totalFavorites = useSelector(selectFavoriteTotalItems);

  const totalRecipes = isOwn ? totalOwn : totalFavorites;

  return (
    <div className={s.wrapper}>
      <h2 className={s.title}>My profile</h2>
      <ul className={s.tabs}>
        {tabs.map(tab => {
          return (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  isActive ? `${s.tab} ${s.active}` : s.tab
                }
              >
                {tab.label}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <p className={s.count}>{totalRecipes} recipes</p>
    </div>
  );
};

export default ProfileNavigation;
