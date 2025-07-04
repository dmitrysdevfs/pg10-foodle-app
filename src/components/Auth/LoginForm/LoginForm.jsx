import css from './LoginForm.module.css';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginSchema } from '../../../utils/validationSchemas';
import { useDispatch, useSelector } from 'react-redux';
import { logIn } from '../../../redux/auth/operations';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(logIn(values)).unwrap();
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setSubmitting(false);
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
                    className={`${css.input} ${touched.email && errors.email ? css.inputError : ''
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
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="*********"
                      className={`${css.input} ${touched.password && errors.password ? css.inputError : ''
                        }`}
                    />
                  )}
                </Field>
                <button
                  type="button"
                  className={css.eyeButton}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className={css.error} />
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
        <Link to="/auth/register" className={css.registerLink}> Register</Link>
      </p>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
