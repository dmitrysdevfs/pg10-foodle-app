import { useLocation } from 'react-router-dom';
import SaveIcon from '../../assets/icons/SaveIcon.svg';
import s from './SaveRecipeButton.module.css';

const SaveRecipeButton = () => {
  const location = useLocation();
  const isRecipeView = /^\/recipes\/[^/]+$/.test(location.pathname);

  return (
    <button className={isRecipeView ? s.button : s.iconBtn} type="button">
      {isRecipeView ? (
        <>
          <span className={s.text}>Save</span>
          <SaveIcon className={s.icon} />
        </>
      ) : (
        <SaveIcon className={s.icon} />
      )}
    </button>
  );
};

export default SaveRecipeButton;
