import css from './RegisterForm.module.css';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerSchema } from '../../../utils/validationSchemas';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../../redux/auth/operations';

import EyeIcon from '../../../assets/castom-icons/eye.svg';
import EyeClosedIcon from '../../../assets/castom-icons/eye-clossed.svg';
// import GoogleButton from '../../GoogleButton/GoogleButton';
import Loader from '../../Loader/Loader';

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.auth);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      await dispatch(
        register({
          name: values.name,
          email: values.email,
          password: values.password,
        })
      ).unwrap();

      toast.success('Registration successful!', {
        duration: 4000,
      });
      setTimeout(() => {
        navigate('/');
        resetForm();
      }, 200);
    } catch (error) {
      if (Array.isArray(error)) {
        error.forEach(element => {
          toast.error(element, {
            duration: 5000,
          });
        });
      } else {
        toast.error(error, {
          duration: 5000,
        });
      }
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
        initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          terms: false,
        }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            <div className={css.inputGroup}>
              <label htmlFor="name" className={css.label}>
                Enter your name
              </label>
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
              <label htmlFor="email" className={css.label}>
                Enter your email address
              </label>
              <div className={css.inputWrapper}>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className={css.input}
                  placeholder="email@gmail.com"
                />
              </div>
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
                  {showPassword ? (
                    <EyeClosedIcon width={20} height={20} />
                  ) : (
                    <EyeIcon width={20} height={20} />
                  )}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className={css.error}
              />
            </div>

            <div className={css.inputGroup}>
              <label htmlFor="confirmPassword" className={css.label}>
                Repeat your password
              </label>
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
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? (
                    <EyeClosedIcon width={20} height={20} />
                  ) : (
                    <EyeIcon width={20} height={20} />
                  )}
                </button>
              </div>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className={css.error}
              />
            </div>

            <label className={css.checkboxLabel}>
              <Field type="checkbox" name="terms" />I agree to the Terms of
              Service and Privacy Policy
            </label>
            <ErrorMessage name="terms" component="div" className={css.error} />

            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || loading}
            >
              {loading ? (
                <div className={css.loaderContainer}>
                  <span>Creating account...</span>
                  <Loader className={css.registerLoader} />
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </Form>
        )}
      </Formik>

      <p className={css.bottomText}>
        Already have an account?{' '}
        <Link to="/auth/login" className={css.loginLink}>
          Log in
        </Link>
      </p>
      {/* <GoogleButton /> */}
    </div>
  );
};

export default RegistrationForm;
