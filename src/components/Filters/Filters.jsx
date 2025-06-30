import s from './Filters.module.css';

const Filters = () => {
  const handleCategoryChange = e => {
    const category = e.target.value;
  };

  const handleIngredientChange = e => {
    const ingredient = e.target.value;
  };

  const handleReset = () => {};

  return (
    <>
      <div className={s.mobFilter}>
        <button className={s.mobFilterBtn}>Filters</button>
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
          >
            <option value="">Category</option>
            {['Breakfast', 'Lunch', 'Dinner'].map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className={s.filterGroup}>
          <select
            id="ingredient"
            onChange={handleIngredientChange}
            className={s.select}
          >
            <option value="">Ingredients</option>
            {['Chicken', 'Beef', 'Vegetables'].map(ingredient => (
              <option key={ingredient} value={ingredient}>
                {ingredient}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default Filters;
