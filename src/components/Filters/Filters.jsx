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

const Filters = ({ totalItems, onChange }) => {
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
  const [, setSearchParams] = useSearchParams();

  // Unified state for inputs
  const [inputs, setInputs] = useState({
    category: '',
    ingredient: '',
    categoryMob: '',
    ingredientMob: '',
  });
  // Unified state for dropdowns
  const [dropdowns, setDropdowns] = useState({
    category: false,
    ingredient: false,
    categoryMob: false,
    ingredientMob: false,
  });
  // Unified refs
  const inputRefs = {
    category: useRef(null),
    ingredient: useRef(null),
    categoryMob: useRef(null),
    ingredientMob: useRef(null),
  };
  const dropdownRefs = {
    category: useRef(null),
    ingredient: useRef(null),
    categoryMob: useRef(null),
    ingredientMob: useRef(null),
  };

  // Sync local input state with Redux filters
  useEffect(() => {
    // Знайти назву інгредієнта за ID
    let ingredientName = '';
    if (filters.ingredient) {
      const found = ingredients.find(
        ing => (typeof ing === 'string' ? ing : ing._id) === filters.ingredient
      );
      ingredientName = typeof found === 'string' ? found : found?.name || '';
    }
    setInputs(prev => ({
      ...prev,
      category: filters.category || '',
      ingredient: ingredientName,
      categoryMob: filters.category || '',
      ingredientMob: ingredientName,
    }));
  }, [filters.category, filters.ingredient, ingredients]);

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
      // Dropdowns
      Object.keys(dropdowns).forEach(key => {
        if (
          dropdowns[key] &&
          dropdownRefs[key].current &&
          !dropdownRefs[key].current.contains(event.target) &&
          inputRefs[key].current &&
          !inputRefs[key].current.contains(event.target)
        ) {
          setDropdowns(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, dropdowns]);

  const handleCategoryChange = e => {
    const value = e.target.value;
    const newFilters = { ...filters, category: value };
    dispatch(setFilters(newFilters));
    if (onChange) {
      onChange(newFilters);
    }
  };

  const handleIngredientChange = e => {
    const value = e.target.value;
    const newFilters = { ...filters, ingredient: value };
    dispatch(setFilters(newFilters));
    if (onChange) {
      onChange(newFilters);
    }
  };

  const handleReset = () => {
    const newFilters = { category: '', ingredient: '' };
    dispatch(setFilters(newFilters));
    if (onChange) {
      onChange(newFilters);
    }
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
            <div className={s.selectWrapper}>
              <input
                ref={inputRefs.categoryMob}
                className={s.select}
                type="text"
                placeholder="Category"
                value={inputs.categoryMob}
                onChange={handleInput('categoryMob')}
                onFocus={() =>
                  setDropdowns(prev => ({ ...prev, categoryMob: true }))
                }
                autoComplete="off"
                disabled={filtersLoading}
              />
              {!inputs.categoryMob && (
                <svg
                  className={s.selectArrow}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 8L10 13L15 8"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {inputs.categoryMob && (
                <button
                  type="button"
                  className={s.resetInputFilterBtn}
                  onClick={() =>
                    handleDropdownReset('categoryMob', 'categoryMob')
                  }
                >
                  <IoMdCloseCircleOutline className={s.resetInputIcon} />
                </button>
              )}
              {dropdowns.categoryMob && filteredCategoriesMob.length > 0 && (
                <ul className={s.dropdown} ref={dropdownRefs.categoryMob}>
                  {filteredCategoriesMob.map(cat => {
                    const name = typeof cat === 'string' ? cat : cat.name;
                    return (
                      <li
                        key={name}
                        className={s.dropdownItem}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDropdownSelect('categoryMob', name, 'category');
                        }}
                      >
                        {name}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          <div className={s.filterGroup}>
            <div className={s.selectWrapper}>
              <input
                ref={inputRefs.ingredientMob}
                className={s.select}
                type="text"
                placeholder="Ingredients"
                value={inputs.ingredientMob}
                onChange={handleInput('ingredientMob')}
                onFocus={() =>
                  setDropdowns(prev => ({ ...prev, ingredientMob: true }))
                }
                autoComplete="off"
                disabled={filtersLoading}
                onKeyDown={e => {
                  if (e.key === 'Enter' && filteredIngredientsMob.length > 0) {
                    handleDropdownSelect(
                      'ingredientMob',
                      typeof filteredIngredientsMob[0] === 'string'
                        ? filteredIngredientsMob[0]
                        : filteredIngredientsMob[0]._id,
                      'ingredient'
                    );
                  }
                }}
              />
              {!inputs.ingredientMob && (
                <svg
                  className={s.selectArrow}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 8L10 13L15 8"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {inputs.ingredientMob && (
                <button
                  type="button"
                  className={s.resetInputFilterBtn}
                  onClick={() =>
                    handleDropdownReset('ingredientMob', 'ingredientMob')
                  }
                >
                  <IoMdCloseCircleOutline className={s.resetInputIcon} />
                </button>
              )}
              {dropdowns.ingredientMob && filteredIngredientsMob.length > 0 && (
                <ul className={s.dropdown} ref={dropdownRefs.ingredientMob}>
                  {filteredIngredientsMob.map(ing => (
                    <li
                      key={typeof ing === 'string' ? ing : ing._id}
                      className={s.dropdownItem}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDropdownSelect(
                          'ingredientMob',
                          typeof ing === 'string' ? ing : ing._id,
                          'ingredient'
                        );
                      }}
                    >
                      {typeof ing === 'string' ? ing : ing.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
          <div className={s.selectWrapper}>
            <input
              ref={inputRefs.category}
              className={s.select}
              type="text"
              placeholder="Category"
              value={inputs.category}
              onChange={handleInput('category')}
              onFocus={() =>
                setDropdowns(prev => ({ ...prev, category: true }))
              }
              autoComplete="off"
              disabled={filtersLoading}
            />
            {!inputs.category && (
              <svg
                className={s.selectArrow}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 8L10 13L15 8"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {inputs.category && (
              <button
                type="button"
                className={s.resetInputFilterBtn}
                onClick={() => handleDropdownReset('category', 'category')}
              >
                <IoMdCloseCircleOutline className={s.resetInputIcon} />
              </button>
            )}
            {dropdowns.category && filteredCategories.length > 0 && (
              <ul className={s.dropdown} ref={dropdownRefs.category}>
                {filteredCategories.map(cat => {
                  const name = typeof cat === 'string' ? cat : cat.name;
                  return (
                    <li
                      key={name}
                      className={s.dropdownItem}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDropdownSelect('category', name, 'category');
                      }}
                    >
                      {name}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className={s.filterGroup}>
          <div className={s.selectWrapper}>
            <input
              ref={inputRefs.ingredient}
              className={s.select}
              type="text"
              placeholder="Ingredients"
              value={inputs.ingredient}
              onChange={handleInput('ingredient')}
              onFocus={() =>
                setDropdowns(prev => ({ ...prev, ingredient: true }))
              }
              autoComplete="off"
              disabled={filtersLoading}
              onKeyDown={e => {
                if (e.key === 'Enter' && filteredIngredients.length > 0) {
                  handleDropdownSelect(
                    'ingredient',
                    typeof filteredIngredients[0] === 'string'
                      ? filteredIngredients[0]
                      : filteredIngredients[0]._id,
                    'ingredient'
                  );
                }
              }}
            />
            {!inputs.ingredient && (
              <svg
                className={s.selectArrow}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 8L10 13L15 8"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {inputs.ingredient && (
              <button
                type="button"
                className={s.resetInputFilterBtn}
                onClick={() => handleDropdownReset('ingredient', 'ingredient')}
              >
                <IoMdCloseCircleOutline className={s.resetInputIcon} />
              </button>
            )}
            {dropdowns.ingredient && filteredIngredients.length > 0 && (
              <ul className={s.dropdown} ref={dropdownRefs.ingredient}>
                {filteredIngredients.map(ing => (
                  <li
                    key={typeof ing === 'string' ? ing : ing._id}
                    className={s.dropdownItem}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDropdownSelect(
                        'ingredient',
                        typeof ing === 'string' ? ing : ing._id,
                        'ingredient'
                      );
                    }}
                  >
                    {typeof ing === 'string' ? ing : ing.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Filters;
