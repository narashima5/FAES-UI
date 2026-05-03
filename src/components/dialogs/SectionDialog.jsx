import React, { useState } from 'react';
import { Dialog, Box, Typography, TextField, Button } from '@mui/material';

const SectionDialog = ({ open, onClose, mutCreateSec }) => {
  const [secTitle, setSecTitle] = useState('');
  React.useEffect(() => { if (open) setSecTitle(''); }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ p: 4 }} component="form" onSubmit={(e) => { e.preventDefault(); mutCreateSec.mutate(secTitle); }}>
         <Typography variant="h6" mb={2}>Create New Section</Typography>
         <TextField fullWidth margin="normal" label="Section Title" required value={secTitle} onChange={e => setSecTitle(e.target.value)} />
         <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
           <Button onClick={onClose}>Cancel</Button>
           <Button type="submit" variant="contained">Create</Button>
         </Box>
      </Box>
    </Dialog>
  );
};

export default SectionDialog;
