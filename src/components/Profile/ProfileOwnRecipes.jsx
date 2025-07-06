import { useDispatch, useSelector } from 'react-redux';
import RecipesList from '../RecipesList/RecipesList';
import {
  selectError,
  selectLoading,
  selectOwnHasMore,
  selectOwnPage,
  selectOwnRecipes,
} from '../../redux/profile/selectors';
import { useEffect } from 'react';
import { fetchOwnRecipes } from '../../redux/profile/operations';

import Button from '../Button/Button';
import Loader from '../Loader/Loader';

export default function ProfileOwnRecipes() {
  const dispatch = useDispatch();
  const recipes = useSelector(selectOwnRecipes);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const hasMore = useSelector(selectOwnHasMore);
  const page = useSelector(selectOwnPage);

  useEffect(() => {
    dispatch(fetchOwnRecipes());
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(fetchOwnRecipes(page + 1));
  };

  if (loading && page === 1) return <Loader />;
  if (error) return <p>Error: {error}</p>;
  return (
    <>
      <RecipesList recipes={recipes} type="own" />
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
