import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../Button/Button';
import s from './SearchBox.module.css';
import clsx from 'clsx';

const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = e => {
    setQuery(e.target.value);
    if (error) setError('');
  };

  const validateQuery = value => {
    if (!value.trim()) {
      setError('Enter a search query!');
      toast.error('Enter a search query!');
      return false;
    }
    if (value.trim().length < 2) {
      setError('Minimal 2 characters!');
      toast.error('Minimal 2 characters!');
      return false;
    }
    return true;
  };

  const handleSearch = e => {
    e.preventDefault();

    if (!validateQuery(query)) {
      return;
    }

    setError('');
    onSearch(query.trim());
    toast.success(`Search recipe: "${query.trim()}"`);
  };

  return (
    <div className={s.searchBoxContainer}>
      <form onSubmit={handleSearch} className={s.form}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search recipes"
          className={clsx(s.input, error && s.inputError)}
          maxLength={100}
        />
        <Button
          onClick={handleSearch}
          type="submit"
          text="Search"
          className={s.searchBtn}
        />
      </form>
    </div>
  );
};

export default SearchBox;
