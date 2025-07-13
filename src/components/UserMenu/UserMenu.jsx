import { useSelector, useDispatch } from 'react-redux';
import css from './UserMenu.module.css';
import { selectUser, selectIsLoggedIn } from '../../redux/auth/selectors';
import { logOut } from '../../redux/auth/operations';
import { NavLink, useNavigate } from 'react-router-dom';
import { RxDividerVertical } from 'react-icons/rx';
import { FiLogOut } from 'react-icons/fi';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Modal from '../Modal/Modal.jsx';
import toast from 'react-hot-toast';

export default function UserMenu() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Try again.');
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  const actions = [
    {
      text: 'Log out',
      type: 'primary',
      onClick: handleLogout,
    },
    {
      text: 'Cancel',
      type: 'primary',
      onClick: () => setShowModal(false),
    },
  ];

  return (
    <>
      <nav className={clsx(css.userMenu, { [css.mobileMenu]: isMobile })}>
        <div className={css.navLinks}>
          <NavLink
            to="/profile"
            className={({ isActive }) => clsx(css.link, isActive && css.active)}
          >
            My Profile
          </NavLink>
          {!isMobile && (
            <NavLink to="/add-recipe" className={clsx(css.link, css.addBtn)}>
              Add Recipe
            </NavLink>
          )}
        </div>

        <div className={css.userBlock}>
          <span className={css.userAvatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </span>
          <span className={css.userName}>{user?.name}</span>
          <RxDividerVertical className={css.divider} />
          <button
            onClick={() => setShowModal(true)}
            className={css.userLogoutBtn}
            aria-label="Logout"
          >
            <FiLogOut width={24} height={28} />
          </button>
        </div>
        {isMobile && (
          <NavLink
            to="/add-recipe"
            className={clsx(css.link, css.addBtn, css.addBtnMobile)}
          >
            Add Recipe
          </NavLink>
        )}
      </nav>
      <Modal
        open={showModal}
        onOpenChange={setShowModal}
        title="Are you shure?"
        message="We will miss you!"
        actions={actions}
      />
    </>
  );
}
