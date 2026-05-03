import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import DashboardRouter from './routes/DashboardRouter.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import GlobalErrorAlert from './components/GlobalErrorAlert.jsx';

function App() {
  return (
    <>
      <GlobalErrorAlert />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<DashboardRouter />} />
        </Route>
        
        <Route path="/unauthorized" element={<div style={{padding: '2rem'}}><h1>Unauthorized Access</h1></div>} />
        <Route path="*" element={<div style={{padding: '2rem'}}><h1>404 Not Found</h1></div>} />
      </Routes>
    </>
  );
}

export default App;
