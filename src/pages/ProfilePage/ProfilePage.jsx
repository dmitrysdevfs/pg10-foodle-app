import ProfileNavigation from '../../components/Profile/ProfileNavigation/ProfileNavigation';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const location = useLocation();

  if (location.pathname === '/profile') {
    return <Navigate to="/profile/own" replace />;
  }

  return (
    <div className="container">
      <div className="section">
        <ProfileNavigation />
        <Outlet />
      </div>
    </div>
  );
};

export default ProfilePage;
