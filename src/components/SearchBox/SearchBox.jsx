import { useState } from 'react';
import Button from '../Button/Button';
import s from './SearchBox.module.css';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = e => {
    setQuery(e.target.value);
    if (error) setError('');
  };

  const handleSearch = e => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Sorry, search query cant be empty');
      return;
    }
  };

  return (
    <div className={s.searchBoxContainer}>
      <form onSubmit={handleSearch} className={s.form}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search recipres"
          className={s.input}
        />
        {error && <p className={s.error}>{error}</p>}
        <Button
          onClick={handleSearch}
          type="submit"
          text="Search"
          className={s.inputBtn}
        />
      </form>
    </div>
  );
};

export default SearchBox;
