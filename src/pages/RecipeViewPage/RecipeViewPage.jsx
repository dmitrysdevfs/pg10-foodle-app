import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipeByID } from '../../redux/recipes/operations.js';
import RecipeDetails from '../../components/RecipeDetails/RecipeDetails.jsx';
import NotFound from '../NotFoundPage/NotFoundPage.jsx';
import Loader from '../../components/Loader/Loader';
import css from './RecipeViewPage.module.css';

export default function RecipeViewPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      return;
    }

    const getRecipe = async () => {
      setLoading(true);
      try {
        const response = await fetchRecipeByID(id);
        setRecipe(response.data);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className={css.container}>
        <div className={css.loaderContainer}>
          <Loader />
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return <NotFound />;
  }

  return (
    <div className={css.container}>
      <RecipeDetails recipe={recipe} />
    </div>
  );
}
