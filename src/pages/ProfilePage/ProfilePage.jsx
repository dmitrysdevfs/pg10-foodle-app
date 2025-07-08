import ProfileNavigation from '../../components/Profile/ProfileNavigation/ProfileNavigation';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/profile/own', label: 'My profile' },
  { path: '/profile/favorites', label: 'Saved recipes' },
];

const ProfilePage = () => {
  const location = useLocation();

  if (location.pathname === '/profile') {
    return <Navigate to={tabs[0].path} replace />;
  }

  return (
    <div className="container">
      <div className="section">
        <ProfileNavigation tabs={tabs} />
        <Outlet />
      </div>
    </div>
  );
};

export default ProfilePage;
