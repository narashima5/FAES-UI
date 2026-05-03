import React, { useState } from 'react';
import { Dialog, Box, Typography, Divider, Grid, Button, TextField, Alert, Chip } from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';

const EvaluateDialog = ({ open, onClose, selectedSub, evalMutation }) => {
  const [marks, setMarks] = useState('');
  const [comments, setComments] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (open && selectedSub) {
      setMarks(selectedSub.marks || '');
      setComments(selectedSub.comments || '');
      setErrorMsg('');
    }
  }, [open, selectedSub]);

  if (!selectedSub) return null;

  const handleEvaluate = (e) => {
    e.preventDefault();
    if (!selectedSub.activity_id) {
       setErrorMsg('Cannot evaluate: Mapped activity no longer exists.');
       return;
    }
    if (marks > selectedSub.activity_id?.max_marks) {
      setErrorMsg(`Marks cannot exceed the maximum allowed (${selectedSub.activity_id?.max_marks})`);
      return;
    }
    setErrorMsg('');
    evalMutation.mutate({
      submission_id: selectedSub._id,
      marks: Number(marks),
      comments,
      status: 'approved'
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleEvaluate}>
        <Box sx={{ p: 3, bgcolor: '#f4f6f8' }}>
           <Typography variant="h6">Submission Details</Typography>
        </Box>
        <Divider />
        
        <Grid container>
          <Grid item xs={12} md={6} sx={{ p: 3, borderRight: { md: '1px solid #e0e0e0' } }}>
            <Typography variant="subtitle2" color="textSecondary">Faculty Information</Typography>
            <Typography variant="body1" mb={2}>
              {selectedSub.user_id?.name || 'Deleted User'} ({selectedSub.user_id?.department_id?.name || 'N/A'})
            </Typography>

            <Typography variant="subtitle2" color="textSecondary">Activity Title</Typography>
            <Typography variant="body1" mb={2}>{selectedSub.activity_id?.title || 'Deleted Activity'}</Typography>

            <Typography variant="subtitle2" color="textSecondary">Provided Description</Typography>
            <Typography variant="body2" mb={3} sx={{ whiteSpace: 'pre-wrap', bgcolor: '#f9f9f9', p: 1, borderRadius: 1 }}>
              {selectedSub.description || 'No description provided.'}
            </Typography>

            {selectedSub.proof_url && (
              <Button 
                variant="outlined" 
                href={selectedSub.proof_url.startsWith('http') ? selectedSub.proof_url : `http://localhost:5000/${selectedSub.proof_url}`} 
                target="_blank"
                startIcon={<ViewIcon />}
              >
                View Attached Proof
              </Button>
            )}
          </Grid>

          <Grid item xs={12} md={6} sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>Evaluation Formulation</Typography>
            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
               <Typography variant="body1" sx={{ mr: 2 }}>Approval Required:</Typography>
               <Chip 
                 label="Approve Submission" 
                 color="success" 
                 sx={{ cursor: 'default' }} 
               />
            </Box>

            <TextField 
              fullWidth margin="normal" label={selectedSub.activity_id ? `Allocated Marks (Max: ${selectedSub.activity_id.max_marks})` : 'Marks Unavailable'}
              required type="number" disabled={!selectedSub.activity_id}
              inputProps={{ min: 0, max: selectedSub.activity_id?.max_marks || 0 }}
              value={marks} onChange={e => {
                setMarks(e.target.value);
                if(selectedSub.activity_id && e.target.value > selectedSub.activity_id.max_marks) setErrorMsg('Exceeds max marks!');
                else setErrorMsg('');
              }} 
            />
            
            <TextField 
              fullWidth margin="normal" label="Reviewer Comments" required multiline rows={3}
              value={comments} onChange={e => setComments(e.target.value)} 
            />
          </Grid>
        </Grid>

        <Divider />
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2, bgcolor: '#f4f6f8' }}>
          <Button onClick={onClose} variant="outlined">Close</Button>
          {selectedSub.status !== 'pending' ? (
            <Button variant="contained" color="success" disabled>
               Evaluation Completed
            </Button>
          ) : (
            <Button type="submit" variant="contained" disabled={evalMutation.isPending || !!errorMsg}>
              {evalMutation.isPending ? 'Saving...' : 'Finalize Decision'}
            </Button>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default EvaluateDialog;
