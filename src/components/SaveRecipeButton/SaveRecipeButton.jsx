import { useLocation, Link } from 'react-router-dom';
import SaveIcon from '../../assets/icons/SaveIcon.svg';
import s from './SaveRecipeButton.module.css';
import { selectIsLoggedIn } from '../../redux/auth/selectors';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Modal from '../Modal/Modal';

const SaveRecipeButton = () => {
  const location = useLocation();
  const isRecipeView = /^\/recipes\/[^/]+$/.test(location.pathname);

  //   const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [showModal, setShowModal] = useState(false);

  const handelSaveClick = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    }
  };

  const actions = [
    {
      element: <Link to="/auth/login">Log in</Link>,
      type: 'secondary',
    },
    {
      element: <Link to="/auth/register">Register</Link>,
      type: 'secondary',
    },
  ];

  return (
    <>
      <button
        className={isRecipeView ? s.button : s.iconBtn}
        type="button"
        onClick={handelSaveClick}
      >
        {isRecipeView ? (
          <>
            <span className={s.text}>Save</span>
            <SaveIcon className={s.icon} />
          </>
        ) : (
          <SaveIcon className={s.icon} />
        )}
      </button>
      <Modal
        open={showModal}
        onOpenChange={setShowModal}
        title="Error while saving"
        message={
          <>
            To save this recipe, you need to
            <br />
            authorize first.
          </>
        }
        actions={actions}
      />
    </>
  );
};

export default SaveRecipeButton;
