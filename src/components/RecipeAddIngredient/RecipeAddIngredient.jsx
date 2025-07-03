
import css from './RecipeAddIngredient.module.css';
import IconTrash from '../../assets/IconTrash.svg';
// import { clsx } from 'clsx';


const RecipeAddIngredient = () => {
 
  return (
  <div className={css.container}>
      
      <div className={css.boxName}>
        <h3 className={css.name}>Name:</h3>
        <h3 className={css.amount}>Amount:</h3>
      </div>
      <div className={css.boxIngredient}>
        <p className={css.ingredientName}>Egs</p>
        <p className={css.ingredientcount}>3</p>
        <button className={css.button}>
          <img className={css.icon} src={IconTrash} alt="IconTrash" />
        </button>
      </div>

  </div>

  );
};

export default RecipeAddIngredient;
