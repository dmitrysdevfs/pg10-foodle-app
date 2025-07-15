import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import toast from 'react-hot-toast';

import {
  addToFavorites,
  removeFromFavorites,
} from '../../redux/profile/operations.js';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';
import { selectFavoriteRecipes } from '../../redux/profile/selectors.js';
import Modal from '../Modal/Modal';
import Loader from '../Loader/Loader';

import SaveIcon from '../../assets/icons/SaveIcon.svg';
import s from './SaveRecipeButton.module.css';

const SaveRecipeButton = ({ recipeId }) => {
  const location = useLocation();
  const isRecipeView = /^\/recipes\/[^/]+$/.test(location.pathname);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const favoriteRecipes = useSelector(selectFavoriteRecipes);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const isFavorite = isLoggedIn && favoriteRecipes.some(recipe => recipe._id === recipeId);

  const handleSaveClick = async () => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }

    if (isLoading) {
      return; // Запобігаємо подвійним клікам
    }

    setIsLoading(true);

    try {
      const action = isFavorite
        ? removeFromFavorites(recipeId)
        : addToFavorites(recipeId);

      await dispatch(action).unwrap();

      toast.success(
        isFavorite ? 'Recipe removed from saved' : 'Recipe saved successfully'
      );
    } catch (err) {
      const status =
        err?.response?.status || err?.status || err?.originalStatus;
      const message = err?.response?.data?.message || err?.message || '';

      console.log('REAL ERROR STATUS:', status);
      console.log('REAL ERROR MESSAGE:', message);
      if (status === 401 || message.includes('Access token expired')) {
        setShowModal(true);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSaveClick = () => {
  //   if (!isLoggedIn) {
  //     setShowModal(true);
  //     return;
  //   }

  //   const action = isFavorite
  //     ? removeFromFavorites(recipeId)
  //     : addToFavorites(recipeId);

  //   dispatch(action)
  //     .unwrap()
  //     .then(() => {
  //       toast.success(
  //         isFavorite ? 'Recipe removed from saved' : 'Recipe saved successfully'
  //       );
  //     })
  //     .catch(err => {
  //       const status =
  //         err?.response?.status || err?.status || err?.originalStatus;
  //       const message = err?.response?.data?.message || err?.message || '';

  //       console.log('REAL ERROR STATUS:', status);
  //       console.log('REAL ERROR MESSAGE:', message);
  //       if (status === 401 || message.includes('Access token expired')) {
  //         setShowModal(true);
  //       } else {
  //         toast.error('Something went wrong');
  //       }
  //     });
  // };
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
        className={`${isRecipeView ? s.button : s.iconBtn} ${isFavorite ? s.saved : ''
          }`}
        type="button"
        aria-label={isFavorite ? 'Remove from saved' : 'Save this recipe'}
        onClick={handleSaveClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className={s.loaderContainer}>
            <Loader className={s.loader} />
          </div>
        ) : isRecipeView ? (
          <>
            <span className={s.text}> {isFavorite ? 'Remove' : 'Save'}</span>
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
