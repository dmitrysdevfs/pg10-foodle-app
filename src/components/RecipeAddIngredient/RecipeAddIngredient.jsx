import css from './RecipeAddIngredient.module.css';
import { FaRegTrashCan } from "react-icons/fa6";

const RecipeAddIngredient = ({ ingredients, onRemove }) => {
  return (
    <div className={css.container}>
      <div className={css.boxName}>
        <h3 className={css.name}>Name:</h3>
        <h3 className={css.amount}>Amount:</h3>
      </div>

      {ingredients.map((item, index) => (
        <ul className={css.boxIngredient} key={index}>
          <li className={css.boxIngredientItem}>
            <p className={css.ingredientName}>{item.name}</p>
            <p className={css.ingredientcount}>{item.amount}</p>
            <button className={css.button} onClick={() => onRemove(index)}>
              <FaRegTrashCan />
            </button>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default RecipeAddIngredient;