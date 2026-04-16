import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchGlobalReport } from '../api/reportApi.js';
import { Container, Typography, Box, Paper, Grid, Divider } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ManagementDashboard = () => {
  const { data: globalReport, isLoading } = useQuery({ queryKey: ['globalReport'], queryFn: fetchGlobalReport });

  const { deptData, statusData } = useMemo(() => {
    if (!globalReport) return { deptData: [], statusData: [] };

    // Group by Department for aggregate marks
    const deptMap = {};
    const statusMap = { approved: 0, pending: 0, rejected: 0 };

    globalReport.forEach(sub => {
      // populate status
      if (statusMap[sub.status] !== undefined) {
         statusMap[sub.status] += 1;
      }
      
      const deptName = sub.user_id?.department_id?.name || 'Unassigned';
      if (!deptMap[deptName]) {
        deptMap[deptName] = { name: deptName, totalMarks: 0, totalActivities: 0 };
      }
      deptMap[deptName].totalActivities += 1;
      if (sub.status === 'approved' && sub.marks) {
        deptMap[deptName].totalMarks += sub.marks;
      }
    });

    return {
      deptData: Object.values(deptMap),
      statusData: [
        { name: 'Approved', value: statusMap.approved },
        { name: 'Pending', value: statusMap.pending },
        { name: 'Rejected', value: statusMap.rejected }
      ]
    };
  }, [globalReport]);

  if (isLoading) return <Typography sx={{ p: 4 }}>Loading Management Analytics...</Typography>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>Global Analytics Overview</Typography>
        <Typography variant="subtitle1" color="textSecondary">Platform-wide insights into department and faculty performance.</Typography>
      </Box>

      <Grid container spacing={4}>
         <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: 400 }}>
               <Typography variant="h6" mb={2}>Department-wise Aggregate Marks</Typography>
               <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={deptData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalMarks" name="Total Evaluated Marks" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="totalActivities" name="Total Submissions" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </Paper>
         </Grid>

         <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: 400 }}>
               <Typography variant="h6" mb={2}>Submission Status Distribution</Typography>
               <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
               </ResponsiveContainer>
            </Paper>
         </Grid>
      </Grid>
    </Container>
  );
};
export default ManagementDashboard;
