import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectToken } from '../../redux/auth/selectors';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
// import { ReactComponent as  SaveIcon} from '../../assets/icons/saveFavorite.svg';
import SaveIcon from '../../assets/icons/saveFavorite.svg';

import styles from './RecipeDetails.module.css';
import SaveRecipeButton from '../SaveRecipeButton/SaveRecipeButton.jsx';

const RecipeDetails = ({ recipe }) => {
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
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
      console.log(
        'API call:',
        saved ? 'DELETE' : 'POST',
        `/api/recipes/${recipe._id}/favorite`
      );
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
        <div className={styles.imgContainer}>
          <img src={recipe.thumb} alt={recipe.title} className={styles.image} />
        </div>
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
              {recipe.ingredients?.map(({ id, measure }) => (
                <li key={id._id || id}>
                  {typeof id === 'object' && id.name ? id.name : id} — {measure}
                </li>
              ))}
            </ul>
          </section>

          {/* <section className={styles.section}>
            <h3>Preparation Steps:</h3>
            <p>{recipe.instructions}</p>
          </section> */}
          <section className={styles.section}>
            <h3 className={styles.stepsTitle}>Preparation Steps:</h3>
            {recipe.instructions
              ?.split('. ')
              .filter(Boolean)
              .map((step, index) => (
                <p key={index} className={styles.stepText}>
                  {step.trim()}.
                </p>
              ))}
          </section>
          {/* <section className={styles.section}>
           <h3>Preparation Steps:</h3>
            {recipe.instructions?.split('\n').map((step, index) => (
            <p key={index}>{step}</p>
           ))}
          </section> */}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.infoBox}>
            <div className={styles.infoTitle}>
              <h3>General informations</h3>
            </div>
            <div>
              <p>
                <b>Category:</b>{' '}
                <span className={styles.span}>{recipe.category}</span>
              </p>
            </div>
            <div>
              <p>
                <b>Cooking time:</b>{' '}
                <span className={styles.span}>{recipe.time} minutes</span>
              </p>
            </div>
            <div>
              <p>
                <b>Calorie content:</b>{' '}
                <span className={styles.span}>{recipe.calories || 'N/A'}</span>
              </p>
            </div>
          </div>

          <SaveRecipeButton recipeId={recipe._id} />
          {/* <button className={styles.button} onClick={handleSave}>
            {saved ? 'Remove' : 'Save'}
            <SaveIcon className={styles.icon} />
          </button> */}
        </aside>
      </div>
    </div>
  );
};

export default RecipeDetails;
