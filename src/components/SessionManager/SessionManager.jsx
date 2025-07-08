import { useEffect, useRef } from 'react';
import axios from 'axios';

const REFRESH_INTERVAL = 28 * 60 * 1000;
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

export default function SessionManager() {
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
    ];
    events.forEach(event => window.addEventListener(event, updateActivity));

    const intervalId = setInterval(async () => {
      const now = Date.now();
      const inactiveDuration = now - lastActivityRef.current;

      if (inactiveDuration < INACTIVITY_TIMEOUT) {
        try {
          const res = await axios.post('/api/auth/refresh', null, {
            withCredentials: true,
          });
          console.log(res.data.data.accessToken);
        } catch (err) {
          console.warn(err);
          window.location.href = '/auth/login';
        }
      } else {
        try {
          await axios.post('/api/auth/logout', null, {
            withCredentials: true,
          });
        } catch (err) {
          console.warn(err);
        } finally {
          window.location.href = '/auth/login';
        }
      }
    }, REFRESH_INTERVAL);

    return () => {
      events.forEach(event =>
        window.removeEventListener(event, updateActivity)
      );
      clearInterval(intervalId);
    };
  }, []);

  return null;
}
