import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, deleteUser, createUser, fetchDepartments, createDepartment } from '../api/adminApi.js';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Dialog, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Tooltip, Snackbar, Alert, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, DomainAdd, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openDeptModal, setOpenDeptModal] = useState(false);
  
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'staff', department_id: '' });
  const [deptName, setDeptName] = useState('');

  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });
  const showSnack = (msg, sev='success') => setSnack({ open: true, msg, sev });

  const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: fetchDepartments });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => { 
      queryClient.invalidateQueries(['users']); 
      setOpenUserModal(false); 
      showSnack('User added successfully'); 
      setNewUser({ name: '', email: '', password: '', role: 'staff', department_id: '' });
    },
    onError: (err) => showSnack(err.message, 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => { queryClient.invalidateQueries(['users']); showSnack('User deleted'); }
  });

  const createDeptMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => { queryClient.invalidateQueries(['departments']); setOpenDeptModal(false); showSnack('Department created'); }
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    const payload = { ...newUser };
    // Clear out department allocation for global roles so they don't attach explicitly regardless of state buffer.
    if (['admin', 'management', 'iqac'].includes(payload.role)) {
       delete payload.department_id;
    }
    createMutation.mutate(payload);
  };

  const globalRoles = ['admin', 'management', 'iqac'];
  const globalUsers = users?.filter(u => globalRoles.includes(u.role)) || [];

  const isDeptView = location.pathname.includes('departments');
  const isSettingsView = location.pathname.includes('settings');

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h5">
          {isSettingsView ? 'System Settings' : isDeptView ? 'Departments Configuration' : 'User Profiles'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
           {isDeptView && <Button variant="contained" startIcon={<DomainAdd />} onClick={() => setOpenDeptModal(true)}>New Department</Button>}
           {(!isDeptView && !isSettingsView) && <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenUserModal(true)}>New User</Button>}
        </Box>
      </Box>

      {isLoading ? <Typography>Loading records...</Typography> : (
        <Box>
           {isSettingsView ? (
             <Paper sx={{ p: 6, textAlign: 'center' }}>
               <Typography color="textSecondary" variant="h6">Platform Settings Module under construction.</Typography>
             </Paper>
           ) : isDeptView ? (
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
           ) : (
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
           )}
        </Box>
      )}

      {/* User Creating Modal */}
      <Dialog open={openUserModal} onClose={() => setOpenUserModal(false)}>
        <Box sx={{ p: 4, minWidth: 400 }} component="form" onSubmit={handleCreateUser}>
          <Typography variant="h6" mb={2}>Create New User</Typography>
          <TextField fullWidth margin="normal" label="Name" required value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
          <TextField fullWidth margin="normal" label="Email" type="email" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
          <TextField fullWidth margin="normal" label="Password" type="password" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />

          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select value={newUser.role} label="Role" onChange={e => setNewUser({ ...newUser, role: e.target.value, department_id: '' })}>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="hod">HOD</MenuItem>
              <MenuItem value="iqac">IQAC Coordinator</MenuItem>
              <MenuItem value="management">Management</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          {!['admin', 'management', 'iqac'].includes(newUser.role) && (
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Department</InputLabel>
              <Select value={newUser.department_id} label="Department" onChange={e => setNewUser({ ...newUser, department_id: e.target.value })}>
                {departments?.length === 0 ? <MenuItem disabled value="">No departments available. Please create one.</MenuItem> : null}
                {departments?.map(dept => (
                  <MenuItem key={dept._id} value={dept._id}>{dept.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={() => setOpenUserModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </Box>
        </Box>
      </Dialog>

      {/* Department Modal */}
      <Dialog open={openDeptModal} onClose={() => setOpenDeptModal(false)}>
        <Box sx={{ p: 4, minWidth: 300 }} component="form" onSubmit={(e) => { e.preventDefault(); createDeptMutation.mutate(deptName); }}>
           <Typography variant="h6" mb={2}>New Department</Typography>
           <TextField fullWidth margin="normal" label="Department Name" required value={deptName} onChange={e => setDeptName(e.target.value)} />
           <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
             <Button onClick={() => setOpenDeptModal(false)}>Cancel</Button>
             <Button type="submit" variant="contained">Create</Button>
           </Box>
        </Box>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.sev} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Container>
  );
};
export default AdminDashboard;
