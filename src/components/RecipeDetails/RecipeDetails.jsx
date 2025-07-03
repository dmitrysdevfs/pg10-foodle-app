import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.js';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import styles from './RecipeDetails.module.css';

const RecipeDetails = ({ recipe }) => {
  const { user, token } = useAuth();
  // const navigate = useNavigate();

  const [saved, setSaved] = useState(user?.favorites?.includes(recipe._id));
  console.log('Saving:', recipe._id);
  const handleSave = async () => {
    // if (!user) {
    //   navigate('/auth/login');
    //   console.log('API call:', saved ? 'DELETE' : 'POST', `/api/recipes/${recipe._id}/favorite`);
    //   return;
    // }
    if (!user || !token) {
    // toast.info('Please login to save recipes');
    // navigate('/auth/login');
       console.log('API call:', saved ? 'DELETE' : 'POST', `/api/recipes/${recipe._id}/favorite`);
    return;
  }

    try {
      if (saved) {
        await axios.delete(`/api/recipes/${recipe._id}/favorite`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.info('Recipe removed from favorites');
      } else {
        await axios.post(`/api/recipes/${recipe._id}/favorite`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Recipe added to favorites');
      }
      setSaved(!saved);
    } catch {
      toast.error('An error occurred while updating favorites');
    }
  };

  return (
    <div className={styles.recipeContainer}>
      <div className={styles.topSection}>
        <h2 className={styles.title}>{recipe.title}</h2>
        <img src={recipe.thumb} alt={recipe.title} className={styles.image} />
      </div>

      <div className={styles.layoutWrapper}>
        <div className={styles.content}>
          <section className={styles.section}>
            <h3>About recipe</h3>
            <p>{recipe.description}</p>
          </section>

          <section className={styles.section}>
            <h3>Ingredients:</h3>
            <ul>
              {recipe.ingredients?.map(({ _id, measure }) => (
                <li key={_id}>{_id} — {measure}</li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h3>Preparation Steps:</h3>
            <p>{recipe.instructions}</p>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoBox}>
            <h3>General informations</h3>
            <p><b>Category:</b> {recipe.category}</p>
            <p><b>Cooking time:</b> {recipe.time} minutes</p>
            <p><b>Calorie content:</b> {recipe.calories || 'N/A'}</p>
          </div>

          <button className={styles.button} onClick={handleSave}>
            {saved ? 'Remove' : 'Save'}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default RecipeDetails;
