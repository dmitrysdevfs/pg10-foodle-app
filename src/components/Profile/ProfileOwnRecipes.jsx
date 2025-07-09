import ProfileRecipesSection from './ProfileRecipesSection';
import {
  selectOwnRecipes,
  selectOwnHasMore,
  selectOwnPage,
  selectLoading,
  selectError,
  selectOwnTotalItems,
  selectPerPage,
} from '../../redux/profile/selectors';
import { fetchOwnRecipes } from '../../redux/profile/operations';
import s from './ProfileNavigation/ProfileNavigation.module.css';

const ProfileOwnRecipes = () => {
  return (
    <div className={s.innerWrapper}>
      <ProfileRecipesSection
        fetchAction={fetchOwnRecipes}
        selectRecipes={selectOwnRecipes}
        selectLoading={selectLoading}
        selectError={selectError}
        selectHasMore={selectOwnHasMore}
        selectPage={selectOwnPage}
        selectTotalItems={selectOwnTotalItems}
        perPage={selectPerPage}
        type="own"
      />
    </div>
  );
};

export default ProfileOwnRecipes;
