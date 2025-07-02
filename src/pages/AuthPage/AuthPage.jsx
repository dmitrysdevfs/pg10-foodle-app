import { useLocation } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm/LoginForm';
import RegistrationForm from '../../components/Auth/RegisterForm/RegisterForm';
import css from './AuthPage.module.css';

export default function AuthPage() {
  const location = useLocation();
  const isLogin = location.pathname.includes('/login');

  return (
    <div className={css.container}>
      {isLogin ? <LoginForm /> : <RegistrationForm />}
    </div>
  );
}
