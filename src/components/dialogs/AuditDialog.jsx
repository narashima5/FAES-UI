import React from 'react';
import { Dialog, Box, Typography, Divider, Chip, Button } from '@mui/material';

const AuditDialog = ({ sub, onClose }) => {
   if (!sub) return null;
   return (
      <Dialog open={!!sub} onClose={onClose} maxWidth="sm" fullWidth>
         <Box sx={{ p: 3, bgcolor: '#fafafa' }}>
            <Typography variant="h6" mb={2}>Submission Audit Trail</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" color="textSecondary">Faculty Name</Typography>
            <Typography variant="body1" mb={2}>{sub.user_id?.name || 'Unknown'}</Typography>

            <Typography variant="subtitle2" color="textSecondary">Department</Typography>
            <Typography variant="body1" mb={2}>{sub.user_id?.department_id?.name || 'Unassigned'}</Typography>

            <Typography variant="subtitle2" color="textSecondary">Activity Title</Typography>
            <Typography variant="body1" mb={2}>{sub.activity_id?.title || 'Deleted Activity'}</Typography>

            <Typography variant="subtitle2" color="textSecondary">Submission Timestamp</Typography>
            <Typography variant="body1" mb={2}>{new Date(sub.createdAt).toLocaleString()}</Typography>

            <Typography variant="subtitle2" color="textSecondary">Last Updated Timestamp</Typography>
            <Typography variant="body1" mb={2}>{new Date(sub.updatedAt).toLocaleString()}</Typography>

            <Typography variant="subtitle2" color="textSecondary">Evaluation Status</Typography>
            <Typography variant="body1" mb={2}>
               <Chip size="small" label={sub.status.toUpperCase()} color={sub.status === 'approved' ? 'success' : sub.status === 'rejected' ? 'error' : 'warning'} sx={{ mr: 1 }} />
               {sub.status !== 'pending' ? `Allocated Marks: ${sub.marks || 0}` : 'Not Evaluated'}
            </Typography>

            <Typography variant="subtitle2" color="textSecondary">Evaluator Comments</Typography>
            <Typography variant="body2" mb={3} sx={{ p: 1.5, bgcolor: '#eeeeee', borderRadius: 1, whiteSpace: 'pre-wrap' }}>
               {sub.comments || 'No comments recorded.'}
            </Typography>

            {sub.proof_url && (
               <Button variant="outlined" size="small" href={sub.proof_url.startsWith('http') ? sub.proof_url : `http://localhost:5000/${sub.proof_url}`} target="_blank">
                  View Original Proof Attachment
               </Button>
            )}

            <Box mt={4} textAlign="right">
               <Button variant="contained" onClick={onClose}>Close Audit Trail</Button>
            </Box>
         </Box>
      </Dialog>
   );
};

export default AuditDialog;
