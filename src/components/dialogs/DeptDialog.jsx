import React, { useState } from 'react';
import { Dialog, Box, Typography, TextField, Button } from '@mui/material';

const DeptDialog = ({ open, onClose, createDeptMutation }) => {
  const [deptName, setDeptName] = useState('');

  React.useEffect(() => {
    if (open) setDeptName('');
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 4, minWidth: 300 }} component="form" onSubmit={(e) => { e.preventDefault(); createDeptMutation.mutate(deptName); }}>
         <Typography variant="h6" mb={2}>New Department</Typography>
         <TextField fullWidth margin="normal" label="Department Name" required value={deptName} onChange={e => setDeptName(e.target.value)} />
         <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
           <Button onClick={onClose}>Cancel</Button>
           <Button type="submit" variant="contained">Create</Button>
         </Box>
      </Box>
    </Dialog>
  );
};

export default DeptDialog;
