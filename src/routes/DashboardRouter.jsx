import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import DashboardHome from '../pages/DashboardHome.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import StaffDashboard from '../pages/StaffDashboard.jsx';
import ManageActivities from '../pages/ManageActivities.jsx';
import IqacDashboard from '../pages/IqacDashboard.jsx';
import HodDashboard from '../pages/HodDashboard.jsx';
import ManagementDashboard from '../pages/ManagementDashboard.jsx';
import ActivitiesPage from '../pages/ActivitiesPage.jsx';

const DashboardRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* The index route renders the Summary Cards dashboard for everyone */}
        <Route index element={<DashboardHome />} />
        
        {/* Shared Activities Page [Staff, HOD] */}
        <Route element={<ProtectedRoute allowedRoles={['staff', 'hod']} />}>
           <Route path="activities" element={<ActivitiesPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
           <Route path="users" element={<AdminDashboard />} />
           <Route path="departments" element={<AdminDashboard />} />
           <Route path="manage-activities" element={<ManageActivities />} />
           <Route path="settings" element={<AdminDashboard />} />
        </Route>
        
        {/* Staff Routes */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
           <Route path="submissions" element={<StaffDashboard />} />
           <Route path="scores" element={<StaffDashboard />} />
        </Route>
        
        {/* IQAC Routes */}
        <Route element={<ProtectedRoute allowedRoles={['iqac']} />}>
           <Route path="evaluate" element={<IqacDashboard />} />
           <Route path="all-submissions" element={<IqacDashboard />} />
        </Route>

        {/* HOD Routes */}
        <Route element={<ProtectedRoute allowedRoles={['hod']} />}>
           <Route path="hod-reports" element={<HodDashboard />} />
           <Route path="department-staff" element={<HodDashboard />} />
        </Route>

        {/* Management Routes */}
        <Route element={<ProtectedRoute allowedRoles={['management']} />}>
           <Route path="management-analytics" element={<ManagementDashboard />} />
        </Route>
        
        <Route path="*" element={<h2 style={{ padding: '2rem', textAlign: 'center' }}>404 - Page Not Found</h2>} />
      </Route>
    </Routes>
  );
};

export default DashboardRouter;
