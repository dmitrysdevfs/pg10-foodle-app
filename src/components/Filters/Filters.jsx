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
  // Desktop
  const [ingredientInput, setIngredientInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const ingredientInputRef = useRef(null);
  const dropdownRef = useRef(null);
  // Mobile
  const [ingredientInputMob, setIngredientInputMob] = useState('');
  const [showDropdownMob, setShowDropdownMob] = useState(false);
  const ingredientInputRefMob = useRef(null);
  const dropdownRefMob = useRef(null);
  // Додаю стейт для кастомного дропдауна категорій
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryInputRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  // Мобільний
  const [categoryInputMob, setCategoryInputMob] = useState('');
  const [showCategoryDropdownMob, setShowCategoryDropdownMob] = useState(false);
  const categoryInputRefMob = useRef(null);
  const categoryDropdownRefMob = useRef(null);

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

  const filteredIngredients = ingredients.filter(ing => {
    const name = typeof ing === 'string' ? ing : ing.name;
    return name && name.toLowerCase().includes(ingredientInput.toLowerCase());
  });
  const filteredIngredientsMob = ingredients.filter(ing => {
    const name = typeof ing === 'string' ? ing : ing.name;
    return (
      name && name.toLowerCase().includes(ingredientInputMob.toLowerCase())
    );
  });

  // Додаю фільтрацію категорій
  const filteredCategories = categories.filter(cat => {
    const name = typeof cat === 'string' ? cat : cat.name;
    return name && name.toLowerCase().includes(categoryInput.toLowerCase());
  });
  const filteredCategoriesMob = categories.filter(cat => {
    const name = typeof cat === 'string' ? cat : cat.name;
    return name && name.toLowerCase().includes(categoryInputMob.toLowerCase());
  });

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        ingredientInputRef.current &&
        !ingredientInputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        dropdownRefMob.current &&
        !dropdownRefMob.current.contains(event.target) &&
        ingredientInputRefMob.current &&
        !ingredientInputRefMob.current.contains(event.target)
      ) {
        setShowDropdownMob(false);
      }
    };
    if (showDropdownMob) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdownMob]);

  // Додаю useEffect для закриття дропдауна категорій по кліку поза
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target) &&
        categoryInputRef.current &&
        !categoryInputRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };
    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryDropdown]);
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        categoryDropdownRefMob.current &&
        !categoryDropdownRefMob.current.contains(event.target) &&
        categoryInputRefMob.current &&
        !categoryInputRefMob.current.contains(event.target)
      ) {
        setShowCategoryDropdownMob(false);
      }
    };
    if (showCategoryDropdownMob) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryDropdownMob]);

  // Desktop
  const handleIngredientInput = e => {
    const value = e.target.value;
    // Якщо category порожнє і у фільтрах воно було встановлене — скидаємо обидва
    if (!categoryInput && filters.category) {
      setIngredientInput('');
      setCategoryInput('');
      dispatch(setFilters({ category: '', ingredient: '' }));
      if (onChange) onChange({ category: '', ingredient: '' });
    } else {
      setIngredientInput(value);
    }
    setShowDropdown(true);
  };
  const handleIngredientSelect = ing => {
    const value = typeof ing === 'string' ? ing : ing._id;
    setIngredientInput(typeof ing === 'string' ? ing : ing.name);
    setShowDropdown(false);
    const newFilters = { ...filters, ingredient: value };
    dispatch(setFilters(newFilters));
    if (onChange) onChange(newFilters);
  };
  const handleIngredientReset = () => {
    setIngredientInput('');
    setCategoryInput('');
    dispatch(setFilters({ category: '', ingredient: '' }));
    if (onChange) onChange({ category: '', ingredient: '' });
  };
  // Mobile
  const handleIngredientInputMob = e => {
    const value = e.target.value;
    if (!categoryInputMob && filters.category) {
      setIngredientInputMob('');
      setCategoryInputMob('');
      dispatch(setFilters({ category: '', ingredient: '' }));
      if (onChange) onChange({ category: '', ingredient: '' });
    } else {
      setIngredientInputMob(value);
    }
    setShowDropdownMob(true);
  };
  const handleIngredientSelectMob = ing => {
    const value = typeof ing === 'string' ? ing : ing._id;
    setIngredientInputMob(typeof ing === 'string' ? ing : ing.name);
    setShowDropdownMob(false);
    const newFilters = { ...filters, ingredient: value };
    dispatch(setFilters(newFilters));
    if (onChange) onChange(newFilters);
  };
  const handleIngredientResetMob = () => {
    setIngredientInputMob('');
    setCategoryInputMob('');
    dispatch(setFilters({ category: '', ingredient: '' }));
    if (onChange) onChange({ category: '', ingredient: '' });
  };

  // Додаю обробники для вибору категорії
  const handleCategoryInput = e => {
    const value = e.target.value;
    // Якщо ingredient порожнє і у фільтрах воно було встановлене — скидаємо обидва
    if (!ingredientInput && filters.ingredient) {
      setIngredientInput('');
      setCategoryInput('');
      dispatch(setFilters({ category: '', ingredient: '' }));
      if (onChange) onChange({ category: '', ingredient: '' });
    } else {
      setCategoryInput(value);
    }
    setShowCategoryDropdown(true);
  };
  const handleCategorySelect = cat => {
    const value = typeof cat === 'string' ? cat : cat.name;
    setCategoryInput(value);
    setShowCategoryDropdown(false);
    const newFilters = { ...filters, category: value };
    dispatch(setFilters(newFilters));
    if (onChange) onChange(newFilters);
  };
  const handleCategoryReset = () => {
    setIngredientInput('');
    setCategoryInput('');
    dispatch(setFilters({ category: '', ingredient: '' }));
    if (onChange) onChange({ category: '', ingredient: '' });
  };
  // Мобільний
  const handleCategoryInputMob = e => {
    const value = e.target.value;
    if (!ingredientInputMob && filters.ingredient) {
      setIngredientInputMob('');
      setCategoryInputMob('');
      dispatch(setFilters({ category: '', ingredient: '' }));
      if (onChange) onChange({ category: '', ingredient: '' });
    } else {
      setCategoryInputMob(value);
    }
    setShowCategoryDropdownMob(true);
  };
  const handleCategorySelectMob = cat => {
    const value = typeof cat === 'string' ? cat : cat.name;
    setCategoryInputMob(value);
    setShowCategoryDropdownMob(false);
    const newFilters = { ...filters, category: value };
    dispatch(setFilters(newFilters));
    if (onChange) onChange(newFilters);
  };
  const handleCategoryResetMob = () => {
    setIngredientInputMob('');
    setCategoryInputMob('');
    dispatch(setFilters({ category: '', ingredient: '' }));
    if (onChange) onChange({ category: '', ingredient: '' });
  };

  const handleReset = () => {
    setCategoryInput('');
    setIngredientInput('');
    setCategoryInputMob('');
    setIngredientInputMob('');
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
                ref={categoryInputRefMob}
                className={s.select}
                type="text"
                placeholder="Category"
                value={categoryInputMob}
                onChange={handleCategoryInputMob}
                onFocus={() => setShowCategoryDropdownMob(true)}
                autoComplete="off"
                disabled={filtersLoading}
              />
              {!categoryInputMob && (
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
              {categoryInputMob && (
                <button
                  type="button"
                  className={s.resetInputFilterBtn}
                  onClick={handleCategoryResetMob}
                >
                  <IoMdCloseCircleOutline className={s.resetInputIcon} />
                </button>
              )}
              {showCategoryDropdownMob && filteredCategoriesMob.length > 0 && (
                <ul className={s.dropdown} ref={categoryDropdownRefMob}>
                  {filteredCategoriesMob.map(cat => {
                    const name = typeof cat === 'string' ? cat : cat.name;
                    return (
                      <li
                        key={name}
                        className={s.dropdownItem}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCategorySelectMob(cat);
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
                ref={ingredientInputRefMob}
                className={s.select}
                type="text"
                placeholder="Ingredients"
                value={ingredientInputMob}
                onChange={handleIngredientInputMob}
                onFocus={() => setShowDropdownMob(true)}
                autoComplete="off"
                disabled={filtersLoading}
                onKeyDown={e => {
                  if (e.key === 'Enter' && filteredIngredientsMob.length > 0) {
                    handleIngredientSelectMob(filteredIngredientsMob[0]);
                  }
                }}
              />
              {!ingredientInputMob && (
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
              {ingredientInputMob && (
                <button
                  type="button"
                  className={s.resetInputFilterBtn}
                  onClick={handleIngredientResetMob}
                >
                  <IoMdCloseCircleOutline className={s.resetInputIcon} />
                </button>
              )}
              {showDropdownMob && filteredIngredientsMob.length > 0 && (
                <ul className={s.dropdown} ref={dropdownRefMob}>
                  {filteredIngredientsMob.map(ing => (
                    <li
                      key={typeof ing === 'string' ? ing : ing._id}
                      className={s.dropdownItem}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleIngredientSelectMob(ing);
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
              ref={categoryInputRef}
              className={s.select}
              type="text"
              placeholder="Category"
              value={categoryInput}
              onChange={handleCategoryInput}
              onFocus={() => setShowCategoryDropdown(true)}
              autoComplete="off"
              disabled={filtersLoading}
            />
            {!categoryInput && (
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
            {categoryInput && (
              <button
                type="button"
                className={s.resetInputFilterBtn}
                onClick={handleCategoryReset}
              >
                <IoMdCloseCircleOutline className={s.resetInputIcon} />
              </button>
            )}
            {showCategoryDropdown && filteredCategories.length > 0 && (
              <ul className={s.dropdown} ref={categoryDropdownRef}>
                {filteredCategories.map(cat => {
                  const name = typeof cat === 'string' ? cat : cat.name;
                  return (
                    <li
                      key={name}
                      className={s.dropdownItem}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCategorySelect(cat);
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
              ref={ingredientInputRef}
              className={s.select}
              type="text"
              placeholder="Ingredients"
              value={ingredientInput}
              onChange={handleIngredientInput}
              onFocus={() => setShowDropdown(true)}
              autoComplete="off"
              disabled={filtersLoading}
              onKeyDown={e => {
                if (e.key === 'Enter' && filteredIngredients.length > 0) {
                  handleIngredientSelect(filteredIngredients[0]);
                }
              }}
            />
            {!ingredientInput && (
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
            {ingredientInput && (
              <button
                type="button"
                className={s.resetInputFilterBtn}
                onClick={handleIngredientReset}
              >
                <IoMdCloseCircleOutline className={s.resetInputIcon} />
              </button>
            )}
            {showDropdown && filteredIngredients.length > 0 && (
              <ul className={s.dropdown} ref={dropdownRef}>
                {filteredIngredients.map(ing => (
                  <li
                    key={typeof ing === 'string' ? ing : ing._id}
                    className={s.dropdownItem}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleIngredientSelect(ing);
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
