import React from 'react';
import { Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const AdminGlobalUsersManager = ({ globalUsers, departments, users, globalRoles, deleteMutation }) => {
  return (
    <Box>
       <Typography variant="h6" color="primary" sx={{ mb: 2 }}>Global Platform Accounts</Typography>
       <Paper sx={{ p: 2, mb: 4, overflowX: 'auto' }}>
         <Table>
           <TableHead>
             <TableRow>
               <TableCell>Name</TableCell>
               <TableCell>Email</TableCell>
               <TableCell>Role</TableCell>
               <TableCell align="center">Actions</TableCell>
             </TableRow>
           </TableHead>
           <TableBody>
             {globalUsers.map(user => (
               <TableRow key={user._id}>
                 <TableCell>{user.name}</TableCell>
                 <TableCell>{user.email}</TableCell>
                 <TableCell>{user.role.toUpperCase()}</TableCell>
                 {user.role !== 'admin' ? (
                   <TableCell align="center">
                     <Tooltip title="Delete User">
                       <IconButton color="error" onClick={() => {
                         if (window.confirm('Are you sure you want to delete this user?')) deleteMutation.mutate(user._id);
                       }}>
                         <DeleteIcon />
                       </IconButton>
                     </Tooltip>
                   </TableCell>
                 ) : <TableCell align="center">-</TableCell>}
               </TableRow>
             ))}
             {globalUsers.length === 0 && <TableRow><TableCell colSpan={4} align="center">No global users found.</TableCell></TableRow>}
           </TableBody>
         </Table>
       </Paper>
       
       <Typography variant="h6" color="primary" sx={{ mt: 4, mb: 2 }}>Department Staff Accounts</Typography>
       {departments?.map(dept => {
          const deptUsers = users?.filter(u => u.department_id?._id === dept._id && !globalRoles.includes(u.role)) || [];
          return (
             <Accordion key={dept._id} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#ffffff' }}>
                   <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{dept.name}</Typography>
                   <Typography variant="subtitle2" color="textSecondary" sx={{ ml: 2, mt: 0.5 }}>
                      ({deptUsers.length} Users)
                   </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {deptUsers.length === 0 ? (
                     <Typography color="textSecondary" sx={{ p: 2 }}>No users in this department.</Typography>
                  ) : (
                  <Table size="small">
                     <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell align="center">Actions</TableCell></TableRow></TableHead>
                     <TableBody>
                        {deptUsers.map(user => (
                           <TableRow key={user._id}>
                             <TableCell>{user.name}</TableCell>
                             <TableCell>{user.email}</TableCell>
                             <TableCell>{user.role.toUpperCase()}</TableCell>
                             <TableCell align="center">
                               <Tooltip title="Delete User">
                                 <IconButton color="error" onClick={() => {
                                   if (window.confirm('Are you sure you want to delete this user?')) deleteMutation.mutate(user._id);
                                 }}><DeleteIcon /></IconButton>
                               </Tooltip>
                             </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
                  )}
                </AccordionDetails>
             </Accordion>
          );
       })}
       {(!departments || departments.length === 0) && (
          <Typography color="textSecondary">No Departments configured globally.</Typography>
       )}
    </Box>
  );
};

export default AdminGlobalUsersManager;
