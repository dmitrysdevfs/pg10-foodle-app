import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiFilter } from 'react-icons/fi';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import toast from 'react-hot-toast';
import {
  fetchCategoriesAsync,
  fetchIngredientsAsync,
  setFilters,
  setSearchQuery,
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

const Filters = ({ totalItems, onChange, onReset = null }) => {
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

  // Filtered data for dropdowns
  const filteredCategories = categories.filter(cat => {
    const name = cat.name;
    return (
      inputs.category === '' ||
      name.toLowerCase().includes(inputs.category.toLowerCase())
    );
  });

  const filteredCategoriesMob = categories.filter(cat => {
    const name = cat.name;
    return (
      inputs.categoryMob === '' ||
      name.toLowerCase().includes(inputs.categoryMob.toLowerCase())
    );
  });

  const filteredIngredients = ingredients.filter(ing => {
    const name = ing.name;
    return (
      inputs.ingredient === '' ||
      name.toLowerCase().includes(inputs.ingredient.toLowerCase())
    );
  });

  const filteredIngredientsMob = ingredients.filter(ing => {
    const name = ing.name;
    return (
      inputs.ingredientMob === '' ||
      name.toLowerCase().includes(inputs.ingredientMob.toLowerCase())
    );
  });

  // Sync local input state with Redux filters
  useEffect(() => {
    // Знайти назву інгредієнта за ID
    let ingredientName = '';
    if (filters.ingredient) {
      const found = ingredients.find(ing => ing._id === filters.ingredient);
      ingredientName = found?.name || '';
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

  const handleReset = () => {
    // Викликаємо зовнішню функцію скидання, якщо вона передана
    if (onReset) {
      onReset();
    } else {
      // Fallback: скидаємо тільки фільтри
      const newFilters = { category: '', ingredient: '' };
      dispatch(setFilters(newFilters));

      // Скидаємо пошук
      dispatch(setSearchQuery(''));

      // Викликаємо onChange з порожніми фільтрами
      if (onChange) {
        onChange(newFilters);
      }
    }

    // Скидаємо локальні стани
    setInputs({
      category: '',
      ingredient: '',
      categoryMob: '',
      ingredientMob: '',
    });

    // Закриваємо всі dropdown
    setDropdowns({
      category: false,
      ingredient: false,
      categoryMob: false,
      ingredientMob: false,
    });

    // Показуємо повідомлення
    toast.success('Filters and search have been reset');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Handler functions for inputs and dropdowns
  const handleInput = inputKey => e => {
    const value = e.target.value;
    setInputs(prev => ({ ...prev, [inputKey]: value }));
    setDropdowns(prev => ({ ...prev, [inputKey]: true }));
  };

  const handleDropdownSelect = (inputKey, value, filterKey) => {
    // Для інгредієнтів зберігаємо ID, для категорій - назву
    let filterValue = value;
    let inputValue = value;

    if (filterKey === 'ingredient') {
      // Знаходимо інгредієнт за ID і отримуємо назву для відображення
      const ingredient = ingredients.find(ing => ing._id === value);
      if (ingredient) {
        inputValue = ingredient.name;
      }
      filterValue = value; // ID
    } else {
      // Для категорій зберігаємо назву
      filterValue = value; // назва
      inputValue = value; // назва
    }

    setInputs(prev => ({ ...prev, [inputKey]: inputValue }));
    setDropdowns(prev => ({ ...prev, [inputKey]: false }));

    const newFilters = { ...filters, [filterKey]: filterValue };
    dispatch(setFilters(newFilters));
    if (onChange) {
      onChange(newFilters);
    }
  };

  const handleDropdownReset = (inputKey, filterKey) => {
    setInputs(prev => ({ ...prev, [inputKey]: '' }));
    setDropdowns(prev => ({ ...prev, [inputKey]: false }));

    const newFilters = { ...filters, [filterKey]: '' };
    dispatch(setFilters(newFilters));
    if (onChange) {
      onChange(newFilters);
    }
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
                  {filteredCategoriesMob.map(cat => (
                    <li
                      key={cat.name}
                      className={s.dropdownItem}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDropdownSelect(
                          'categoryMob',
                          cat.name,
                          'category'
                        );
                      }}
                    >
                      {cat.name}
                    </li>
                  ))}
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
                      filteredIngredientsMob[0]._id,
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
                      key={ing._id}
                      className={s.dropdownItem}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDropdownSelect(
                          'ingredientMob',
                          ing._id,
                          'ingredient'
                        );
                      }}
                    >
                      {ing.name}
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
                {filteredCategories.map(cat => (
                  <li
                    key={cat.name}
                    className={s.dropdownItem}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDropdownSelect('category', cat.name, 'category');
                    }}
                  >
                    {cat.name}
                  </li>
                ))}
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
                    filteredIngredients[0]._id,
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
                    key={ing._id}
                    className={s.dropdownItem}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDropdownSelect('ingredient', ing._id, 'ingredient');
                    }}
                  >
                    {ing.name}
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
