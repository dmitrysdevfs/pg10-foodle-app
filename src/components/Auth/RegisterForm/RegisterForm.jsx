import css from './RegisterForm.module.css';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';


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

      navigate('/');
      resetForm();
    } catch (error) {
      alert(error.message); // replace with toast in real project
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
                >
                  👁
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
                >
                  👁
                </button>
              </div>
              <ErrorMessage name="confirmPassword" component="div" className={css.error} />
            </div>

            <label className={css.checkboxLabel}>
              <Field type="checkbox" name="terms" />
              I agree to the Terms of Service and Privacy Policy
            </label>
            <ErrorMessage name="terms" component="div" className={css.error} />

            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              Create account
            </button>
          </Form>
        )}
      </Formik>

      <p className={css.bottomText}>
        Already have an account?{' '}
        <Link to="/login" className={css.loginLink}>
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegistrationForm;
