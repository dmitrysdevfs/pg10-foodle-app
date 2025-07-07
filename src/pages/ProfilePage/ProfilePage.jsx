import ProfileNavigation from '../../components/Profile/ProfileNavigation/ProfileNavigation';
import { Outlet } from 'react-router-dom';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  return (
    <div className={styles.container}>
      <ProfileNavigation />
      <Outlet />
    </div>
  );
};

export default ProfilePage;
