/**
 * AdminRoute — Protected route that requires admin (is_staff) access.
 */

import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user?.is_staff) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
