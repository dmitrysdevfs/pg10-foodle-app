import css from './RecipeAddIngredient.module.css';
import { FaRegTrashCan } from 'react-icons/fa6';

const RecipeAddIngredient = ({ ingredients, onRemove }) => {
  return (
    <div className={css.container}>
      {ingredients.length > 0 && (
        <div className={css.boxName}>
          <h3 className={css.name}>Name:</h3>
          <h3 className={css.amount}>Amount:</h3>
          <div></div>
        </div>
      )}
      {ingredients.map((item, index) => (
        <div
          className={css.boxIngredient}
          key={item.id + (item.measure || item.amount)}
        >
          <div className={css.ingredientName}>{item.name}</div>
          <div className={css.ingredientcount}>
            {item.measure || item.amount}
          </div>
          <button
            className={css.button}
            onClick={() => onRemove(index)}
            aria-label="Remove ingredient"
          >
            <FaRegTrashCan className={css.icon} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default RecipeAddIngredient;
