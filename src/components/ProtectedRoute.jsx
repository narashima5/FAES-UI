import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  const { settings } = useSettings();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <h2 style={{ padding: '2rem', textAlign: 'center' }}>404 - Page Not Found</h2>;
  }

  // Enforce Maintenance Mode for standard roles
  if (settings?.maintenance_mode && ['staff', 'hod'].includes(user.role)) {
    return (
       <div style={{ padding: '4rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#d32f2f' }}>System Under Maintenance</h1>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>
             The FAES Platform is currently undergoing scheduled maintenance. Please check back later.
          </p>
       </div>
    );
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
