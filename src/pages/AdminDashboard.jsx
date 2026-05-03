import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, deleteUser, createUser, fetchDepartments, createDepartment, updateSettings } from '../api/adminApi.js';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box, Button, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon, DomainAdd } from '@mui/icons-material';

import UserDialog from '../components/dialogs/UserDialog.jsx';
import DeptDialog from '../components/dialogs/DeptDialog.jsx';
import AdminSystemSettingsPanel from '../components/dashboard/AdminSystemSettingsPanel.jsx';
import AdminGlobalUsersManager from '../components/dashboard/AdminGlobalUsersManager.jsx';
import AdminDepartmentList from '../components/dashboard/AdminDepartmentList.jsx';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openDeptModal, setOpenDeptModal] = useState(false);

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

  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => { 
       queryClient.invalidateQueries(['settings']);
       showSnack('Settings updated successfully'); 
    },
    onError: (err) => showSnack(err.message, 'error')
  });

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
             <AdminSystemSettingsPanel updateSettingsMutation={updateSettingsMutation} />
           ) : isDeptView ? (
             <AdminDepartmentList departments={departments} users={users} globalRoles={globalRoles} />
           ) : (
             <AdminGlobalUsersManager 
                globalUsers={globalUsers} 
                departments={departments} 
                users={users} 
                globalRoles={globalRoles} 
                deleteMutation={deleteMutation} 
             />
           )}
        </Box>
      )}

      {/* User Creating Modal */}
      <UserDialog open={openUserModal} onClose={() => setOpenUserModal(false)} createMutation={createMutation} departments={departments} />

      {/* Department Modal */}
      <DeptDialog open={openDeptModal} onClose={() => setOpenDeptModal(false)} createDeptMutation={createDeptMutation} />

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.sev} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Container>
  );
};
export default AdminDashboard;
