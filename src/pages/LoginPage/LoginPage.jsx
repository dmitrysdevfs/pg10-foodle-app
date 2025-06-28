import LoginForm from '../../components/Auth/LoginForm/LoginForm';
import css from './LoginPage.module.css';

export default function LoginPage() {
  return (
    <div className={css.container}>
      <h1>Login Page</h1>
      <LoginForm />
    </div>
  );
} 