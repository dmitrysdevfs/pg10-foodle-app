import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ component: Component, redirectTo = '/auth/login' }) {
  const { isLoggedIn } = useSelector(state => state.auth);

  return isLoggedIn ? <Component /> : <Navigate to={redirectTo} />;
}
