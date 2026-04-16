import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { fetchMySubmissions, updateSubmission } from '../api/staffApi.js';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Dialog, TextField, IconButton, Tooltip, Chip } from '@mui/material';
import { Visibility as ViewIcon, Edit as EditIcon, Info as InfoIcon } from '@mui/icons-material';

const StaffDashboard = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const isScoresView = location.pathname.includes('scores');

  const [openModal, setOpenModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  
  const [description, setDescription] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [file, setFile] = useState(null);

  const { data: submissions, isLoading } = useQuery({ queryKey: ['mySubmissions'], queryFn: fetchMySubmissions });

  const updateMutation = useMutation({
    mutationFn: updateSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries(['mySubmissions']);
      setOpenModal(false);
    }
  });

  const handleEditOpen = (sub) => {
    setSelectedSub(sub);
    setDescription(sub.description || '');
    setProofUrl(sub.proof_url || '');
    setFile(null);
    setOpenModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);
    if (proofUrl) formData.append('proof_url', proofUrl);
    if (file) formData.append('proof', file);

    updateMutation.mutate({ id: selectedSub._id, formData });
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date() > new Date(deadline);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {isScoresView ? (
        <Box>
           <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Performance Scores Insights</Typography>
           <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography color="textSecondary" variant="h6">Score Analytics and Charts generation module is under construction.</Typography>
           </Paper>
        </Box>
      ) : (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>My Submissions Log</Typography>
        </Box>

      <Paper sx={{ p: 2, overflowX: 'auto' }}>
        {isLoading ? <Typography>Loading...</Typography> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activity Name</TableCell>
                <TableCell>Submission Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions?.map(sub => {
                const deadlinePassed = isDeadlinePassed(sub.activity_id?.deadline);
                return (
                  <TableRow key={sub._id}>
                    <TableCell>{sub.activity_id?.title}</TableCell>
                    <TableCell>{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                       <Chip size="small" label={sub.status.toUpperCase()} color={sub.status === 'pending' ? 'warning' : sub.status === 'approved' ? 'success' : 'error'} />
                    </TableCell>
                    <TableCell>{sub.status === 'pending' ? '-' : (sub.marks || '0')}</TableCell>
                    <TableCell align="center">
                      {sub.proof_url ? (
                        <Tooltip title="View Proof">
                          <IconButton component="a" href={sub.proof_url.startsWith('http') ? sub.proof_url : `http://localhost:5000/${sub.proof_url}`} target="_blank" color="primary">
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="No Proof Attached">
                          <IconButton disabled><ViewIcon /></IconButton>
                        </Tooltip>
                      )}
                      
                      <Tooltip title={deadlinePassed ? "Submission deadline passed" : "Edit Submission"}>
                         <span>
                           <IconButton 
                             color="secondary" 
                             onClick={() => handleEditOpen(sub)}
                             disabled={deadlinePassed || sub.status !== 'pending'}
                           >
                             <EditIcon />
                           </IconButton>
                         </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {(!submissions || submissions.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} align="center">You haven't submitted any activities yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      {selectedSub && (
        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
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
              <Button onClick={() => setOpenModal(false)} variant="outlined">Cancel</Button>
              <Button type="submit" variant="contained" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update Proof'}
              </Button>
            </Box>
          </Box>
        </Dialog>
      )}
      </Box>
      )}
    </Container>
  );
};

export default StaffDashboard;
