import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, LinearProgress, TextField, Button, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const StaffScoresInsight = ({ user, metrics, targetInput, setTargetInput, handleSetTarget, targetMutation, isLoading }) => {
  return (
    <Box>
       <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 4 }}>Performance Scores Insights</Typography>
       
       {isLoading ? <Typography>Loading metrics...</Typography> : (
          <Grid container spacing={4}>
             <Grid item xs={12}>
                <Paper sx={{ p: 3, borderLeft: '4px solid #9c27b0' }}>
                   <Typography variant="h6" mb={1}>Monthly Performance Goal</Typography>
                   <Typography variant="body2" color="textSecondary" mb={2}>Choose a target number of approved marks to aim for each month. Once set, this goal is locked.</Typography>
                   
                   <Box sx={{ display: 'flex', gap: 2, mb: user.monthly_target ? 3 : 0 }}>
                      <TextField size="small" label="Target Marks" type="number" 
                         value={user.monthly_target || targetInput} 
                         onChange={e => setTargetInput(e.target.value)} 
                         disabled={!!user.monthly_target} 
                      />
                      <Button variant="contained" onClick={handleSetTarget} disabled={!!user.monthly_target || targetMutation.isPending}>
                         {user.monthly_target ? 'Target Locked' : 'Lock Target'}
                      </Button>
                   </Box>

                   {user.monthly_target && (
                     <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                           <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress variant="determinate" value={Math.min(((metrics?.currentMonthMarks || 0) / user.monthly_target) * 100, 100)} sx={{ height: 10, borderRadius: 5 }} />
                           </Box>
                           <Box sx={{ minWidth: 35 }}>
                              <Typography variant="body2" color="textSecondary">{Math.round(((metrics?.currentMonthMarks || 0) / user.monthly_target) * 100)}%</Typography>
                           </Box>
                        </Box>
                        <Typography variant="body2" color="textSecondary">You have earned {metrics?.currentMonthMarks || 0} out of {user.monthly_target} marks for the current month.</Typography>
                     </Box>
                   )}
                </Paper>
             </Grid>

             <Grid item xs={12}>
               <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
                 <Typography variant="h6" mb={2}>Comparative Analytics (Self-Comparison)</Typography>
                 <Typography variant="body1">
                    Current Month Marks: <strong>{metrics?.currentMonthMarks || 0}</strong> <br/>
                    Previous Month Marks: <strong>{metrics?.prevMonthMarks || 0}</strong>
                 </Typography>
                 <Box mt={2}>
                    {metrics?.growth > 0 ? (
                       <Chip label={`↑ ${metrics.growth}% increase from last month!`} color="success" />
                    ) : metrics?.growth < 0 ? (
                       <Chip label={`↓ ${Math.abs(metrics.growth)}% decrease from last month.`} color="error" />
                    ) : (
                       <Chip label="No change from last month." color="default" />
                    )}
                 </Box>
               </Paper>
             </Grid>

             <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center', height: '100%', borderTop: '4px solid #1976d2' }}>
                   <Typography color="textSecondary" gutterBottom>Total Approved Marks</Typography>
                   <Typography variant="h3" color="primary">{metrics?.totalMarks || 0}</Typography>
                </Paper>
             </Grid>
             <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center', height: '100%', borderTop: '4px solid #2e7d32' }}>
                   <Typography color="textSecondary" gutterBottom>Approved Activities</Typography>
                   <Typography variant="h3" color="success.main">{metrics?.approvedCount || 0}</Typography>
                </Paper>
             </Grid>
             <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, textAlign: 'center', height: '100%', borderTop: '4px solid #ed6c02' }}>
                   <Typography color="textSecondary" gutterBottom>Pending Approvals</Typography>
                   <Typography variant="h3" color="warning.main">{metrics?.pendingCount || 0}</Typography>
                </Paper>
             </Grid>

             <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                   <Typography variant="h6" mb={3}>Monthly Score Progression</Typography>
                   {metrics?.monthlyData?.length > 0 ? (
                      <Box sx={{ width: '100%', height: 300 }}>
                         <ResponsiveContainer>
                            <BarChart data={metrics.monthlyData}>
                               <CartesianGrid strokeDasharray="3 3" />
                               <XAxis dataKey="month" />
                               <YAxis />
                               <RechartsTooltip />
                               <Legend />
                               <Bar dataKey="marks" fill="#1976d2" name="Approved Marks" />
                            </BarChart>
                         </ResponsiveContainer>
                      </Box>
                   ) : (
                      <Typography color="textSecondary" align="center" sx={{ py: 4 }}>Not enough approved data to chart.</Typography>
                   )}
                </Paper>
             </Grid>
          </Grid>
       )}
    </Box>
  );
};

export default StaffScoresInsight;
