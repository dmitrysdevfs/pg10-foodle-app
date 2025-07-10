import css from './RecipeCard.module.css';
import RecipeList from '../RecipeLink/RecipeLink';
import SaveRecipeButton from '../SaveRecipeButton/SaveRecipeButton.jsx';
import NoPhoto from '../../assets/img/no_photo.jpg';

import { GoClock } from 'react-icons/go';
import DeleteRecipeButton from '../DeleteRecipeButton/DeleteRecipeButton.jsx';
import { selectUser } from '../../redux/auth/selectors.js';
import { useSelector } from 'react-redux';

export default function RecipeCard({ recipe, recipes, recipeId }) {
  const { title, description, time, thumb, photo, calories, owner } = recipe;

  const user = useSelector(selectUser);

  const ownerId = typeof owner === 'object' ? owner._id : owner;
  const isOwner = user?._id === ownerId;

  return (
    <div className={css.item}>
      {thumb || photo ? (
        <img
          src={thumb || photo}
          alt={title}
          className={css.image}
          onError={e => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <img
          src={NoPhoto}
          alt="Recipe image not available"
          className={css.image}
        />
      )}
      <div className={css.titleContainer}>
        <h2 className={css.title}>{title}</h2>
        <div className={css.timeCont}>
          <p className={css.timeSvg}>
            <GoClock size={14.5} />
          </p>
          <p className={css.timeTitle}>{time}</p>
        </div>
      </div>
      <div className={css.descriptionContainer}>
        <p className={css.description}>{description}</p>
        <p className={css.calories}>~{calories || 'N/A'} cals</p>
      </div>
      <div className={css.buttonContainer}>
        <RecipeList recipes={recipes} recipeId={recipeId} />
        {isOwner ? (
          <DeleteRecipeButton recipeId={recipeId} />
        ) : (
          <SaveRecipeButton recipeId={recipeId} />
        )}
      </div>
    </div>
  );
}
