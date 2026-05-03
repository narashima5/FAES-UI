import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { fetchAllSubmissions, evaluateSubmission } from '../api/iqacApi.js';
import { Container } from '@mui/material';

import EvaluateDialog from '../components/dialogs/EvaluateDialog.jsx';
import AuditDialog from '../components/dialogs/AuditDialog.jsx';
import StaffActivitiesDialog from '../components/dialogs/StaffActivitiesDialog.jsx';
import IqacEvaluationSandbox from '../components/dashboard/IqacEvaluationSandbox.jsx';
import IqacGlobalArchive from '../components/dashboard/IqacGlobalArchive.jsx';

const IqacDashboard = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const isArchiveView = location.pathname.includes('all-submissions');

  const [openModal, setOpenModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [auditSub, setAuditSub] = useState(null);
  const [staffActivitiesOpen, setStaffActivitiesOpen] = useState(false);
  const [selectedStaffGroup, setSelectedStaffGroup] = useState(null);

  const { data: submissions, isLoading } = useQuery({ queryKey: ['allSubmissions'], queryFn: fetchAllSubmissions });

  const evalMutation = useMutation({
    mutationFn: evaluateSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries(['allSubmissions']);
      setOpenModal(false);
    }
  });

  const openEvalModal = (sub) => {
    setSelectedSub(sub);
    setOpenModal(true);
  };

  const groupedData = useMemo(() => {
    if (!submissions) return {};
    const groups = {};

    submissions.forEach(sub => {
      const deptName = sub.user_id?.department_id?.name || 'Unassigned Department';
      const facultyId = sub.user_id?._id || 'deleted';
      const facultyName = sub.user_id?.name || 'Deleted User';
      const facultyRole = sub.user_id?.role || 'Unknown';
      const facultyKey = `${facultyName} (${facultyRole.toUpperCase()})|||${facultyId}`;
      
      const secName = sub.activity_id?.section_id?.title || 'Unassigned Section';
      const subSecName = sub.activity_id?.sub_section_id?.title || 'Unassigned Sub-Section';

      if (!groups[deptName]) groups[deptName] = {};
      if (!groups[deptName][facultyKey]) groups[deptName][facultyKey] = {};
      if (!groups[deptName][facultyKey][secName]) groups[deptName][facultyKey][secName] = {};
      if (!groups[deptName][facultyKey][secName][subSecName]) groups[deptName][facultyKey][secName][subSecName] = [];

      groups[deptName][facultyKey][secName][subSecName].push(sub);
    });

    return groups;
  }, [submissions]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {isArchiveView ? (
        <>
          <IqacGlobalArchive 
            submissions={submissions}
            setSelectedStaffGroup={setSelectedStaffGroup}
            setStaffActivitiesOpen={setStaffActivitiesOpen}
          />
          <StaffActivitiesDialog 
             open={staffActivitiesOpen} 
             onClose={() => setStaffActivitiesOpen(false)} 
             staffGroup={selectedStaffGroup} 
             setAuditSub={setAuditSub} 
          />
          <AuditDialog sub={auditSub} onClose={() => setAuditSub(null)} />
        </>
      ) : (
        <>
          <IqacEvaluationSandbox 
            isLoading={isLoading}
            groupedData={groupedData}
            openEvalModal={openEvalModal}
          />
          <EvaluateDialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            selectedSub={selectedSub}
            evalMutation={evalMutation}
          />
        </>
      )}
    </Container>
  );
};

export default IqacDashboard;
