import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import RecipesList from '../RecipesList/RecipesList';
import Loader from '../Loader/Loader';
import Pagination from '../Pagination/Pagination.jsx';
import s from './ProfileNavigation/ProfileNavigation.module.css';

const ProfileRecipesSection = ({
  fetchAction,
  selectRecipes,
  selectLoading,
  selectError,
  selectPage,
  selectTotalItems,
  perPage,
  type,
}) => {
  const dispatch = useDispatch();
  const recipes = useSelector(selectRecipes);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const page = useSelector(selectPage);
  const totalItems = useSelector(selectTotalItems);
  const perPageValue = useSelector(perPage);

  const totalPages = Math.ceil(totalItems / perPageValue);

  useEffect(() => {
    if (page) {
      dispatch(fetchAction(page));
    }
  }, [dispatch, page, fetchAction]);

  const handlePageChange = newPage => {
    dispatch(fetchAction(newPage));
  };

  if (loading && page === 1) {
    return (
      <div className={s.loaderContainer}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <p className={s.message}>Something went wrong. Please try again later.</p>
    );
  }

  if (recipes.length === 0) {
    return (
      <p className={s.message}>
        {type === 'favorites'
          ? 'You don’t have any saved recipes yet.'
          : 'You don’t have any own recipes yet.'}
      </p>
    );
  }

  return (
    <div className={s.listWrapper}>
      <RecipesList recipes={recipes} type={type} />
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProfileRecipesSection;
