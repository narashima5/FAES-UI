import React from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const AdminDepartmentList = ({ departments, users, globalRoles }) => {
  return (
     <Box>
       <Typography variant="h6" color="primary" sx={{ mb: 2 }}>Registered Departments</Typography>
       {departments?.map(dept => {
          const deptUsers = users?.filter(u => u.department_id?._id === dept._id && !globalRoles.includes(u.role)) || [];
          return (
             <Accordion key={dept._id} defaultExpanded sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#f4f6f8' }}>
                   <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>{dept.name}</Typography>
                   <Typography variant="subtitle2" color="textSecondary" sx={{ ml: 2, mt: 0.5 }}>
                      ({deptUsers.length} Mapped Members)
                   </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Table size="small">
                     <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell></TableRow></TableHead>
                     <TableBody>
                        {deptUsers.map(user => (
                           <TableRow key={user._id}><TableCell>{user.name}</TableCell><TableCell>{user.email}</TableCell><TableCell>{user.role.toUpperCase()}</TableCell></TableRow>
                        ))}
                     </TableBody>
                  </Table>
                </AccordionDetails>
             </Accordion>
          );
       })}
     </Box>
  );
};

export default AdminDepartmentList;
