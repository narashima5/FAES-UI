import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createSection, createSubSection, createActivity, updateActivity, deleteActivity } from '../api/adminApi.js';
import { fetchActivities, fetchSections, fetchSubSections } from '../api/commonApi.js';
import { Container, Typography, Box, Button, Snackbar, Alert } from '@mui/material';
import { Add as AddIcon, DomainAdd, AccountTree } from '@mui/icons-material';

import ActivityDialog from '../components/dialogs/ActivityDialog.jsx';
import SectionDialog from '../components/dialogs/SectionDialog.jsx';
import SubSectionDialog from '../components/dialogs/SubSectionDialog.jsx';
import ActivityManagerTable from '../components/dashboard/ActivityManagerTable.jsx';

const ManageActivities = () => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [openSecModal, setOpenSecModal] = useState(false);
  const [openSubSecModal, setOpenSubSecModal] = useState(false);
  
  const [snack, setSnack] = useState({ open: false, msg: '', sev: 'success' });
  const showSnack = (msg, sev='success') => setSnack({ open: true, msg, sev });

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

  const [initialActData, setInitialActData] = useState(null);

  const handleOpen = (act = null) => {
    if (act) {
      setInitialActData({
         id: act._id,
         section_id: act.section_id?._id || '',
         sub_section_id: act.sub_section_id?._id || '',
         title: act.title,
         max_marks: act.max_marks,
         criteria: act.criteria || '',
         proof_type: act.proof_type
      });
    } else {
      setInitialActData(null);
    }
    setOpenModal(true);
  };

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
        <ActivityManagerTable 
           sections={sections} subSections={subSections} activities={activities} 
           handleOpen={handleOpen} mutDelete={mutDelete} 
        />
      )}

      <ActivityDialog open={openModal} onClose={() => setOpenModal(false)} initialData={initialActData} sections={sections} subSections={subSections} mutCreate={mutCreate} mutUpdate={mutUpdate} />
      <SectionDialog open={openSecModal} onClose={() => setOpenSecModal(false)} mutCreateSec={mutCreateSec} />
      <SubSectionDialog open={openSubSecModal} onClose={() => setOpenSubSecModal(false)} mutCreateSubSec={mutCreateSubSec} sections={sections} />

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({...snack, open: false})}>
        <Alert severity={snack.sev} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Container>
  );
};
export default ManageActivities;
