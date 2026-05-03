import React from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Alert, List, ListItem, ListItemText, Table, TableHead, TableRow, TableCell, TableBody, Chip, Snackbar } from '@mui/material';

const HodDepartmentStaffConfig = ({ 
  notice, setNotice, handleBroadcast, updateNoticeMutation, 
  delinquentStaff, leaderboard, staffMetrics, snack, setSnack 
}) => {
  return (
    <Box>
       <Typography variant="h5" mb={3} color="primary" sx={{ fontWeight: 'bold' }}>Department Staff Configuration</Typography>
       
       <Grid container spacing={4}>
         {/* Noticeboard */}
         <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
               <Typography variant="h6" color="primary" mb={2}>Department Noticeboard Broadcast</Typography>
               <TextField 
                  fullWidth multiline rows={3} 
                  value={notice} 
                  onChange={e => setNotice(e.target.value)} 
                  placeholder="Type a message to broadcast to all your staff..." 
                  sx={{ mb: 2 }} 
               />
               <Button variant="contained" onClick={handleBroadcast} disabled={updateNoticeMutation.isPending}>
                  {updateNoticeMutation.isPending ? 'Broadcasting...' : 'Broadcast Message'}
               </Button>
            </Paper>
         </Grid>

         {/* Delinquency Alert */}
         {delinquentStaff.length > 0 && (
            <Grid item xs={12}>
               <Alert severity="error" variant="filled">
                  <strong>Action Required:</strong> The following staff members have not submitted any activities for the current month: {delinquentStaff.map(s => s.name).join(', ')}
               </Alert>
            </Grid>
         )}

         {/* Leaderboard */}
         <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
               <Typography variant="h6" color="secondary" mb={2}>Top Performers (Current Month)</Typography>
               {leaderboard.length === 0 ? <Typography color="textSecondary">No data available.</Typography> : (
                  <List>
                     {leaderboard.map((s, idx) => (
                       <ListItem key={s._id} divider>
                          <ListItemText primary={`${idx + 1}. ${s.name}`} secondary={`${s.totalMarks} Marks`} />
                       </ListItem>
                     ))}
                  </List>
               )}
            </Paper>
         </Grid>

         {/* Staff Roster */}
         <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
               <Typography variant="h6" mb={2}>Full Staff Roster</Typography>
               <Table size="small">
                  <TableHead>
                     <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="center">Month Subs</TableCell>
                        <TableCell align="center">Month Marks</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {staffMetrics.map(s => (
                       <TableRow key={s._id}>
                          <TableCell>{s.name}</TableCell>
                          <TableCell>{s.email}</TableCell>
                          <TableCell align="center">
                             {s.submissionCount === 0 ? <Chip label="0" color="error" size="small" /> : s.submissionCount}
                          </TableCell>
                          <TableCell align="center">{s.totalMarks}</TableCell>
                       </TableRow>
                     ))}
                     {staffMetrics.length === 0 && <TableRow><TableCell colSpan={4} align="center">No staff found.</TableCell></TableRow>}
                  </TableBody>
               </Table>
            </Paper>
         </Grid>
       </Grid>
       
       <Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
          <Alert severity="success" variant="filled">Noticeboard updated successfully!</Alert>
       </Snackbar>
    </Box>
  );
};

export default HodDepartmentStaffConfig;
