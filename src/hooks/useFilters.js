import { useEffect, useState } from 'react';
import { fetchCategories, fetchIngredients } from '../redux/recipes/operations';

export const useFilters = () => {
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getFilters = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cat, ing] = await Promise.all([
          fetchCategories(),
          fetchIngredients(),
        ]);
        setCategories(Array.isArray(cat) ? cat : []);
        setIngredients(Array.isArray(ing) ? ing : []);
      } catch (err) {
        console.error('Error fetching filters data:', err);
        setError(err.message);
        setCategories([]);
        setIngredients([]);
      } finally {
        setLoading(false);
      }
    };
    getFilters();
  }, []);

  return { categories, ingredients, loading, error };
};
