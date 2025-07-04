import css from './RecipeAddForm.module.css';

import { Formik, Form, Field } from 'formik';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import axios from 'axios';
import * as Yup from 'yup';

import Container from '../../assets/Container.png';
import RecipeAddIngredient from '../RecipeAddIngredient/RecipeAddIngredient';

const validationSchema = Yup.object({
  title: Yup.string().min(3, 'Мінімум 3 символи').max(50, 'Максимум 50 символів').required("Обов'язкове поле"),
  descriptionRecipe: Yup.string().min(10, 'Мінімум 10 символів').required("Обов'язкове поле"),
  cookingTime: Yup.number().typeError('Має бути числом').min(1, 'Мінімум 1 хвилина').required("Обов'язкове поле"),
  calories: Yup.number().typeError('Має бути числом').min(0, 'Не може бути менше 0'),
  category: Yup.string().required("Оберіть категорію"),
  ingredientName: Yup.string().required("Оберіть інгредієнт"),
  ingredientAmount: Yup.string().matches(/^[0-9]+[a-zA-Z]*$/, 'Наприклад: 100g').required("Вкажіть кількість"),
  instructions: Yup.string().min(10, 'Мінімум 10 символів').required("Обов'язкове поле"),
});

const RecipeAddForm = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [ingredientsOptions, setIngredientsOptions] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    axios.get('/api/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Помилка при отриманні категорій:', err));

    axios.get('/api/ingredients')
      .then((res) => setIngredientsOptions(res.data))
      .catch((err) => console.error('Помилка при отриманні інгредієнтів:', err));
  }, []);

  const addIngredient = (ingredient) => {
    setIngredientsList((prev) => [...prev, ingredient]);
  };

  const removeIngredient = (index) => {
    setIngredientsList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={css.container}>
      <Formik
        initialValues={{
          title: '',
          descriptionRecipe: '',
          cookingTime: '',
          calories: '',
          category: '',
          ingredientName: '',
          ingredientAmount: '',
          instructions: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const formData = new FormData();

          for (const key in values) {
            if (key !== 'ingredientName' && key !== 'ingredientAmount') {
              formData.append(key, values[key]);
            }
          }

          ingredientsList.forEach((ingredient, index) => {
            formData.append(`ingredients[${index}][name]`, ingredient.name);
            formData.append(`ingredients[${index}][amount]`, ingredient.amount);
          });

          if (selectedImage) {
            formData.append('image', selectedImage);
          }

          axios.post('/api/recipes/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
            .then((res) => console.log('Success:', res.data))
            .catch((err) => console.error('Error:', err));
        }}
      >
        {({ values }) => (
          <Form>
            <div className={css.boxUploadPhoto}>
              <div className={css.boxUploadInput}>
                <h2 className={css.title}>Upload Photo</h2>
                <input className={css.inputImage} type="file" accept="image/*" onChange={handleImageChange} />
                <img src={preview || Container} alt="Preview" className={css.previewImage} />
              </div>

              <div className={css.generalInformation}>
                <h2 className={clsx(css.title, css.titleGeneral)}>General Information</h2>
                <label className={css.titleText}>Recipe Title
                  <Field className={clsx(css.input, css.nameRecipe)} type="text" name="title" placeholder="Enter the name of your recipe" />
                </label>
                <label className={css.titleText}>Recipe Description
                  <Field className={clsx(css.input, css.descriptionRecipe)} as="textarea" name="descriptionRecipe" placeholder="Enter a brief description" />
                </label>
                <label className={css.titleText}>Cooking time in minutes
                  <Field className={clsx(css.input, css.cookingTime)} type="number" name="cookingTime" placeholder="10" />
                </label>

                <div className={css.containerFood}>
                  <label className={css.titleText}>Calories
                    <Field className={clsx(css.input, css.calories)} type="text" name="calories" />
                  </label>
                  <label className={css.titleText}>Category
                    <Field className={css.category} as="select" name="category">
{/*                      
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}  */}
                    </Field>
                  </label>
                </div>
              </div>
            </div>

            <h2 className={clsx(css.title, css.titleIngredients)}>Ingredients</h2>
            <div className={css.nameAmount}>
              <label className={css.titleText}>Name
                <Field className={css.ingredientName} as="select" name="ingredientName">
                  
                  {/* {ingredientsOptions.map(ing => (
                    <option key={ing._id} value={ing.name}>{ing.name}</option>
                  ))} */}
                </Field>
              </label>
              <label className={clsx(css.titleText, css.titleTextAmount)}>Amount
                <Field className={clsx(css.input, css.inputIngredients)} type="text" name="ingredientAmount" placeholder="100g" />
              </label>
              <button
                className={css.buttonAdd}
                type="button"
                onClick={() => {
                  if (values.ingredientName && values.ingredientAmount) {
                    addIngredient({
                      name: values.ingredientName,
                      amount: values.ingredientAmount,
                    });
                  }
                }}
              >
                Add new Ingredient
              </button>
            </div>

            <RecipeAddIngredient ingredients={ingredientsList} onRemove={removeIngredient} />

            <h2 className={clsx(css.title, css.titleInstructions)}>Instructions</h2>
            <label className={css.titleText}>
              <Field className={clsx(css.input, css.instructions)} as="textarea" name="instructions" placeholder="Enter a text" />
            </label>
            <div className={css.buttonSubmitbox}>
              <button className={css.buttonSubmit} type="submit">Publish Recipe</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RecipeAddForm;