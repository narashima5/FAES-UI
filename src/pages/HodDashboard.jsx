import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { fetchDepartmentReport } from '../api/reportApi.js';
import { fetchDepartmentStaff, updateNoticeboard } from '../api/hodApi.js';
import { fetchDepartments } from '../api/adminApi.js';
import { Container, Box, Button } from '@mui/material';

import StaffDashboard from './StaffDashboard.jsx';
import HodDepartmentStaffConfig from '../components/dashboard/HodDepartmentStaffConfig.jsx';
import HodReportGenerator from '../components/dashboard/HodReportGenerator.jsx';

const HodDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isStaffView = location.pathname.includes('department-staff');

  const [view, setView] = useState('report'); 
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterStaff, setFilterStaff] = useState('all');
  const [notice, setNotice] = useState('');
  const [snack, setSnack] = useState(false);

  const { data: report, isLoading } = useQuery({ queryKey: ['deptReport'], queryFn: fetchDepartmentReport });
  const { data: departmentStaff } = useQuery({ queryKey: ['deptStaff'], queryFn: fetchDepartmentStaff, enabled: isStaffView });
  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: fetchDepartments, enabled: isStaffView });

  const myDepartment = useMemo(() => {
     if (!departments) return null;
     return departments.find(d => d._id === user.department_id?._id || d._id === user.department_id);
  }, [departments, user.department_id]);

  useEffect(() => {
    if (myDepartment?.noticeboard) setNotice(myDepartment.noticeboard);
  }, [myDepartment]);

  const updateNoticeMutation = useMutation({
    mutationFn: updateNoticeboard,
    onSuccess: () => { setSnack(true); }
  });

  const handleBroadcast = () => {
    updateNoticeMutation.mutate(notice);
  };

  const currentMonth = new Date().getMonth();
  const currentMonthReport = report?.filter(sub => new Date(sub.createdAt).getMonth() === currentMonth) || [];

  const staffMetrics = useMemo(() => {
    if (!departmentStaff) return [];
    return departmentStaff.map(staff => {
       const userSubs = currentMonthReport.filter(sub => sub.user_id?._id === staff._id);
       const approvedSubs = userSubs.filter(sub => sub.status === 'approved' && sub.marks);
       const totalMarks = approvedSubs.reduce((acc, sub) => acc + sub.marks, 0);
       return { ...staff, submissionCount: userSubs.length, totalMarks };
    }).sort((a, b) => b.totalMarks - a.totalMarks);
  }, [departmentStaff, currentMonthReport]);

  const delinquentStaff = staffMetrics.filter(s => s.submissionCount === 0);
  const leaderboard = staffMetrics.slice(0, 5);

  const uniqueStaff = Array.from(new Set(report?.map(r => JSON.stringify({ id: r.user_id?._id, name: r.user_id?.name }))))
    .map(str => JSON.parse(str))
    .filter(s => s.id);

  const filteredReport = report?.filter(sub => {
    const d = new Date(sub.createdAt);
    const mMatch = filterMonth === 'all' || d.getMonth() === Number(filterMonth);
    const sMatch = filterStaff === 'all' || sub.user_id?._id === filterStaff;
    return mMatch && sMatch;
  });

  const groupedReport = useMemo(() => {
     if (!filteredReport) return [];
     const map = {};
     filteredReport.forEach(r => {
        const uid = r.user_id?._id;
        if (!uid) return;
        if (!map[uid]) {
           map[uid] = {
              id: uid,
              user_id: r.user_id,
              name: r.user_id.name,
              totalActivities: 0,
              totalMarks: 0
           };
        }
        map[uid].totalActivities += 1;
        if (r.status === 'approved' && r.marks) {
           map[uid].totalMarks += r.marks;
        }
     });
     return Object.values(map);
  }, [filteredReport]);

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
      {isStaffView ? (
         <HodDepartmentStaffConfig 
            notice={notice} setNotice={setNotice} handleBroadcast={handleBroadcast} 
            updateNoticeMutation={updateNoticeMutation} delinquentStaff={delinquentStaff} 
            leaderboard={leaderboard} staffMetrics={staffMetrics} snack={snack} setSnack={setSnack}
         />
      ) : (
        <Box>
          <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
             <Button variant={view === 'staff' ? 'contained' : 'outlined'} onClick={() => setView('staff')}>My Personal Submissions</Button>
             <Button variant={view === 'report' ? 'contained' : 'outlined'} onClick={() => setView('report')}>Department Report Generator</Button>
          </Box>

          {view === 'staff' ? (
             <Box mt={2}>
                <StaffDashboard />
             </Box>
          ) : (
             <HodReportGenerator 
                filterMonth={filterMonth} setFilterMonth={setFilterMonth} 
                filterStaff={filterStaff} setFilterStaff={setFilterStaff} 
                uniqueStaff={uniqueStaff} isLoading={isLoading} groupedReport={groupedReport} 
             />
          )}
        </Box>
      )}
    </Container>
  );
};

export default HodDashboard;
