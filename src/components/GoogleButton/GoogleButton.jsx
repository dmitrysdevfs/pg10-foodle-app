import { FcGoogle } from 'react-icons/fc';
import s from './GoogleButton.module.css';
import toast from 'react-hot-toast';

const GoogleButton = () => {
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
    <>
      <div className={s.divider}>
        <span className={s.dividerText}>OR</span>
      </div>
      <button type="button" className={s.googleBtn} onClick={handleGoogleLogin}>
        <FcGoogle className={s.googleIcon} />
        <span>Sign in with Google</span>
      </button>
    </>
  );
};

export default GoogleButton;
