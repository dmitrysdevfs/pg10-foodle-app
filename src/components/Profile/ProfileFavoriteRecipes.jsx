import { useDispatch, useSelector } from 'react-redux';
import RecipesList from '../RecipesList/RecipesList';
import { useEffect } from 'react';
import { fetchFavoriteRecipes } from '../../redux/profile/operations';
import {
  selectError,
  selectFavoriteHasMore,
  selectFavoritePage,
  selectFavoriteRecipes,
  selectLoading,
} from '../../redux/profile/selectors';

import Button from '../Button/Button';
import Loader from '../Loader/Loader';

export default function ProfileFavoriteRecipes() {
  const dispatch = useDispatch();
  const recipes = useSelector(selectFavoriteRecipes);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const hasMore = useSelector(selectFavoriteHasMore);
  const page = useSelector(selectFavoritePage);

  useEffect(() => {
    dispatch(fetchFavoriteRecipes());
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(fetchFavoriteRecipes(page + 1));
  };

  if (loading && page === 1) return <Loader />;
  if (error) return <p>Error: {error}</p>;
  return (
    <>
      <RecipesList recipes={recipes} type="favorites" />
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
}
