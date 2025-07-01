import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipeByID } from '../../redux/recipes/operations.js';
import RecipeDetails from '../../components/RecipeDetails/RecipeDetails.jsx';
import NotFound from '../NotFoundPage/NotFoundPage.jsx';
import css from './RecipeViewPage.module.css';

export default function RecipeViewPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecipe = async () => {
      try {
        const { data } = await fetchRecipeByID(id);
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getRecipe();
    } else {
      setError(true);
      setLoading(false);
    }
  }, [id]);

  if (loading) return <p className={css.message}>Loading...</p>;
  if (error || !recipe) return <NotFound />;

  return (
    <div className={css.container}>
      <RecipeDetails recipe={recipe} />
    </div>
  );
}