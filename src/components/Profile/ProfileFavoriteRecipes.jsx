import { useDispatch, useSelector } from 'react-redux';
import RecipesList from '../RecipesList/RecipesList';
import { useEffect } from 'react';
import { fetchFavoriteRecipes } from '../../redux/profile/operations';
import {
  selectError,
  selectFavoriteRecipes,
  selectLoading,
} from '../../redux/profile/selectors';

export default function ProfileFavoriteRecipes() {
  const dispatch = useDispatch();
  const recipes = useSelector(selectFavoriteRecipes);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchFavoriteRecipes());
  }, [dispatch]);

  const handleRemoveFavorite = id => {
    console.log('Remove from favorites:', id);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <RecipesList
      recipes={recipes}
      type="favorites"
      onRemoveFavorite={handleRemoveFavorite}
    />
  );
}
