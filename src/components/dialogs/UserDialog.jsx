import React, { useState } from 'react';
import { Dialog, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const UserDialog = ({ open, onClose, createMutation, departments }) => {
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'staff', department_id: '' });

  React.useEffect(() => {
    if (open) setNewUser({ name: '', email: '', password: '', role: 'staff', department_id: '' });
  }, [open]);

  const handleCreateUser = (e) => {
    e.preventDefault();
    const payload = { ...newUser };
    if (['admin', 'management', 'iqac'].includes(payload.role)) {
       delete payload.department_id;
    }
    createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Create</Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UserDialog;
