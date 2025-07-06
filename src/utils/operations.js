import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
axios.defaults.baseURL = API_BASE_URL;

// Cache for ingredients to avoid repeated API calls
let ingredientsCache = null;
let ingredientsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getIngredientsCache = async () => {
  const now = Date.now();
  if (!ingredientsCache || now - ingredientsCacheTime > CACHE_DURATION) {
    try {
      const response = await axios.get('/api/ingredients');
      ingredientsCache = response.data.data;
      ingredientsCacheTime = now;
    } catch (error) {
      console.error('Error fetching ingredients for cache:', error);
      ingredientsCache = [];
    }
  }
  return ingredientsCache;
};

export const fetchRecipes = async ({
  search = '',
  category = '',
  ingredient = '',
  page = 1,
}) => {
  try {
    const params = {};
    if (search) params.title = search;
    if (category) params.category = category;

    // If ingredient is provided, we need to find its ID by name
    if (ingredient) {
      try {
        // Get ingredients from cache
        const ingredients = await getIngredientsCache();
        const foundIngredient = ingredients.find(
          ing => ing.name && ing.name.toLowerCase() === ingredient.toLowerCase()
        );

        if (foundIngredient) {
          params.ingredient = foundIngredient._id;
        } else {
          console.warn(`Ingredient "${ingredient}" not found`);
        }
      } catch (error) {
        console.error('Error fetching ingredients for filtering:', error);
      }
    }

    if (page) params.page = page;

    const response = await axios.get('/api/recipes', { params });

    const { data } = response.data;

    if (!Array.isArray(data.data)) {
      throw new Error('Unexpected data format: expected an array');
    }

    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const fetchRecipeByID = async id => {
  try {
    const response = await axios.get(`/api/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  const response = await axios.get('/api/categories');

  return response.data.data;
};

export const fetchIngredients = async () => {
  const response = await axios.get('/api/ingredients');

  // Clear cache when ingredients are fetched
  ingredientsCache = response.data.data;
  ingredientsCacheTime = Date.now();

  return response.data.data;
};

export const createRecipe = async (recipeData) => {
  try {
    const response = await axios.post('/api/recipes', recipeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};
