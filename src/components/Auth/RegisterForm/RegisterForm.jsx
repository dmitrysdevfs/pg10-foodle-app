import css from './RegisterForm.module.css';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    .required('Confirmation is required'),
  terms: Yup.boolean().oneOf([true], 'You must accept the terms'),
});

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong...');
      }

      toast.success('Registration successful!');
      navigate('/');
      resetForm();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={css.wrap}>
      <h2 className={css.title}>Register</h2>
      <p className={css.subtitle}>
        Join our community of culinary enthusiasts, save your favorite recipes,
        and share your cooking creations
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <div className={css.inputGroup}>
              <label htmlFor="email" className={css.label}>Enter your email address</label>
              <div className={css.inputWrapper}>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className={css.input}
                  placeholder="email@gmail.com"
                />
              </div>
              <ErrorMessage name="email" component="div" className={css.error} />
            </div>

            <div className={css.inputGroup}>
              <label htmlFor="name" className={css.label}>Enter your name</label>
              <div className={css.inputWrapper}>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className={css.input}
                  placeholder="Max"
                />
              </div>
              <ErrorMessage name="name" component="div" className={css.error} />
            </div>

            <div className={css.inputGroup}>
              <label htmlFor="password" className={css.label}>Create a strong password</label>
              <div className={css.inputWrapper}>
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className={css.input}
                  placeholder="*********"
                />
                <button
                  type="button"
                  className={css.eyeButton}
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <use
                      xlinkHref={showPassword ? '#icon-eye-crossed-1' : '#icon-eye-1'}
                    />
                  </svg>
                </button>
              </div>
              <ErrorMessage name="password" component="div" className={css.error} />
            </div>

            <div className={css.inputGroup}>
              <label htmlFor="confirmPassword" className={css.label}>Repeat your password</label>
              <div className={css.inputWrapper}>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className={css.input}
                  placeholder="*********"
                />
                <button
                  type="button"
                  className={css.eyeButton}
                  onClick={() => setShowConfirm(prev => !prev)}
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <use
                      xlinkHref={showConfirm ? '#icon-eye-crossed-1' : '#icon-eye-1'}
                    />
                  </svg>
                </button>
              </div>
              <ErrorMessage name="confirmPassword" component="div" className={css.error} />
            </div>

            <div className={css.checkboxWrapper}>
              <Field id="terms" name="terms" type="checkbox" />
              <label htmlFor="terms" className={css.label}>
                I accept the <a href="/terms" target="_blank" rel="noopener noreferrer">terms and conditions</a>
              </label>
              <ErrorMessage name="terms" component="div" className={css.error} />
            </div>

            <button type="submit" className={css.submitButton} disabled={isSubmitting}>
              Register
            </button>
          </Form>
        )}
      </Formik>

      <ToastContainer position="top-right" autoClose={3000} />
      
      <p className={css.bottomText}>
        Already have an account?
        <Link to="/auth/login" className={css.loginLink}> Login</Link>
      </p>
    </div>
  );
};

export default RegistrationForm;
