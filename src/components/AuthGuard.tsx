import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    if (!authService.isAuthenticated()) {
      authService.logout();
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
    // Check every 60 seconds for session expiry
    const interval = setInterval(checkAuth, 60_000);
    // Also set a timeout for exact expiry
    const remaining = authService.getRemainingMs();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (remaining > 0) {
      timeout = setTimeout(checkAuth, remaining);
    }
    return () => {
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [checkAuth]);

  return <>{children}</>;
}
