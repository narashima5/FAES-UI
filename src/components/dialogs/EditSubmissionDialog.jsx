import React, { useState } from 'react';
import { Dialog, Box, Typography, TextField, Button } from '@mui/material';

const EditSubmissionDialog = ({ open, onClose, selectedSub, updateMutation }) => {
  const [description, setDescription] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [file, setFile] = useState(null);

  React.useEffect(() => {
    if (open && selectedSub) {
      setDescription(selectedSub.description || '');
      setProofUrl(selectedSub.proof_url || '');
      setFile(null);
    }
  }, [open, selectedSub]);

  if (!selectedSub) return null;

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    if (proofUrl) formData.append('proof_url', proofUrl);
    if (file) formData.append('proof', file);

    updateMutation.mutate({ id: selectedSub._id, formData });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ p: 4 }} component="form" onSubmit={handleUpdate}>
        <Typography variant="h6" mb={1}>Edit Submission</Typography>
        <Typography variant="subtitle1" component="div" color="primary" mb={3}>
          {selectedSub.activity_id?.title}
        </Typography>
        
        <TextField 
          fullWidth margin="normal" label="Description / Context" required multiline rows={3}
          value={description} onChange={e => setDescription(e.target.value)} 
        />
        
        {(selectedSub.activity_id?.proof_type === 'link' || selectedSub.activity_id?.proof_type === 'both') && (
          <TextField 
            fullWidth margin="normal" label="Proof Link URL" 
            required={selectedSub.activity_id?.proof_type === 'link'}
            value={proofUrl} onChange={e => setProofUrl(e.target.value)} 
          />
        )}

        {(selectedSub.activity_id?.proof_type === 'file' || selectedSub.activity_id?.proof_type === 'both') && (
          <Box sx={{ mt: 2, mb: 1 }}>
             <Typography variant="subtitle2" color="textSecondary" mb={1}>Upload New File (Optional - overrides existing):</Typography>
             <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </Box>
        )}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} variant="outlined">Cancel</Button>
          <Button type="submit" variant="contained" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Updating...' : 'Update Proof'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditSubmissionDialog;
