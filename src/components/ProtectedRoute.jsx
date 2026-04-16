import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <h2 style={{ padding: '2rem', textAlign: 'center' }}>404 - Page Not Found</h2>;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
