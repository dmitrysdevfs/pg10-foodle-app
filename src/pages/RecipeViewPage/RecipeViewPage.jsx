import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import RecipeDetails from '../components/RecipeDetails';
import NotFound from '../components/NotFound';
import axios from 'axios';

const RecipeViewPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`/api/recipes/${id}`)
      .then(res => setRecipe(res.data))
      .catch(() => setError(true));
  }, [id]);

  if (error) return <NotFound />;
  if (!recipe) return <p>Loading...</p>;

  return <RecipeDetails recipe={recipe} />;
};

export default RecipeViewPage;
