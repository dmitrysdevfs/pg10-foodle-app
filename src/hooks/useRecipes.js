import { useState, useEffect } from 'react';
import { fetchRecipes } from '../redux/recipes/operations';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRecipes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchRecipes();
        setRecipes(result.data);
      } catch (err) {
        setError(err.message || 'Error loading recipes');
      } finally {
        setIsLoading(false);
      }
    };

    getRecipes();
  }, []);

  return { recipes, isLoading, error };
};
