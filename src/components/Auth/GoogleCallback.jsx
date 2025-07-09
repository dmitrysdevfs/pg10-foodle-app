import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { logInWithGoogle } from '../../redux/auth/operations';
import { toast } from 'react-hot-toast';

const GoogleCallback = () => {
  const [params] = useSearchParams();
  const code = params.get('code');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!code) return;

    const confirmGoogleLogin = async () => {
      try {
        await dispatch(logInWithGoogle(code)).unwrap();
        navigate('/');
      } catch (error) {
        console.error('Google auth error', error);
        toast.error(error.message || 'Google login failed');
        navigate('/auth/login');
      }
    };

    confirmGoogleLogin();
  }, [code, dispatch, navigate]);

  return <p>Logging in with Google...</p>;
};

export default GoogleCallback;
