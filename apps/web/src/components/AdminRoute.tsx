import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
  children: JSX.Element;
}

/**
 * Route wrapper that ensures the authenticated user has the 'admin' role.
 * Redirects unauthenticated users to /login and normal users to /dashboard.
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0b2138] border-t-transparent" />
          <p className="text-sm text-slate-500 font-medium">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    // Normal users attempting manual navigation to /admin are redirected to /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
