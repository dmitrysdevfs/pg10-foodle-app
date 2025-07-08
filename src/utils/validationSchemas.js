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
  time: Yup.number()
    .typeError('Must be a number')
    .min(1, 'Min 1 minute')
    .max(360, 'Max 360 minutes')
    .required('Required field'),
  calories: Yup.number()
    .typeError('Must be a number')
    .min(1, 'Min 1')
    .max(10000, 'Max 10000')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  category: Yup.string().required('Select a category'),
  instructions: Yup.string()
    .min(3, 'Minimum 3 characters')
    .max(1200, 'Maximum 1200 characters')
    .required('Required field'),
  photo: Yup.mixed()
    .test('fileSize', 'Image size must be less than 2MB', value => {
      if (!value) return true; // not required
      return value.size <= 2 * 1024 * 1024;
    })
    .nullable(),
});
