import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const RecipeDetails = ({ recipe }) => {
  const { user, token } = useAuth();
  const [saved, setSaved] = useState(user?.favorites?.includes(recipe._id));
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    try {
      if (saved) {
        await axios.delete(`/api/favorites/${recipe._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.info('Recipe removed from favorites');
      } else {
        await axios.post(`/api/favorites/${recipe._id}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Recipe added to favorites');
      }
      setSaved(!saved);
    } catch (error) {
  toast.error('An error occurred while updating favorites');
}
  };

  return (
    <div>
      <h1>{recipe.title}</h1>
      <img src={recipe.imageUrl} alt={recipe.title} />
      <p>{recipe.description}</p>

      <h2>Ingredients:</h2>
      <ul>
        {recipe.ingredients.map(({ name, amount }) => (
          <li key={name}>{name} — {amount}</li>
        ))}
      </ul>

      <h2>Instructions:</h2>
      <p>{recipe.instructions}</p>

      <div>
        <h3>General Information:</h3>
        <p><b>Category:</b> {recipe.category}</p>
        <p><b>Cooking time:</b> {recipe.time} minutes</p>
        <p><b>Calories:</b> {recipe.calories || 'N/A'}</p>
      </div>

      <button onClick={handleSave}>
        {saved ? 'Remove' : 'Save'}
      </button>
    </div>
  );
};

export default RecipeDetails;
