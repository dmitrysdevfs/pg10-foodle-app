import RegisterForm from '../../components/Auth/RegisterForm/RegisterForm';
import css from './RegisterPage.module.css';

export default function RegisterPage() {
  return (
    <div className={css.container}>
      <h1>Register Page</h1>
      <RegisterForm />
    </div>
  );
} 