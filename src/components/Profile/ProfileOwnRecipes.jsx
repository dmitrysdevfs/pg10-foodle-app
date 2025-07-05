import { useDispatch, useSelector } from 'react-redux';
import RecipesList from '../RecipesList/RecipesList';
import {
  selectError,
  selectLoading,
  selectOwnRecipes,
} from '../../redux/profile/selectors';
import { useEffect } from 'react';
import { fetchOwnRecipes } from '../../redux/profile/operations';

export default function ProfileOwnRecipes() {
  const dispatch = useDispatch();
  const recipes = useSelector(selectOwnRecipes);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchOwnRecipes());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return <RecipesList recipes={recipes} type="own" />;
}
