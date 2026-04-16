import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { fetchAllSubmissions, evaluateSubmission } from '../api/iqacApi.js';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Dialog, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Tooltip, Chip, Divider, Grid, Alert } from '@mui/material';
import { Visibility as ViewIcon, AssignmentTurnedIn as EvaluateIcon } from '@mui/icons-material';

const IqacDashboard = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const isArchiveView = location.pathname.includes('all-submissions');

  const [openModal, setOpenModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  
  const [marks, setMarks] = useState('');
  const [comments, setComments] = useState('');
  const [status, setStatus] = useState('approved');
  const [errorMsg, setErrorMsg] = useState('');

  const { data: submissions, isLoading } = useQuery({ queryKey: ['allSubmissions'], queryFn: fetchAllSubmissions });

  const evalMutation = useMutation({
    mutationFn: evaluateSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries(['allSubmissions']);
      setOpenModal(false);
    }
  });

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
      status
    });
  };

  const openEvalModal = (sub) => {
    setSelectedSub(sub);
    setMarks(sub.marks || '');
    setComments(sub.comments || '');
    setStatus(sub.status !== 'pending' ? sub.status : 'approved');
    setErrorMsg('');
    setOpenModal(true);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {isArchiveView ? (
        <Box>
           <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Global Submissions Archive</Typography>
           <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography color="textSecondary" variant="h6">Archive Data Export Module under construction.</Typography>
           </Paper>
        </Box>
      ) : (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>Evaluation Sandbox</Typography>
        </Box>

      <Paper sx={{ p: 2, overflowX: 'auto' }}>
        {isLoading ? <Typography>Loading...</Typography> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Faculty</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Activity Title</TableCell>
                <TableCell>Max Marks</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions?.map(sub => (
                <TableRow key={sub._id}>
                  <TableCell>{sub.user_id?.name || 'Deleted User'}</TableCell>
                  <TableCell>{sub.user_id?.department_id?.name || 'N/A'}</TableCell>
                  <TableCell>{sub.activity_id?.title || 'Deleted Activity'}</TableCell>
                  <TableCell>{sub.activity_id?.max_marks || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip 
                      size="small" 
                      label={sub.status.toUpperCase()} 
                      color={sub.status === 'pending' ? 'warning' : sub.status === 'approved' ? 'success' : 'error'} 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Detailed Submission">
                       <IconButton color="primary" onClick={() => openEvalModal(sub)}>
                          <EvaluateIcon />
                       </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {(!submissions || submissions.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No submissions pending.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {selectedSub && (
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
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
                   <Typography variant="body1" sx={{ mr: 2 }}>Select outcome:</Typography>
                   <Chip 
                     label="Approve" 
                     color={status === 'approved' ? 'success' : 'default'} 
                     onClick={() => { if(selectedSub.activity_id) setStatus('approved') }} 
                     sx={{ mr: 1, cursor: 'pointer' }} 
                   />
                   <Chip 
                     label="Reject" 
                     color={status === 'rejected' ? 'error' : 'default'} 
                     onClick={() => setStatus('rejected')} 
                     sx={{ cursor: 'pointer' }} 
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
              <Button onClick={() => setOpenModal(false)} variant="outlined">Close</Button>
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
      )}
      </Box>
      )}
    </Container>
  );
};

export default IqacDashboard;
