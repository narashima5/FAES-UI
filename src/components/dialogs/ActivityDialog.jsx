import React, { useState } from 'react';
import { Dialog, Box, Typography, TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';

const ActivityDialog = ({ open, onClose, initialData, sections, subSections, mutCreate, mutUpdate }) => {
  const [formData, setFormData] = useState({ id: null, section_id: '', sub_section_id: '', title: '', max_marks: '', criteria: '', proof_type: 'file' });

  React.useEffect(() => {
    if (open) {
      if (initialData) setFormData(initialData);
      else setFormData({ id: null, section_id: '', sub_section_id: '', title: '', max_marks: '', criteria: '', proof_type: 'file' });
    }
  }, [open, initialData]);

  const handleSave = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.id) mutUpdate.mutate({ id: payload.id, payload });
    else mutCreate.mutate(payload);
  };

  const currentSubSections = subSections?.filter(sub => sub.section_id?._id === formData.section_id) || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ p: 4 }} component="form" onSubmit={handleSave}>
        <Typography variant="h6" mb={2}>{formData.id ? 'Edit Activity' : 'Create Activity'}</Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
           <FormControl fullWidth margin="normal" required>
             <InputLabel>Mapped Section</InputLabel>
             <Select value={formData.section_id} label="Mapped Section" onChange={e => {
                setFormData({...formData, section_id: e.target.value, sub_section_id: ''});
             }}>
               {sections?.length === 0 ? <MenuItem disabled value="">No Sections configured globally yet</MenuItem> : null}
               {sections?.map(sec => <MenuItem key={sec._id} value={sec._id}>{sec.title}</MenuItem>)}
             </Select>
           </FormControl>

           <FormControl fullWidth margin="normal" required disabled={!formData.section_id}>
             <InputLabel>Sub Section</InputLabel>
             <Select value={formData.sub_section_id} label="Sub Section" onChange={e => setFormData({...formData, sub_section_id: e.target.value})}>
               {currentSubSections.length === 0 ? <MenuItem disabled value="">No Sub Sections mapped to this Section</MenuItem> : null}
               {currentSubSections.map(sub => <MenuItem key={sub._id} value={sub._id}>{sub.title}</MenuItem>)}
             </Select>
           </FormControl>
        </Box>

        <TextField fullWidth margin="normal" label="Activity Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
           <TextField fullWidth margin="normal" label="Max Marks" type="number" required value={formData.max_marks} onChange={e => setFormData({...formData, max_marks: e.target.value})} />
        </Box>

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Proof Type</InputLabel>
          <Select value={formData.proof_type} label="Proof Type" onChange={e => setFormData({...formData, proof_type: e.target.value})}>
            <MenuItem value="file">File Upload Only</MenuItem>
            <MenuItem value="link">URL Link Only</MenuItem>
            <MenuItem value="both">Both Output Methods</MenuItem>
          </Select>
        </FormControl>

        <TextField fullWidth margin="normal" label="Criteria Instructions" multiline rows={2} value={formData.criteria} onChange={e => setFormData({...formData, criteria: e.target.value})} />
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save Policy</Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ActivityDialog;
