import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip redirect if we're already on the auth page
    if (loading) return;
    
    // Allow access to authentication pages without being logged in
    if (location.pathname === '/auth' || location.pathname === '/auth-callback') {
      return;
    }
    
    if (!isAuthenticated) {
      toast.error('Please sign in to access this page', {
        duration: 3000,
      });
      
      // Redirect to auth page with the return URL
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/auth?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, loading, navigate, location]);

  // When loading, return nothing
  if (loading) {
    return null;
  }

  // If we're on auth pages or authenticated, render children
  if (isAuthenticated || location.pathname === '/auth' || location.pathname === '/auth-callback') {
    return <>{children}</>;
  }

  // Otherwise render nothing while redirect happens
  return null;
};

export default AuthGuard;
