import { useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateToken } from '../../redux/auth/authSlice';

const SESSION_CONFIG = {
  refreshInterval: 28 * 60 * 1000, // 28 хв
  inactivityTimeout: 30 * 60 * 1000, // 30 хв
  throttleDelay: 1000, // 1 сек
  retryDelays: [1000, 3000, 5000], // Прогресивні затримки (exponential backoff)
  maxRetries: 3
};

// Винести createThrottle за межі компонента для оптимізації
const createThrottle = (func, delay) => {
  let timeoutId;
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    if (timeSinceLastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func.apply(this, args);
      }, delay - timeSinceLastCall);
    }
  };
};

export default function SessionManager() {
  const lastActivityRef = useRef(Date.now());
  const refreshSessionRef = useRef(null);
  const intervalRef = useRef(null);
  const dispatch = useDispatch();

  const updateActivity = useCallback(
    createThrottle(() => {
      lastActivityRef.current = Date.now();
    }, SESSION_CONFIG.throttleDelay),
    [SESSION_CONFIG.throttleDelay]
  );

  const logSessionEvent = useCallback((event, data = {}) => {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      event,
      ...data,
      sessionId: sessionStorage.getItem('sessionId') || 'unknown'
    };

    if (import.meta.env.MODE === 'development') {
      console.log(`[SessionManager] ${event}`, logData);
    }

    // Тут можна додати відправку на сервер для моніторингу
    // analytics.track('session_event', logData);
  }, []);

  const refreshSession = useCallback(async (retryCount = 0) => {
    logSessionEvent('refresh_started', { retryCount });

    // Створюємо новий AbortController для кожного запиту
    const controller = new AbortController();
    refreshSessionRef.current = controller;

    try {
      const res = await axios.post('/api/auth/refresh', null, {
        withCredentials: true,
        signal: controller.signal,
        timeout: 10000 // 10 секунд таймаут
      });

      const newToken = res.data.data.accessToken;
      dispatch(updateToken(newToken));
      logSessionEvent('refresh_success');
      return newToken;

    } catch (err) {
      // Якщо запит був скасований, не обробляємо помилку
      if (err.name === 'AbortError') {
        logSessionEvent('refresh_aborted');
        return;
      }

      logSessionEvent('refresh_failed', {
        error: err.message,
        retryCount,
        status: err.response?.status,
        code: err.code
      });

      // Перевірка на помилку авторизації
      if (err.response?.status === 401) {
        logSessionEvent('unauthorized_error');
        window.location.href = '/auth/login';
        return;
      }

      // Визначаємо, чи потрібно повторити запит
      const shouldRetry = retryCount < SESSION_CONFIG.maxRetries &&
        (err.response?.status >= 500 ||
          err.code === 'NETWORK_ERROR' ||
          err.code === 'ECONNABORTED' ||
          err.code === 'TIMEOUT');

      if (shouldRetry) {
        const delay = SESSION_CONFIG.retryDelays[retryCount] ||
          SESSION_CONFIG.retryDelays[SESSION_CONFIG.retryDelays.length - 1];

        logSessionEvent('retry_scheduled', { delay, retryCount: retryCount + 1 });

        // Чекаємо перед повторною спробою
        await new Promise(resolve => setTimeout(resolve, delay));
        return refreshSession(retryCount + 1);
      } else {
        logSessionEvent('session_refresh_failed', { finalError: err.message });
        window.location.href = '/auth/login';
      }
    }
  }, [dispatch, logSessionEvent]);

  const performLogout = useCallback(async () => {
    logSessionEvent('logout_started');
    try {
      await axios.post('/api/auth/logout', null, {
        withCredentials: true,
        timeout: 5000
      });
      logSessionEvent('logout_success');
    } catch (err) {
      logSessionEvent('logout_failed', { error: err.message });
    } finally {
      window.location.href = '/auth/login';
    }
  }, [logSessionEvent]);

  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    logSessionEvent('interval_started');

    intervalRef.current = setInterval(async () => {
      const now = Date.now();
      const inactiveDuration = now - lastActivityRef.current;

      if (inactiveDuration < SESSION_CONFIG.inactivityTimeout) {
        logSessionEvent('activity_check', {
          inactiveDuration,
          inactiveMinutes: Math.floor(inactiveDuration / 60000)
        });
        await refreshSession();
      } else {
        logSessionEvent('inactivity_timeout', {
          inactiveDuration,
          inactiveMinutes: Math.floor(inactiveDuration / 60000)
        });
        await performLogout();
      }
    }, SESSION_CONFIG.refreshInterval);
  }, [refreshSession, performLogout, logSessionEvent]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      logSessionEvent('interval_stopped');
    }
  }, [logSessionEvent]);

  useEffect(() => {
    // Події для відстеження активності користувача
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    // Додаємо слухачі подій
    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    // Обробник зміни видимості вкладки
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSessionEvent('tab_hidden');
        stopInterval();
      } else {
        logSessionEvent('tab_visible');
        // Оновлюємо активність при поверненні на вкладку
        updateActivity();
        startInterval();
      }
    };

    // Обробник закриття вікна/вкладки
    const handleBeforeUnload = () => {
      logSessionEvent('page_unload');
      // Скасовуємо активні запити
      if (refreshSessionRef.current) {
        refreshSessionRef.current.abort();
      }
    };

    // Обробник помилок мережі
    const handleOnline = () => {
      logSessionEvent('network_online');
      startInterval();
    };

    const handleOffline = () => {
      logSessionEvent('network_offline');
      stopInterval();
    };

    // Додаємо слухачі
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Запускаємо інтервал
    startInterval();

    // Cleanup функція
    return () => {
      // Видаляємо слухачі подій активності
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });

      // Видаляємо інші слухачі
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      // Зупиняємо інтервал
      stopInterval();

      // Скасовуємо активні запити
      if (refreshSessionRef.current) {
        refreshSessionRef.current.abort();
      }
    };
  }, [updateActivity, startInterval, stopInterval, logSessionEvent]);

  // Додаємо публічний API для ручного оновлення сесії
  useEffect(() => {
    window.sessionManager = {
      refreshSession: () => refreshSession(),
      getLastActivity: () => lastActivityRef.current,
      getInactivityDuration: () => Date.now() - lastActivityRef.current,
      updateActivity: () => updateActivity()
    };

    return () => {
      delete window.sessionManager;
    };
  }, [refreshSession, updateActivity]);

  return null;
}