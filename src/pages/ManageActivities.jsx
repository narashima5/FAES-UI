import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createSection, createSubSection, createActivity, updateActivity, deleteActivity } from '../api/adminApi.js';
import { fetchActivities, fetchSections, fetchSubSections } from '../api/commonApi.js';
import { Container, Typography, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Dialog, TextField, Select, MenuItem, InputLabel, FormControl, IconButton, Tooltip, Snackbar, Alert, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, DomainAdd, ExpandMore as ExpandMoreIcon, AccountTree } from '@mui/icons-material';

const ManageActivities = () => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [openSecModal, setOpenSecModal] = useState(false);
  const [openSubSecModal, setOpenSubSecModal] = useState(false);
  const [secTitle, setSecTitle] = useState('');
  
  const [subSecForm, setSubSecForm] = useState({ section_id: '', title: '' });
  
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });
  const showSnack = (msg, sev='success') => setSnack({ open: true, msg, sev });

  const [expandedSection, setExpandedSection] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
     setExpandedSection(isExpanded ? panel : false);
  };

  const [formData, setFormData] = useState({ id: null, section_id: '', sub_section_id: '', title: '', max_marks: '', criteria: '', proof_type: 'file', deadline: '' });

  const { data: sections } = useQuery({ queryKey: ['sections'], queryFn: fetchSections });
  const { data: subSections } = useQuery({ queryKey: ['subSections'], queryFn: fetchSubSections });
  const { data: activities, isLoading } = useQuery({ queryKey: ['activities'], queryFn: fetchActivities });

  const mutCreateSec = useMutation({
    mutationFn: createSection,
    onSuccess: () => { queryClient.invalidateQueries(['sections']); setOpenSecModal(false); showSnack('Section Created'); },
    onError: async (error) => {
      const resp = await error.response?.json().catch(()=>({}));
      showSnack(resp?.message || error.message, 'error');
    }
  });

  const mutCreateSubSec = useMutation({
    mutationFn: createSubSection,
    onSuccess: () => { queryClient.invalidateQueries(['subSections']); setOpenSubSecModal(false); showSnack('Sub Section Created'); }
  });

  const mutCreate = useMutation({
    mutationFn: createActivity,
    onSuccess: () => { queryClient.invalidateQueries(['activities']); setOpenModal(false); showSnack('Activity Created'); }
  });

  const mutUpdate = useMutation({
    mutationFn: updateActivity,
    onSuccess: () => { queryClient.invalidateQueries(['activities']); setOpenModal(false); showSnack('Activity Updated'); }
  });

  const mutDelete = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => { queryClient.invalidateQueries(['activities']); showSnack('Activity Deleted'); }
  });

  const handleOpen = (act = null) => {
    if (act) {
      setFormData({
         id: act._id,
         section_id: act.section_id?._id || '',
         sub_section_id: act.sub_section_id?._id || '',
         title: act.title,
         max_marks: act.max_marks,
         criteria: act.criteria || '',
         proof_type: act.proof_type,
         deadline: act.deadline ? new Date(act.deadline).toISOString().slice(0, 10) : ''
      });
    } else {
      setFormData({ id: null, section_id: '', sub_section_id: '', title: '', max_marks: '', criteria: '', proof_type: 'file', deadline: '' });
    }
    setOpenModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.id) mutUpdate.mutate({ id: payload.id, payload });
    else mutCreate.mutate(payload);
  };

  const currentSubSections = subSections?.filter(sub => sub.section_id?._id === formData.section_id) || [];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h5">Activity & Section Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
           <Button variant="outlined" startIcon={<DomainAdd />} onClick={() => setOpenSecModal(true)}>New Section</Button>
           <Button variant="outlined" startIcon={<AccountTree />} onClick={() => setOpenSubSecModal(true)}>New Sub Section</Button>
           <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>New Activity</Button>
        </Box>
      </Box>

      {isLoading ? <Typography>Loading records...</Typography> : (
        <Box>
           {sections?.map(sec => {
              const secSubSections = subSections?.filter(s => s.section_id?._id === sec._id) || [];
              
              return (
                 <Box key={sec._id} sx={{ mb: 6 }}>
                    <Typography variant="h5" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>{sec.title}</Typography>
                    <Divider sx={{ mb: 3 }} />
                    
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
                             <AccordionDetails sx={{ p: 0 }}>
                                <Table>
                                   <TableHead>
                                      <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Max Marks</TableCell>
                                        <TableCell>Proof Type</TableCell>
                                        <TableCell>Deadline</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                      </TableRow>
                                   </TableHead>
                                   <TableBody>
                                      {secActivities.map(act => (
                                        <TableRow key={act._id}>
                                          <TableCell>{act.title}</TableCell>
                                          <TableCell>{act.max_marks}</TableCell>
                                          <TableCell>{act.proof_type.toUpperCase()}</TableCell>
                                          <TableCell>{act.deadline ? new Date(act.deadline).toLocaleDateString() : 'None'}</TableCell>
                                          <TableCell align="center">
                                            <Tooltip title="Edit">
                                               <IconButton color="primary" onClick={() => handleOpen(act)}><EditIcon /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                               <IconButton color="error" onClick={() => {
                                                 if(window.confirm('Do you really want to delete this activity?')) mutDelete.mutate(act._id);
                                               }}><DeleteIcon /></IconButton>
                                            </Tooltip>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                      {secActivities.length === 0 && (
                                        <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>No activities defined under this sub section yet.</TableCell></TableRow>
                                      )}
                                   </TableBody>
                                </Table>
                             </AccordionDetails>
                          </Accordion>
                       )
                    })}
                    {secSubSections.length === 0 && (
                       <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fdfdfd' }}>
                          <Typography color="textSecondary">No Sub Sections mapped to {sec.title} yet.</Typography>
                       </Paper>
                    )}
                 </Box>
              );
           })}
           {(!sections || sections.length === 0) && (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                 <Typography color="textSecondary">No sections defined. Create a section first!</Typography>
              </Paper>
           )}
        </Box>
      )}

      {/* Activity Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
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
             <TextField fullWidth margin="normal" label="Deadline Date" type="date" InputLabelProps={{ shrink: true }} value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
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
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Policy</Button>
          </Box>
        </Box>
      </Dialog>

      {/* Section Modal */}
      <Dialog open={openSecModal} onClose={() => setOpenSecModal(false)} maxWidth="xs" fullWidth>
        <Box sx={{ p: 4 }} component="form" onSubmit={(e) => { e.preventDefault(); mutCreateSec.mutate(secTitle); }}>
           <Typography variant="h6" mb={2}>Create New Section</Typography>
           <TextField fullWidth margin="normal" label="Section Title" required value={secTitle} onChange={e => setSecTitle(e.target.value)} />
           <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
             <Button onClick={() => setOpenSecModal(false)}>Cancel</Button>
             <Button type="submit" variant="contained">Create</Button>
           </Box>
        </Box>
      </Dialog>

      {/* Sub Section Modal */}
      <Dialog open={openSubSecModal} onClose={() => setOpenSubSecModal(false)} maxWidth="xs" fullWidth>
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
             <Button onClick={() => setOpenSubSecModal(false)}>Cancel</Button>
             <Button type="submit" variant="contained">Create</Button>
           </Box>
        </Box>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({...snack, open: false})}>
        <Alert severity={snack.sev} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Container>
  );
};
export default ManageActivities;
