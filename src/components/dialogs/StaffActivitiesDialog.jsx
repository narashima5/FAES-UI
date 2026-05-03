import React from 'react';
import { Dialog, Box, Typography, Divider, Table, TableHead, TableRow, TableCell, TableBody, Chip, Tooltip, IconButton, Button } from '@mui/material';
import { MenuBook as AuditIcon } from '@mui/icons-material';

const StaffActivitiesDialog = ({ open, onClose, staffGroup, setAuditSub }) => {
   if (!staffGroup) return null;
   return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
         <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
               <Typography variant="h6">Activity Log: {staffGroup.staffDetails.name}</Typography>
               <Typography variant="subtitle1" color="textSecondary">{staffGroup.staffDetails.department}</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Table size="small">
               <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                     <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                     <TableCell sx={{ fontWeight: 'bold' }}>Activity Title</TableCell>
                     <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                     <TableCell sx={{ fontWeight: 'bold' }} align="center">Marks</TableCell>
                     <TableCell sx={{ fontWeight: 'bold' }} align="center">Audit</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {staffGroup.submissions.map(sub => (
                     <TableRow key={sub._id}>
                        <TableCell>{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{sub.activity_id?.title || 'Deleted Activity'}</TableCell>
                        <TableCell>
                           <Chip size="small" label={sub.status.toUpperCase()} color={sub.status === 'approved' ? 'success' : 'warning'} />
                        </TableCell>
                        <TableCell align="center">{sub.status !== 'pending' ? sub.marks : '-'}</TableCell>
                        <TableCell align="center">
                           <Tooltip title="View Audit Trail">
                              <IconButton color="primary" onClick={() => setAuditSub(sub)}>
                                 <AuditIcon />
                              </IconButton>
                           </Tooltip>
                        </TableCell>
                     </TableRow>
                  ))}
                  {staffGroup.submissions.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={5} align="center">No submissions found.</TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
               <Button onClick={onClose} variant="outlined">Close</Button>
            </Box>
         </Box>
      </Dialog>
   );
};

export default StaffActivitiesDialog;
