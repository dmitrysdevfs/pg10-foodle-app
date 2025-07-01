
import css from './RecipeAddForm.module.css';

import Container from '../../assets/Container.png';

import { Formik, Form, Field } from 'formik';
import { useState } from 'react';
import { clsx } from 'clsx';



const RecipeAddForm = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
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
        onSubmit={(values) => {
            const formData = new FormData();

            // додай текстові поля
            for (const key in values) {
              formData.append(key, values[key]);
            }

            // додай зображення
            if (selectedImage) {
              formData.append('image', selectedImage);
            }

            fetch('http://localhost:3001/api/recipes', {
              method: 'POST',
              body: formData,
            })
              .then(res => res.json())
              .then(data => {
                console.log('Success:', data);
              })
              .catch(err => {
                console.error('Error:', err);
              });
          }}
      >
        <Form>
                  
          <h2 className={css.title}>Upload Photo</h2>
          
            <input type="file" accept="image/*" onChange={handleImageChange} className={css.inputImage} />
          
          <img
            src={preview || Container}
            alt="Preview"
            className={css.previewImage}
          />
          <div className={css.generalInformation}>
        <h2 className={clsx(css.title, css.titleGeneral)}>General Information</h2>
          <label className={css.titleText}>Recipe Title
          <Field
            className={clsx(css.input, css.nameRecipe)}
            type="text"
            name="title"
            placeholder="Enter the name of your recipe"
            />
          </label>

          <label className={css.titleText}>Recipe Description
          <Field
            className={clsx(css.input, css.descriptionRecipe)}
            as="textarea"
            name="descriptionRecipe"
            placeholder="Enter a brief description of your recipe"
          />
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
              <option className={css.categoryOption} value="">Select a category</option>
              <option className={css.categoryOption} value="red">Червоний</option>
              <option className={css.categoryOption} value="green">Зелений</option>
              <option className={css.categoryOption} value="blue">Синій</option>
              <option className={css.categoryOption} value="yellow">Жовтий</option>
              </Field>
            </label>
          </div>
          </div>
          <h2 className={css.title}>Ingredients</h2>
          <label className={css.titleText}>Name
            <Field className={css.ingredientName} as="select" name="ingredientName">
            <option className={css.ingredientNameOption} value="red">Червоний</option>
            <option className={css.ingredientNameOption} value="green">Зелений</option>
            <option className={css.ingredientNameOption} value="blue">Синій</option>
            <option className={css.ingredientNameOption} value="yellow">Жовтий</option>
            </Field>
          </label>

          <label className={css.titleText}>Amount
          <Field className={clsx(css.input, css.ingredientAmount)} type="text" name="ingredientAmount" placeholder="100g" />
          </label>
          <button className={css.buttonRemove} type="button">Remove last Ingredient</button>
          <button className={css.buttonAdd} type="button">Add new Ingredient</button>

          <h2 className={css.title}>Instructions</h2>
          <label className={css.titleText} >
            <Field
            className={clsx(css.input, css.instructions)}
            as="textarea"
            name="instructions"
            placeholder="Enter a text"
            />
          </label>

          <button
            className={css.buttonSubmit}
            type="submit">Publish Recipe</button>
        </Form>
      </Formik>
  </div>

  );
};

export default RecipeAddForm;
