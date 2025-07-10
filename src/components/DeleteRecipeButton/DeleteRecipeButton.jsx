import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { deleteOwnRecipe } from '../../redux/profile/operations';
import css from './DeleteRecipeButton.module.css';
import DeleteTreshIcon from '../../assets/icons/DeleteTreshIcon.svg';

export default function DeleteRecipeButton({ recipeId, className = '' }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    toast(
      t => (
        <div className={css.toastWrapper}>
          <p>Are you sure you want to delete this recipe?</p>
          <div className={css.toastButtons}>
            <button
              onClick={() => {
                dispatch(deleteOwnRecipe(recipeId));
                toast.dismiss(t.id);
              }}
              className={css.confirmBtn}
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className={css.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
      }
    );
  };

  return (
    <button
      className={`${css.deleteBtn} ${className}`}
      onClick={handleDelete}
      title="Delete recipe"
    >
      <DeleteTreshIcon />
    </button>
  );
}
