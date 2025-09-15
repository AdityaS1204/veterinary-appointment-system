import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: ('DOCTOR' | 'PATIENT')[];
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // User not logged in, redirect to login
        navigate('/login');
      } else if (!allowedRoles.includes(user.role)) {
        // User doesn't have permission for this route, redirect to correct dashboard
        if (user.role === 'DOCTOR') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/patient-dashboard');
        }
      }
    }
  }, [user, isLoading, allowedRoles, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if user is not authenticated or doesn't have permission
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default RouteGuard;
