import React from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Divider, List, ListItem, ListItemText, Chip, Button, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchSummary } from '../api/commonApi.js';
import { fetchDepartments } from '../api/adminApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: summary, isLoading } = useQuery({ queryKey: ['dashboardSummary'], queryFn: fetchSummary });
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: fetchDepartments });

  const myDepartment = departments?.find(d => d._id === user.department_id?._id || d._id === user.department_id);
  const noticeboard = myDepartment?.noticeboard;

  if (isLoading) return <Box sx={{ display: 'flex', mt: 4 }}><CircularProgress /></Box>;

  const renderStaffHodCards = () => (
    <Grid container spacing={3} mb={4}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #1976d2' }}><CardContent><Typography color="textSecondary" gutterBottom>Platform Activities</Typography><Typography variant="h4">{summary?.totalActivities || 0}</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #2e7d32' }}><CardContent><Typography color="textSecondary" gutterBottom>Completed</Typography><Typography variant="h4">{summary?.completed || 0}</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #ed6c02' }}><CardContent><Typography color="textSecondary" gutterBottom>Pending Approval</Typography><Typography variant="h4">{summary?.pending || 0}</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #9c27b0' }}><CardContent><Typography color="textSecondary" gutterBottom>Overall Score</Typography><Typography variant="h4">{summary?.totalScore || 0}</Typography></CardContent></Card>
      </Grid>
    </Grid>
  );

  const renderAdminCards = () => (
    <Grid container spacing={3} mb={4}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #1976d2' }}><CardContent><Typography color="textSecondary" gutterBottom>Total Registered Users</Typography><Typography variant="h4">{summary?.totalUsers || 0}</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #2e7d32' }}><CardContent><Typography color="textSecondary" gutterBottom>Managed Departments</Typography><Typography variant="h4">{summary?.totalDepartments || 0}</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #ed6c02' }}><CardContent><Typography color="textSecondary" gutterBottom>Defined Sections</Typography><Typography variant="h4">{summary?.totalSections || 0}</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #9c27b0' }}><CardContent><Typography color="textSecondary" gutterBottom>Configured Activities</Typography><Typography variant="h4">{summary?.totalActivities || 0}</Typography></CardContent></Card>
      </Grid>
    </Grid>
  );

  const renderIqacCards = () => (
    <Grid container spacing={3} mb={4}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #ed6c02' }}><CardContent><Typography color="textSecondary" gutterBottom>Pending Evaluations</Typography><Typography variant="h4">{summary?.pendingReviews || 0}</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #2e7d32' }}><CardContent><Typography color="textSecondary" gutterBottom>Reviewed Documents</Typography><Typography variant="h4">{summary?.completedReviews || 0}</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #1976d2' }}><CardContent><Typography color="textSecondary" gutterBottom>Total Network Submissions</Typography><Typography variant="h4">{summary?.totalSubmissions || 0}</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #9c27b0' }}><CardContent><Typography color="textSecondary" gutterBottom>Platform Activities</Typography><Typography variant="h4">{summary?.totalActivities || 0}</Typography></CardContent></Card>
      </Grid>
    </Grid>
  );

  const renderManagementCards = () => (
    <Grid container spacing={3} mb={4}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #1976d2' }}><CardContent><Typography color="textSecondary" gutterBottom>Total Faculty Base</Typography><Typography variant="h4">{summary?.totalFaculty || 0}</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #ed6c02' }}><CardContent><Typography color="textSecondary" gutterBottom>Gross Submissions</Typography><Typography variant="h4">{summary?.totalSubmissions || 0}</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #2e7d32' }}><CardContent><Typography color="textSecondary" gutterBottom>Approved Records</Typography><Typography variant="h4">{summary?.approvedPerformances || 0}</Typography></CardContent></Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ borderLeft: '4px solid #9c27b0' }}><CardContent><Typography color="textSecondary" gutterBottom>Platform Activities</Typography><Typography variant="h4">{summary?.platformActivities || 0}</Typography></CardContent></Card>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      {(user.role === 'staff' || user.role === 'hod') && noticeboard && (
         <Alert severity="info" sx={{ mb: 4, border: '1px solid #0288d1', backgroundColor: '#e1f5fe' }}>
            <strong>Notice from HOD:</strong> {noticeboard}
         </Alert>
      )}
      
      <Typography variant="h5" mb={3} color="primary" sx={{ fontWeight: 'bold' }}>Performance Overview</Typography>

      {user.role === 'staff' || user.role === 'hod' ? renderStaffHodCards() : null}
      {user.role === 'admin' ? renderAdminCards() : null}
      {user.role === 'iqac' ? renderIqacCards() : null}
      {user.role === 'management' ? renderManagementCards() : null}

      <Typography variant="h6" mb={2}>Quick Navigation</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
         {(user.role === 'staff' || user.role === 'hod') && (
            <Button variant="contained" onClick={() => navigate('/dashboard/activities')}>Submit Activity</Button>
         )}
         {user.role === 'iqac' && (
            <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard/evaluate')}>Review Pending Responses</Button>
         )}
         {user.role === 'admin' && (
            <Button variant="contained" color="success" onClick={() => navigate('/dashboard/users')}>Manage Users</Button>
         )}
         {(user.role === 'hod') && (
            <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard/hod-reports')}>Analytics & Reports</Button>
         )}
         {(user.role === 'management') && (
            <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard/management-analytics')}>Platform Analytics</Button>
         )}
      </Box>
      
      {(user.role === 'staff' || user.role === 'hod') && summary?.recent && (
        <Box>
          <Typography variant="h6" mb={2}>Recent Activity Ledger</Typography>
          <Card>
             <CardContent>
                {summary.recent.length === 0 ? (
                   <Typography color="textSecondary">No recent activities found.</Typography>
                ) : (
                   <List>
                      {summary.recent.map((item, index) => (
                        <React.Fragment key={item._id}>
                           <ListItem>
                              <ListItemText 
                                primary={item.activity_id?.title || 'Unknown Activity'} 
                                secondary={`Submitted ${new Date(item.createdAt).toLocaleString()} by ${item.user_id?.name || 'Unknown'}`} 
                              />
                              <Chip 
                                label={item.status.toUpperCase()} 
                                size="small"
                                color={item.status === 'pending' ? 'warning' : item.status === 'approved' ? 'success' : 'error'}
                              />
                           </ListItem>
                           {index < summary.recent.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                   </List>
                )}
             </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default DashboardHome;
