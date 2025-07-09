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
import { useSearchParams } from 'react-router-dom';

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

  // Filtered lists
  const filteredIngredients = ingredients.filter(ing => {
    const name = typeof ing === 'string' ? ing : ing.name;
    return name && name.toLowerCase().includes(inputs.ingredient.toLowerCase());
  });
  const filteredIngredientsMob = ingredients.filter(ing => {
    const name = typeof ing === 'string' ? ing : ing.name;
    return (
      name && name.toLowerCase().includes(inputs.ingredientMob.toLowerCase())
    );
  });
  const filteredCategories = categories.filter(cat => {
    const name = typeof cat === 'string' ? cat : cat.name;
    return name && name.toLowerCase().includes(inputs.category.toLowerCase());
  });
  const filteredCategoriesMob = categories.filter(cat => {
    const name = typeof cat === 'string' ? cat : cat.name;
    return (
      name && name.toLowerCase().includes(inputs.categoryMob.toLowerCase())
    );
  });

  // Handlers
  const handleInput = field => e => {
    const value = e.target.value;
    // Reset both if needed (logic for cross-reset)
    if (
      (field === 'ingredient' && !inputs.category && filters.category) ||
      (field === 'category' && !inputs.ingredient && filters.ingredient)
    ) {
      setInputs(prev => ({ ...prev, ingredient: '', category: '' }));
      dispatch(setFilters({ category: '', ingredient: '' }));
      if (onChange) onChange({ category: '', ingredient: '' });
    } else if (
      (field === 'ingredientMob' && !inputs.categoryMob && filters.category) ||
      (field === 'categoryMob' && !inputs.ingredientMob && filters.ingredient)
    ) {
      setInputs(prev => ({ ...prev, ingredientMob: '', categoryMob: '' }));
      dispatch(setFilters({ category: '', ingredient: '' }));
      if (onChange) onChange({ category: '', ingredient: '' });
    } else {
      setInputs(prev => ({ ...prev, [field]: value }));
    }
    setDropdowns(prev => ({ ...prev, [field]: true }));
  };

  const handleDropdownSelect = (field, value, filterKey) => {
    // For ingredients, we need to set the name in input but pass ID to filters
    if (filterKey === 'ingredient') {
      const ingredient = ingredients.find(
        ing => (typeof ing === 'string' ? ing : ing._id) === value
      );
      console.log(
        'Selected ingredient:',
        ingredient,
        'Value:',
        value,
        'Ingredients:',
        ingredients
      );
      const displayName =
        typeof ingredient === 'string' ? ingredient : ingredient?.name || value;
      setInputs(prev => ({ ...prev, [field]: displayName }));
    } else {
      setInputs(prev => ({ ...prev, [field]: value }));
    }
    setDropdowns(prev => ({ ...prev, [field]: false }));
    const newFilters = { ...filters, [filterKey]: value };
    dispatch(setFilters(newFilters));
    if (onChange) onChange(newFilters);
  };

  const handleDropdownReset = (field1, field2) => {
    setInputs(prev => ({ ...prev, [field1]: '', [field2]: '' }));

    const newFilters = { category: '', ingredient: '' };

    // Викликаємо setFilters тільки якщо фільтри дійсно змінилися
    if (filters.category !== '' || filters.ingredient !== '') {
      dispatch(setFilters(newFilters));
      if (onChange) onChange(newFilters);
    }

    // Оновлюємо URL параметри - useEffect автоматично синхронізує Redux
    setSearchParams(params => {
      const newParams = new URLSearchParams(params);
      newParams.delete('category');
      newParams.delete('ingredient');
      newParams.delete('search');
      return newParams;
    });
  };

  const handleReset = () => {
    console.log('handleReset called');
    setInputs({
      category: '',
      ingredient: '',
      categoryMob: '',
      ingredientMob: '',
    });

    const newFilters = { category: '', ingredient: '' };

    // Викликаємо setFilters тільки якщо фільтри дійсно змінилися
    if (filters.category !== '' || filters.ingredient !== '') {
      console.log('Dispatching setFilters:', newFilters);
      dispatch(setFilters(newFilters));
      if (onChange) onChange(newFilters);
    }

    // Оновлюємо URL параметри - useEffect автоматично синхронізує Redux
    setSearchParams(params => {
      const newParams = new URLSearchParams(params);
      newParams.delete('category');
      newParams.delete('ingredient');
      newParams.delete('search');
      console.log('Updated search params:', newParams.toString());
      return newParams;
    });
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
                    stroke="#7C3AED"
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
                    stroke="#7C3AED"
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
                  stroke="#7C3AED"
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
                  stroke="#7C3AED"
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
