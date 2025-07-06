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

export const addRecipeSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(64, 'Maximum 64 characters')
    .required('Required field'),
  description: Yup.string()
    .min(10, 'Minimum 10 characters')
    .max(200, 'Maximum 200 characters')
    .required('Required field'),
  time: Yup.string()
    .test('is-number', 'It should be a number', value => {
      if (!value) return false;
      const num = Number(value);
      return !isNaN(num) && num >= 1 && num <= 360;
    })
    .required('Required field'),
  calories: Yup.string().test('is-number', 'It should be a number', value => {
    if (!value) return true; // Optional field
    const num = Number(value);
    return !isNaN(num) && num >= 0;
  }),
  category: Yup.string().required('Select a category'),
  instructions: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(1200, 'Maximum 1200 characters')
    .required('Required field'),
});
