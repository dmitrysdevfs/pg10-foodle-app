import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import RecipesList from '../RecipesList/RecipesList';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import s from './ProfileNavigation/ProfileNavigation.module.css';

const ProfileRecipesSection = ({
  fetchAction,
  selectRecipes,
  selectLoading,
  selectError,
  selectHasMore,
  selectPage,
  type,
}) => {
  const dispatch = useDispatch();
  const recipes = useSelector(selectRecipes);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const hasMore = useSelector(selectHasMore);
  const page = useSelector(selectPage);

  useEffect(() => {
    dispatch(fetchAction());
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(fetchAction(page + 1));
  };

  if (loading && page === 1) return <Loader />;

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
    <>
      <RecipesList recipes={recipes} type={type} />
      {hasMore && (
        <Button
          onClick={handleLoadMore}
          text="Load more"
          type="button"
          disabled={loading}
        />
      )}
    </>
  );
};

export default ProfileRecipesSection;
