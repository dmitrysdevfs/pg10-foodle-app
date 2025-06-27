import { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; // кастомний хук
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecipeDetails = ({ recipe }) => {
  const { user, token } = useAuth();
  const [saved, setSaved] = useState(user?.favorites?.includes(recipe._id));
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!user) return navigate('/auth/login');
    try {
      if (saved) {
        await axios.delete(`/api/favorites/${recipe._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`/api/favorites/${recipe._id}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setSaved(!saved);
    } catch (err) {
      alert('Error saving recipe');
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
        {/* {saved ? 'Saved' : 'Save'} */}
        {saved ? 'Remove' : 'Save'}
      </button>
    </div>
  );
};

export default RecipeDetails;
