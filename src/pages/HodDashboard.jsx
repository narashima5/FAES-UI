import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { fetchDepartmentReport } from '../api/reportApi.js';
import StaffDashboard from './StaffDashboard.jsx';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Divider, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';

const HodDashboard = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const isStaffView = location.pathname.includes('department-staff');

  const [view, setView] = useState('report'); 
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterStaff, setFilterStaff] = useState('all');

  const { data: report, isLoading } = useQuery({ queryKey: ['deptReport'], queryFn: fetchDepartmentReport, enabled: view === 'report' });

  const uniqueStaff = Array.from(new Set(report?.map(r => JSON.stringify({ id: r.user_id?._id, name: r.user_id?.name }))))
    .map(str => JSON.parse(str))
    .filter(s => s.id);

  const filteredReport = report?.filter(sub => {
    const d = new Date(sub.createdAt);
    const mMatch = filterMonth === 'all' || d.getMonth() === Number(filterMonth);
    const sMatch = filterStaff === 'all' || sub.user_id?._id === filterStaff;
    return mMatch && sMatch;
  });

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
        {isStaffView ? (
           <Box>
              <Typography variant="h5" mb={3} color="primary" sx={{ fontWeight: 'bold' }}>Department Staff Configuration</Typography>
              <Paper sx={{ p: 6, textAlign: 'center' }}>
                 <Typography color="textSecondary" variant="h6">Staff Management Tools under construction.</Typography>
              </Paper>
           </Box>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
               <Button variant={view === 'staff' ? 'contained' : 'outlined'} onClick={() => setView('staff')}>My Personal Submissions</Button>
               <Button variant={view === 'report' ? 'contained' : 'outlined'} onClick={() => setView('report')}>Department Report Generator</Button>
            </Box>

        {view === 'staff' ? (
           <Box mt={2}>
              <StaffDashboard />
           </Box>
        ) : (
           <Box>
              <Typography variant="h5" mb={3}>Monthly Report Generator</Typography>
              
              <Paper sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={4}>
                   <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                         <InputLabel>Filter By Month</InputLabel>
                         <Select value={filterMonth} label="Filter By Month" onChange={e => setFilterMonth(e.target.value)}>
                            <MenuItem value="all">All Months</MenuItem>
                            {Array.from({length: 12}).map((_, i) => (
                               <MenuItem key={i} value={i}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</MenuItem>
                            ))}
                         </Select>
                      </FormControl>
                   </Grid>
                   <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                         <InputLabel>Filter By Staff</InputLabel>
                         <Select value={filterStaff} label="Filter By Staff" onChange={e => setFilterStaff(e.target.value)}>
                            <MenuItem value="all">All Staff Members</MenuItem>
                            {uniqueStaff.map(s => (
                               <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                            ))}
                         </Select>
                      </FormControl>
                   </Grid>
                </Grid>
              </Paper>

              <Paper sx={{ p: 2, overflowX: 'auto' }}>
                {isLoading ? <Typography>Loading...</Typography> : (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Staff Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Activity Title</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Section</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Marks</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Submitted At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredReport?.length > 0 ? filteredReport.map(sub => (
                        <TableRow key={sub._id}>
                          <TableCell>{sub.user_id?.name}</TableCell>
                          <TableCell>{sub.activity_id?.title}</TableCell>
                          <TableCell>{sub.activity_id?.section_id?.title || 'Main'}</TableCell>
                          <TableCell>{sub.status === 'approved' ? (sub.marks || 0) : 'Pending'}</TableCell>
                          <TableCell>{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                           <TableCell colSpan={5} align="center">No records match the active filters.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </Paper>
           </Box>
        )}
        </Box>
        )}
      </Container>
    </>
  );
};
export default HodDashboard;
