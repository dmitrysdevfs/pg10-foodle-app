import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import styles from './RecipeDetails.module.css';

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
    <div className={styles.container}>
  <div className={styles.content}>
    <h1 className={styles.title}>{recipe.title}</h1>
    <img src={recipe.imageUrl} alt={recipe.title} className={styles.image} />
    <h2 className={styles.sectionTitle}>About recipe</h2>
    <p className={styles.description}>{recipe.description}</p>

    <h2 className={styles.sectionTitle}>Ingredients:</h2>
    <ul className={styles.ingredientsList}>
      {recipe.ingredients.map(({ name, amount }) => (
        <li key={name}>{name} — {amount}</li>
      ))}
    </ul>

    <h2 className={styles.sectionTitle}>Preparation Steps:</h2>
    <p className={styles.instructions}>{recipe.instructions}</p>
  </div>

  <div className={styles.sidebar}>
    <div className={styles.infoBox}>
      <div className={styles.infoItem}><b>Category:</b> {recipe.category}</div>
      <div className={styles.infoItem}><b>Cooking time:</b> {recipe.time} minutes</div>
      <div className={styles.infoItem}><b>Calorie content:</b> {recipe.calories || 'N/A'}</div>
      <button className={styles.button} onClick={handleSave}>
        {saved ? 'Remove' : 'Save'}
      </button>
    </div>
  </div>
</div>

  );
};

export default RecipeDetails;
