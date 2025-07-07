import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  addToFavorites,
  removeFromFavorites,
} from '../../redux/profile/operations.js';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';
import { selectFavoriteRecipes } from '../../redux/profile/selectors.js';
import Modal from '../Modal/Modal';

import SaveIcon from '../../assets/icons/SaveIcon.svg';
import s from './SaveRecipeButton.module.css';

const SaveRecipeButton = ({ recipeId }) => {
  const location = useLocation();
  const isRecipeView = /^\/recipes\/[^/]+$/.test(location.pathname);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const favoriteRecipes = useSelector(selectFavoriteRecipes);
  const [showModal, setShowModal] = useState(false);

  const isFavorite = favoriteRecipes.some(recipe => recipe._id === recipeId);

  const handleSaveClick = () => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }

    if (isFavorite) {
      dispatch(removeFromFavorites(recipeId));
    } else {
      dispatch(addToFavorites(recipeId));
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
        className={`${isRecipeView ? s.button : s.iconBtn} ${
          isFavorite ? s.saved : ''
        }`}
        type="button"
        aria-label={isFavorite ? 'Remove from saved' : 'Save this recipe'}
        onClick={handleSaveClick}
      >
        {isRecipeView ? (
          <>
            <span className={s.text}> {isFavorite ? 'Saved' : 'Save'}</span>
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
