import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import RecipeDetails from '../../components/RecipeDetails/RecipeDetails.jsx';
import NotFound from '../NotFoundPage/NotFoundPage.jsx';
import css from './RecipeViewPage.module.css';

export default function RecipeViewPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRecipe = async () => {
//       try {
//         const { data } = await axios.get(`/api/recipes/${id}`);
//         setRecipe(data);
//       } catch {
        
//         setError(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecipe();
//   }, [id]);

useEffect(() => {
  const fetchRecipe = async () => {
    try {
      const { data } = await axios.get(`/api/recipes/${id}`);
      setRecipe(data);
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (id) { // валідація ID
    fetchRecipe();
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
