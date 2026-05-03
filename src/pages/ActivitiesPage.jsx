import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchActivities, fetchSections, fetchSubSections } from '../api/commonApi.js';
import { createSubmission, fetchMySubmissions } from '../api/staffApi.js';
import {
   Container, Typography, Box, Grid, Card, CardContent, CardActions,
   Button, Dialog, TextField, Snackbar, Alert, Divider, Accordion,
   AccordionSummary, AccordionDetails, Paper
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const ActivitiesPage = () => {
   const queryClient = useQueryClient();
   const [openModal, setOpenModal] = useState(false);
   const [selectedActivity, setSelectedActivity] = useState(null);

   const [description, setDescription] = useState('');
   const [proofUrl, setProofUrl] = useState('');
   const [file, setFile] = useState(null);

   const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });
   const showSnack = (msg, sev = 'success') => setSnack({ open: true, msg, sev });

   const [expandedOuterSection, setExpandedOuterSection] = useState(false);
   const handleOuterAccordionChange = (panel) => (event, isExpanded) => {
      setExpandedOuterSection(isExpanded ? panel : false);
   };

   const [expandedSection, setExpandedSection] = useState(false);
   const handleAccordionChange = (panel) => (event, isExpanded) => {
      setExpandedSection(isExpanded ? panel : false);
   };

   const { data: sections, isLoading: secLoad } = useQuery({ queryKey: ['sections'], queryFn: fetchSections });
   const { data: subSections, isLoading: subSecLoad } = useQuery({ queryKey: ['subSections'], queryFn: fetchSubSections });
   const { data: activities, isLoading: actLoad } = useQuery({ queryKey: ['activities'], queryFn: fetchActivities });
   const { data: mySubs, isLoading: subLoad } = useQuery({ queryKey: ['mySubmissions'], queryFn: fetchMySubmissions });

   const submitMut = useMutation({
      mutationFn: createSubmission,
      onSuccess: () => {
         setOpenModal(false);
         showSnack('Activity successfully submitted!');
         queryClient.invalidateQueries(['mySubmissions']);
      },
      onError: (err) => showSnack(err.message, 'error')
   });

   const handleOpen = (activity) => {
      setSelectedActivity(activity);
      setDescription('');
      setProofUrl('');
      setFile(null);
      setOpenModal(true);
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('activity_id', selectedActivity._id);
      formData.append('description', description);

      if (proofUrl) formData.append('proof_url', proofUrl);
      if (file) formData.append('proof', file);

      submitMut.mutate(formData);
   };

   const isLoading = secLoad || subSecLoad || actLoad || subLoad;
   const currentMonth = new Date().getMonth();
   const currentYear = new Date().getFullYear();

   return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
         <Typography variant="h4" mb={4} color="primary" sx={{ fontWeight: 'bold' }}>Activities Directory</Typography>

         {isLoading ? <Typography>Loading activities...</Typography> : (
            <Box>
               {sections?.map(sec => {
                  const secSubSections = subSections?.filter(s => s.section_id?._id === sec._id) || [];

                  return (
                     <Accordion key={sec._id} expanded={expandedOuterSection === sec._id} onChange={handleOuterAccordionChange(sec._id)} sx={{ mb: 2, border: '1px solid #1976d2', borderRadius: '4px' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#e3f2fd' }}>
                           <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>{sec.title}</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0, bgcolor: '#ffffff', pt: 2 }}>

                           {secSubSections.map(subSec => {
                              const secActivities = activities?.filter(a => a.sub_section_id?._id === subSec._id) || [];
                              return (
                                 <Accordion key={subSec._id} expanded={expandedSection === subSec._id} onChange={handleAccordionChange(subSec._id)} sx={{ mb: 1 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#f4f6f8' }}>
                                       <Typography variant="subtitle1" color="textPrimary" sx={{ fontWeight: 500 }}>{subSec.title}</Typography>
                                       <Typography variant="subtitle2" color="textSecondary" sx={{ ml: 2, mt: 0.5 }}>
                                          ({secActivities.length} Activities)
                                       </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 2, bgcolor: '#fdfdfd' }}>
                                       <Grid container spacing={3}>
                                          {secActivities.map(act => (
                                             <Grid item xs={12} sm={6} md={4} key={act._id}>
                                                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                                   <CardContent sx={{ flexGrow: 1 }}>
                                                      <Typography variant="h6" gutterBottom>{act.title}</Typography>
                                                      <Box display="flex" justifyContent="space-between" mb={1}>
                                                         <Typography color="textSecondary" variant="subtitle2">Max Marks:</Typography>
                                                         <Typography fontWeight="bold">{act.max_marks}</Typography>
                                                      </Box>
                                                      <Box display="flex" justifyContent="space-between" mb={1}>
                                                         <Typography color="textSecondary" variant="subtitle2">Proof Type:</Typography>
                                                         <Typography>{act.proof_type.toUpperCase()}</Typography>
                                                      </Box>
                                                      <Typography variant="body2" sx={{ mt: 2, color: '#555' }}>
                                                         {act.criteria || 'No specific criteria guidelines.'}
                                                      </Typography>
                                                   </CardContent>
                                                   <CardActions sx={{ p: 2, pt: 0 }}>
                                                      {mySubs?.some(sub => {
                                                         const subDate = new Date(sub.createdAt);
                                                         return sub.activity_id?._id === act._id && subDate.getMonth() === currentMonth && subDate.getFullYear() === currentYear;
                                                      }) ? (
                                                         <Button fullWidth variant="outlined" color="success" disabled>
                                                            Already Submitted
                                                         </Button>
                                                      ) : (
                                                         <Button fullWidth variant="contained" onClick={() => handleOpen(act)}>
                                                            Submit Request
                                                         </Button>
                                                      )}
                                                   </CardActions>
                                                </Card>
                                             </Grid>
                                          ))}
                                          {secActivities.length === 0 && (
                                             <Grid item xs={12}>
                                                <Typography color="textSecondary" align="center" sx={{ py: 2 }}>
                                                   No activities are available under this sub section.
                                                </Typography>
                                             </Grid>
                                          )}
                                       </Grid>
                                    </AccordionDetails>
                                 </Accordion>
                              )
                           })}
                           {secSubSections.length === 0 && (
                              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fdfdfd' }}>
                                 <Typography color="textSecondary">No Sub Sections mapped to {sec.title} yet.</Typography>
                              </Paper>
                           )}
                        </AccordionDetails>
                     </Accordion>
                  );
               })}
               {(!sections || sections.length === 0) && (
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                     <Typography color="textSecondary">No activities have been mapped globally.</Typography>
                  </Paper>
               )}
            </Box>
         )}

         {/* Submission Modal */}
         {selectedActivity && (
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
               <Box sx={{ p: 4 }} component="form" onSubmit={handleSubmit}>
                  <Typography variant="h5" mb={1} color="primary">Submit Activity Proof</Typography>
                  <Typography variant="subtitle1" mb={3} color="textSecondary">{selectedActivity.title}</Typography>

                  <TextField
                     fullWidth margin="normal" label="Description / Context" required multiline rows={3}
                     value={description} onChange={e => setDescription(e.target.value)}
                  />

                  {(selectedActivity.proof_type === 'link' || selectedActivity.proof_type === 'both') && (
                     <TextField
                        fullWidth margin="normal" label="Provide Proof Link/URL"
                        required={selectedActivity.proof_type === 'link'}
                        value={proofUrl} onChange={e => setProofUrl(e.target.value)}
                     />
                  )}

                  {(selectedActivity.proof_type === 'file' || selectedActivity.proof_type === 'both') && (
                     <Box sx={{ mt: 3, mb: 1, p: 2, border: '1px dashed #ccc', borderRadius: 1 }}>
                        <Typography variant="subtitle2" color="textSecondary" mb={1}>Select File to Upload:</Typography>
                        <input type="file" required={selectedActivity.proof_type === 'file'} onChange={(e) => setFile(e.target.files[0])} />
                     </Box>
                  )}

                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                     <Button onClick={() => setOpenModal(false)} variant="outlined">Cancel</Button>
                     <Button type="submit" variant="contained" disabled={submitMut.isPending}>
                        {submitMut.isPending ? 'Submitting...' : 'Confirm Submission'}
                     </Button>
                  </Box>
               </Box>
            </Dialog>
         )}

         <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
            <Alert severity={snack.sev} variant="filled">{snack.msg}</Alert>
         </Snackbar>
      </Container>
   );
};
export default ActivitiesPage;
