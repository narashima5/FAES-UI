import React, { useState } from 'react';
import { Dialog, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const SubSectionDialog = ({ open, onClose, mutCreateSubSec, sections }) => {
  const [subSecForm, setSubSecForm] = useState({ section_id: '', title: '' });
  React.useEffect(() => { if (open) setSubSecForm({ section_id: '', title: '' }); }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box sx={{ p: 4 }} component="form" onSubmit={(e) => { e.preventDefault(); mutCreateSubSec.mutate(subSecForm); }}>
         <Typography variant="h6" mb={2}>Create New Sub Section</Typography>
         <FormControl fullWidth margin="normal" required>
           <InputLabel>Parent Section</InputLabel>
           <Select value={subSecForm.section_id} label="Parent Section" onChange={e => setSubSecForm({...subSecForm, section_id: e.target.value})}>
             {sections?.length === 0 ? <MenuItem disabled value="">No Sections available</MenuItem> : null}
             {sections?.map(sec => <MenuItem key={sec._id} value={sec._id}>{sec.title}</MenuItem>)}
           </Select>
         </FormControl>
         <TextField fullWidth margin="normal" label="Sub Section Title" required value={subSecForm.title} onChange={e => setSubSecForm({...subSecForm, title: e.target.value})} />
         <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
           <Button onClick={onClose}>Cancel</Button>
           <Button type="submit" variant="contained">Create</Button>
         </Box>
      </Box>
    </Dialog>
  );
};

export default SubSectionDialog;
