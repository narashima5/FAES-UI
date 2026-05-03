import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { fetchMySubmissions, updateSubmission, setMonthlyTarget } from '../api/staffApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Container } from '@mui/material';

import EditSubmissionDialog from '../components/dialogs/EditSubmissionDialog.jsx';
import StaffScoresInsight from '../components/dashboard/StaffScoresInsight.jsx';
import StaffSubmissionsLog from '../components/dashboard/StaffSubmissionsLog.jsx';

const StaffDashboard = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const isScoresView = location.pathname.includes('scores');

  const { user, updateUser } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [targetInput, setTargetInput] = useState('');

  const { data: submissions, isLoading } = useQuery({ queryKey: ['mySubmissions'], queryFn: fetchMySubmissions });

  const updateMutation = useMutation({
    mutationFn: updateSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries(['mySubmissions']);
      setOpenModal(false);
    }
  });

  const targetMutation = useMutation({
    mutationFn: setMonthlyTarget,
    onSuccess: (data) => {
      updateUser({ monthly_target: data.user.monthly_target });
    }
  });

  const handleSetTarget = () => {
    if (targetInput && !isNaN(targetInput)) targetMutation.mutate(Number(targetInput));
  };

  const handleEditOpen = (sub) => {
    setSelectedSub(sub);
    setOpenModal(true);
  };

  const isDeadlinePassed = () => {
    return new Date().getDate() > 28;
  };

  const metrics = useMemo(() => {
     if (!submissions) return null;
     const totalMarks = submissions.filter(s => s.status === 'approved').reduce((acc, s) => acc + (s.marks || 0), 0);
     const approvedCount = submissions.filter(s => s.status === 'approved').length;
     const pendingCount = submissions.filter(s => s.status === 'pending').length;
     
     const monthlyMap = {};
     submissions.filter(s => s.status === 'approved').forEach(s => {
        const month = new Date(s.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyMap[month]) monthlyMap[month] = 0;
        monthlyMap[month] += s.marks;
     });
     const monthlyData = Object.keys(monthlyMap).map(k => ({ month: k, marks: monthlyMap[k] }));

     const currentMonthStr = new Date().toLocaleString('default', { month: 'short', year: 'numeric' });
     let prevMonthDate = new Date();
     prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
     const prevMonthStr = prevMonthDate.toLocaleString('default', { month: 'short', year: 'numeric' });

     const currentMonthMarks = monthlyMap[currentMonthStr] || 0;
     const prevMonthMarks = monthlyMap[prevMonthStr] || 0;
     const growth = prevMonthMarks === 0 ? (currentMonthMarks > 0 ? 100 : 0) : Math.round(((currentMonthMarks - prevMonthMarks) / prevMonthMarks) * 100);

     return { totalMarks, approvedCount, pendingCount, monthlyData, currentMonthMarks, prevMonthMarks, growth };
  }, [submissions]);

  const groupedSubmissions = useMemo(() => {
    if (!submissions) return {};
    return submissions.reduce((acc, sub) => {
      const m = new Date(sub.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[m]) acc[m] = [];
      acc[m].push(sub);
      return acc;
    }, {});
  }, [submissions]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {isScoresView ? (
        <StaffScoresInsight 
           user={user} metrics={metrics} targetInput={targetInput} 
           setTargetInput={setTargetInput} handleSetTarget={handleSetTarget} 
           targetMutation={targetMutation} isLoading={isLoading} 
        />
      ) : (
        <>
          <StaffSubmissionsLog 
             groupedSubmissions={groupedSubmissions} isLoading={isLoading} 
             isDeadlinePassed={isDeadlinePassed} handleEditOpen={handleEditOpen} 
          />
          <EditSubmissionDialog 
            open={openModal} 
            onClose={() => setOpenModal(false)} 
            selectedSub={selectedSub} 
            updateMutation={updateMutation} 
          />
        </>
      )}
    </Container>
  );
};

export default StaffDashboard;
