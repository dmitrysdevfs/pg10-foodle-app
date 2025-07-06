import { useParams, Navigate } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm/RegisterForm';
import css from './AuthPage.module.css';

export default function AuthPage() {
  const { authType } = useParams();

  // Перевіряємо, чи є authType валідним
  if (authType !== 'login' && authType !== 'register') {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className={css.container}>
      {authType === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}
