import css from './LoginForm.module.css';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginSchema } from '../../../utils/validationSchemas';
import { useDispatch, useSelector } from 'react-redux';
import { logIn } from '../../../redux/auth/operations';

import EyeIcon from '../../../assets/castom-icons/eye.svg';
import EyeClosedIcon from '../../../assets/castom-icons/eye-clossed.svg';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(logIn(values)).unwrap();
      toast.success('Login successful!', {
        duration: 4000,
      });
      setTimeout(() => {
        navigate('/');
      }, 200);
    } catch (error) {
      toast.error(error.message || 'Login failed', {
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/google-oauth-url`
      );
      const data = await response.json();

      const url = data?.data?.oauth_url;

      if (url) {
        window.location.href = url;
      } else {
        toast.error('Failed to get Google login URL');
      }
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  };

  return (
    <div className={css.wrap}>
      <h2 className={css.title}>Login</h2>

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={loginSchema}
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
                    id="email"
                    type="email"
                    placeholder="email@gmail.com"
                    className={`${css.input} ${
                      touched.email && errors.email ? css.inputError : ''
                    }`}
                  />
                )}
              </Field>
              <ErrorMessage
                name="email"
                component="div"
                className={css.error}
              />
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
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="*********"
                      className={`${css.input} ${
                        touched.password && errors.password
                          ? css.inputError
                          : ''
                      }`}
                    />
                  )}
                </Field>
                <button
                  type="button"
                  className={css.eyeButton}
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeClosedIcon width={24} height={24} />
                  ) : (
                    <EyeIcon width={24} height={24} />
                  )}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className={css.error}
              />
            </div>

            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>

      <p className={css.bottomText}>
        Don&apos;t have an account?
        <Link to="/auth/register" className={css.registerLink}>
          {' '}
          Register
        </Link>
      </p>

      <button onClick={handleGoogleLogin}>Sign in with Google</button>
    </div>
  );
}
