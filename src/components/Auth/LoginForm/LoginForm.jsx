import css from './LoginForm.module.css';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
const initialValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      alert('Login successful!');
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={css.wrap}>
      <h2 className={css.title}>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className={css.form}>
            <div className={css.inputGroup}>
              <label htmlFor="email" className={css.label}>
                Enter your email address
              </label>
              <Field name="email">
                {({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder="email@gmail.com"
                    className={`${css.input} ${
                      touched.email && errors.email ? css.inputError : ''
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage name="email" component="div" className={css.error} />
            </div>

            <div className={css.inputGroup}>
              <label htmlFor="password" className={css.label}>
                Create a strong password
              </label>
              <div className={css.inputWrapper}>
                <Field name="password">
                  {({ field }) => (
                    <input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="*********"
                      className={`${css.input} ${
                        touched.password && errors.password ? css.inputError : ''
                      }`}
                    />
                  )}
                </Field>
                <button
                  type="button"
                  className={css.eyeButton}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className={css.error} />
            </div>

            <button type="submit" className={css.submitButton} disabled={isSubmitting}>
              Login
            </button>
          </Form>
        )}
      </Formik>

      <p className={css.bottomText}>
        Don’t have an account?
        <Link to="/register" className={css.registerLink}> Register</Link>
      </p>
    </div>
  );
}
