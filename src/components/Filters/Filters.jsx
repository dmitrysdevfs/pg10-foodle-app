import { useEffect, useState } from 'react';
import { useFilters } from '../../hooks/useFilters';
import { FiFilter } from 'react-icons/fi';
import s from './Filters.module.css';

const Filters = ({ filters, onChange }) => {
  const { categories, ingredients, loading, error } = useFilters();
  const [selectedCategory, setSelectedCategory] = useState(
    filters?.category || ''
  );
  const [selectedIngredient, setSelectedIngredient] = useState(
    filters?.ingredient || ''
  );
  useEffect(() => {
    setSelectedCategory(filters?.category || '');
    setSelectedIngredient(filters?.ingredient || '');
  }, [filters]);

  const handleCategoryChange = e => {
    const value = e.target.value;
    setSelectedCategory(value);
    onChange({ ...filters, category: value });
  };

  const handleIngredientChange = e => {
    const value = e.target.value;
    setSelectedIngredient(value);
    onChange({ ...filters, ingredient: value });
  };

  const handleReset = () => {
    setSelectedCategory('');
    setSelectedIngredient('');
    onChange({ category: '', ingredient: '' });
  };

  if (error) {
    console.warn('Filters data loading error:', error);
  }

  return (
    <>
      <div className={s.mobFilter}>
        <button className={s.mobFilterBtn}>
          Filters
          <FiFilter className={s.filterIcon} />
        </button>
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
            value={selectedCategory}
            disabled={loading}
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
            value={selectedIngredient}
            disabled={loading}
          >
            <option value="">Ingredients</option>
            {ingredients.map((ingredient, index) => {
              const ingredientValue =
                typeof ingredient === 'string'
                  ? ingredient
                  : ingredient._id || ingredient.name;
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
