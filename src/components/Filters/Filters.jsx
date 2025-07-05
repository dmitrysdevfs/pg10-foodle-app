import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiFilter } from 'react-icons/fi';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import {
  fetchCategoriesAsync,
  fetchIngredientsAsync,
  setFilters,
} from '../../redux/recipes/recipesSlice';
import {
  selectCategories,
  selectIngredients,
  selectFiltersLoading,
  selectFiltersError,
  selectFilters,
  selectIsLoading,
} from '../../redux/recipes/selectors';
import s from './Filters.module.css';

const Filters = ({ totalItems }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const ingredients = useSelector(selectIngredients);
  const filtersLoading = useSelector(selectFiltersLoading);
  const error = useSelector(selectFiltersError);
  const filters = useSelector(selectFilters);
  const isLoading = useSelector(selectIsLoading);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const filterButtonRef = useRef(null);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategoriesAsync());
    }
    if (ingredients.length === 0) {
      dispatch(fetchIngredientsAsync());
    }
  }, [dispatch, categories.length, ingredients.length]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleCategoryChange = e => {
    const value = e.target.value;
    dispatch(setFilters({ ...filters, category: value }));
  };

  const handleIngredientChange = e => {
    const value = e.target.value;
    dispatch(setFilters({ ...filters, ingredient: value }));
  };

  const handleReset = () => {
    dispatch(setFilters({ category: '', ingredient: '' }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (error) {
    console.warn('Filters data loading error:', error);
  }

  return (
    <>
      <span className={s.recipesCount}>
        {isLoading
          ? 'Searching...'
          : totalItems > 0
            ? `${totalItems} recipes`
            : 'No recipes'}
      </span>
      <div className={s.mobFilter}>
        <button
          ref={filterButtonRef}
          className={s.mobFilterBtn}
          onClick={toggleMobileMenu}
        >
          Filters
          {isMobileMenuOpen ? (
            <IoMdCloseCircleOutline className={s.filterIcon} />
          ) : (
            <FiFilter className={s.filterIcon} />
          )}
        </button>
        <div
          ref={mobileMenuRef}
          className={`${s.mobMenu} ${isMobileMenuOpen ? s.mobMenuOpen : ''}`}
        >
          <div className={s.filterGroup}>
            <select
              id="category-mob"
              onChange={handleCategoryChange}
              className={s.select}
              value={filters?.category || ''}
              disabled={filtersLoading}
            >
              <option value="">Category</option>
              {categories.map((category, index) => {
                const categoryValue =
                  typeof category === 'string'
                    ? category
                    : category.name || category._id;
                const categoryKey =
                  typeof category === 'string'
                    ? category
                    : category._id || index;
                return (
                  <option key={categoryKey} value={categoryValue}>
                    {categoryValue}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={s.filterGroup}>
            <select
              id="ingredient-mob"
              onChange={handleIngredientChange}
              className={s.select}
              value={filters?.ingredient || ''}
              disabled={filtersLoading}
            >
              <option value="">Ingredients</option>
              {ingredients.map((ingredient, index) => {
                const ingredientValue =
                  typeof ingredient === 'string' ? ingredient : ingredient._id;
                const ingredientKey =
                  typeof ingredient === 'string'
                    ? ingredient
                    : ingredient._id || index;
                const ingredientLabel =
                  typeof ingredient === 'string'
                    ? ingredient
                    : ingredient.name || ingredient._id;
                return (
                  <option key={ingredientKey} value={ingredientValue}>
                    {ingredientLabel}
                  </option>
                );
              })}
            </select>
          </div>
          <button onClick={handleReset} className={s.resetButton}>
            Reset filters
          </button>
        </div>
      </div>

      <div className={s.pcFilter}>
        <button onClick={handleReset} className={s.resetButton}>
          Reset filters
        </button>
        <div className={s.filterGroup}>
          <select
            id="category"
            onChange={handleCategoryChange}
            className={s.select}
            value={filters?.category || ''}
            disabled={filtersLoading}
          >
            <option value="">Category</option>
            {categories.map((category, index) => {
              const categoryValue =
                typeof category === 'string'
                  ? category
                  : category.name || category._id;
              const categoryKey =
                typeof category === 'string' ? category : category._id || index;

              return (
                <option key={categoryKey} value={categoryValue}>
                  {categoryValue}
                </option>
              );
            })}
          </select>
        </div>

        <div className={s.filterGroup}>
          <select
            id="ingredient"
            onChange={handleIngredientChange}
            className={s.select}
            value={filters?.ingredient || ''}
            disabled={filtersLoading}
          >
            <option value="">Ingredients</option>
            {ingredients.map((ingredient, index) => {
              // Always use ObjectId as value for backend compatibility
              const ingredientValue =
                typeof ingredient === 'string' ? ingredient : ingredient._id;
              const ingredientKey =
                typeof ingredient === 'string'
                  ? ingredient
                  : ingredient._id || index;
              const ingredientLabel =
                typeof ingredient === 'string'
                  ? ingredient
                  : ingredient.name || ingredient._id;

              return (
                <option key={ingredientKey} value={ingredientValue}>
                  {ingredientLabel}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </>
  );
};

export default Filters;
