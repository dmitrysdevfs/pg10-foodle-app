import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

export const fetchRecipes = async () => {
  const response = await axios.get('/api/recipes/search');

  const { data } = response.data;

  if (!Array.isArray(data.data)) {
    throw new Error('Unexpected data format: expected an array');
  }

  return data;
};
