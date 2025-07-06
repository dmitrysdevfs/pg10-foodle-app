import css from './AddRecipeForm.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import Container from '../../assets/Container.png';
import RecipeAddIngredient from '../RecipeAddIngredient/RecipeAddIngredient';
import { addRecipeSchema } from '../../utils/validationSchemas';
import { toast } from 'react-toastify';
import {
  fetchCategoriesAsync,
  fetchIngredientsAsync,
  createRecipe,
} from '../../redux/recipes/recipesSlice';
import {
  selectCategories,
  selectIngredients,
  selectIsLoading,
  selectError,
} from '../../redux/recipes/selectors';

const AddRecipeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categories = useSelector(selectCategories);
  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState({
    id: '',
    measure: '',
  });

  useEffect(() => {
    dispatch(fetchCategoriesAsync());
    dispatch(fetchIngredientsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const addIngredient = () => {
    if (currentIngredient?.id && currentIngredient?.measure) {
      const ingredient = ingredients?.find(
        ing => ing._id === currentIngredient.id
      );
      if (ingredient) {
        const newIngredient = {
          id: ingredient._id,
          name: ingredient.name,
          measure: currentIngredient.measure,
        };

        // Check if ingredient already exists
        const exists = ingredientsList.some(ing => ing.id === ingredient._id);
        if (!exists) {
          setIngredientsList(prev => [...prev, newIngredient]);
          setCurrentIngredient({ id: '', measure: '' });
        } else {
          toast.warning('The ingredient is already added');
        }
      }
    } else {
      toast.warning('Please select an ingredient and enter a measure');
    }
  };

  const removeIngredient = index => {
    setIngredientsList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    // Validate that at least one ingredient is added
    if (ingredientsList.length === 0) {
      toast.error(' Please add at least one ingredient');
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      // Add basic recipe data
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('time', values.time ? values.time.toString() : '');
      formData.append('category', values.category);
      formData.append('instructions', values.instructions);

      // Add calories if provided
      // if (values.calories) {
      //   formData.append('calories', values.calories.toString());
      // }

      // Add ingredients as JSON string (backend expects this format)
      const ingredientsData = ingredientsList.map(ing => ({
        id: ing.id,
        measure: ing.measure,
      }));
      formData.append('ingredients', JSON.stringify(ingredientsData));

      // Add photo if selected
      if (selectedImage) {
        formData.append('photo', selectedImage);
      }

      // Dispatch create recipe action
      const result = await dispatch(createRecipe(formData)).unwrap();

      if (result.data) {
        toast.success('Рецепт успішно створено!');
        // Navigate to the created recipe page
        navigate(`/recipes/${result.data._id}`);
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      toast.error(error || 'Failed to create recipe');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e, submitForm) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitForm();
    }
  };

  return (
    <div className={css.container}>
      <Formik
        initialValues={{
          title: '',
          description: '',
          time: '',
          calories: '',
          category: '',
          instructions: '',
        }}
        validationSchema={addRecipeSchema}
        onSubmit={handleSubmit}
      >
        {({ submitForm }) => (
          <Form onKeyPress={e => handleKeyPress(e, submitForm)}>
            <div className={css.boxUploadPhoto}>
              <div className={css.boxUploadInput}>
                <label
                  className={clsx(css.title, css.titleInputImage)}
                  htmlFor="inputImage"
                >
                  Upload Photo
                </label>
                <input
                  className={css.inputImage}
                  id="inputImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <img
                  src={preview || Container}
                  alt="Preview"
                  className={css.previewImage}
                />
              </div>

              <div className={css.generalInformation}>
                <h2 className={clsx(css.title, css.titleGeneral)}>
                  General Information
                </h2>
                <label className={css.titleText}>
                  Recipe Title
                  <Field
                    className={clsx(css.input, css.nameRecipe)}
                    type="text"
                    name="title"
                    placeholder="Enter the name of your recipe"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className={css.error}
                  />
                </label>
                <label className={css.titleText}>
                  Recipe Description
                  <Field
                    className={clsx(css.input, css.description)}
                    as="textarea"
                    name="description"
                    placeholder="Enter a brief description"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className={css.error}
                  />
                </label>
                <label className={css.titleText}>
                  Cooking time in minutes
                  <Field
                    className={clsx(css.input, css.cookingTime)}
                    type="text"
                    name="time"
                    placeholder="10"
                  />
                  <ErrorMessage
                    name="time"
                    component="div"
                    className={css.error}
                  />
                </label>

                <div className={css.containerFood}>
                  <label className={css.titleText}>
                    Calories (optional)
                    <Field
                      className={clsx(css.input, css.calories)}
                      type="text"
                      name="calories"
                      placeholder="100"
                    />
                    <ErrorMessage
                      name="calories"
                      component="div"
                      className={css.error}
                    />
                  </label>
                  <label className={css.titleText}>
                    Category
                    <Field className={css.category} as="select" name="category">
                      <option value="">Category</option>
                      {categories?.map(cat => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="div"
                      className={css.error}
                    />
                  </label>
                </div>
              </div>
            </div>

            <h2 className={clsx(css.title, css.titleIngredients)}>
              Ingredients
            </h2>
            <div className={css.nameAmount}>
              <label className={css.titleText}>
                Name
                <select
                  className={css.ingredientName}
                  value={currentIngredient?.id || ''}
                  onChange={e =>
                    setCurrentIngredient(prev => ({
                      ...prev,
                      id: e.target.value,
                    }))
                  }
                >
                  <option value="">Оберіть інгредієнт</option>
                  {ingredients?.map(ing => (
                    <option key={ing._id} value={ing._id}>
                      {ing.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={clsx(css.titleText, css.titleTextAmount)}>
                Amount
                <input
                  className={clsx(css.input, css.inputIngredients)}
                  type="text"
                  value={currentIngredient?.measure || ''}
                  placeholder="100g"
                  onChange={e =>
                    setCurrentIngredient(prev => ({
                      ...prev,
                      measure: e.target.value,
                    }))
                  }
                />
              </label>
              <button
                className={css.buttonRemove}
                type="button"
                onClick={() => {
                  if (ingredientsList.length > 0) {
                    removeIngredient(ingredientsList.length - 1);
                  }
                }}
              >
                Remove last Ingredient
              </button>
              <button
                className={css.buttonAdd}
                type="button"
                onClick={addIngredient}
              >
                Add new Ingredient
              </button>
            </div>

            <RecipeAddIngredient
              ingredients={ingredientsList}
              onRemove={removeIngredient}
            />

            <h2 className={clsx(css.title, css.titleInstructions)}>
              Instructions
            </h2>
            <label className={css.titleText}>
              <Field
                className={clsx(css.input, css.instructions)}
                as="textarea"
                name="instructions"
                placeholder="Enter a text"
              />
              <ErrorMessage
                name="instructions"
                component="div"
                className={css.error}
              />
            </label>
            <div className={css.buttonSubmitbox}>
              <button
                className={css.buttonSubmit}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Publishing...' : 'Publish Recipe'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddRecipeForm;
