import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required'),
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  //   'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  // ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Confirmation is required'),
  terms: Yup.boolean().oneOf([true], 'You must accept the terms'),
});

export const validationSchemaAddRecipe = Yup.object({
  title: Yup.string().min(3, 'Мінімум 3 символи').max(64, 'Максимум 64 символів').required("Обов'язкове поле"),
  descriptionRecipe: Yup.string().min(10, 'Мінімум 10 символів').max(200, 'Максимум 200 символів').required("Обов'язкове поле"),
  cookingTime: Yup.number().typeError('Має бути числом').min(1, 'Мінімум 1 хвилина').max(360, 'Максимум 360 хвилин').required("Обов'язкове поле"),
  calories: Yup.number().typeError('Має бути числом').min(0, 'Не може бути менше 0'),
  category: Yup.string().required("Оберіть категорію"),
  ingredientName: Yup.string().required("Оберіть інгредієнт"),
  ingredientAmount: Yup.string().matches(/^[0-9]+[a-zA-Z]*$/, 'Наприклад: 100g').required("Вкажіть кількість"),
  instructions: Yup.string().min(3, 'Мінімум 3 символів').max(1200, 'Максимум 1200 символів').required("Обов'язкове поле"),
});
