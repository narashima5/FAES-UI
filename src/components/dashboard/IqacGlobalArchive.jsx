import React, { useState, useMemo, useRef } from 'react';
import { Box, Typography, Button, Paper, Grid, FormControl, InputLabel, Select, MenuItem, TextField, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';
import { PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import html2pdf from 'html2pdf.js';

const IqacGlobalArchive = ({ submissions, setSelectedStaffGroup, setStaffActivitiesOpen }) => {
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterDept, setFilterDept] = useState('all');
  const [filterSection, setFilterSection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchStaff, setSearchStaff] = useState('');
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const pdfRef = useRef();

  const { uniqueYears, uniqueDepts, uniqueSections } = useMemo(() => {
     if (!submissions) return { uniqueYears: [], uniqueDepts: [], uniqueSections: [] };
     const years = new Set(), depts = new Set(), sections = new Set();
     submissions.forEach(sub => {
        const d = new Date(sub.createdAt);
        years.add(d.getFullYear());
        depts.add(sub.user_id?.department_id?.name || 'Unassigned');
        if (sub.activity_id?.section_id?.title) sections.add(sub.activity_id.section_id.title);
     });
     return { 
        uniqueYears: Array.from(years).sort((a,b)=>b-a), 
        uniqueDepts: Array.from(depts).sort(), 
        uniqueSections: Array.from(sections).sort() 
     };
  }, [submissions]);

  const filteredArchive = useMemo(() => {
     if (!submissions) return [];
     return submissions.filter(sub => {
        const d = new Date(sub.createdAt);
        if (filterMonth !== 'all' && d.getMonth() !== Number(filterMonth)) return false;
        if (filterYear !== 'all' && d.getFullYear() !== Number(filterYear)) return false;
        if (filterStatus !== 'all' && sub.status !== filterStatus) return false;
        const dept = sub.user_id?.department_id?.name || 'Unassigned';
        if (filterDept !== 'all' && dept !== filterDept) return false;
        const sec = sub.activity_id?.section_id?.title || 'Unknown';
        if (filterSection !== 'all' && sec !== filterSection) return false;
        if (searchStaff && !(sub.user_id?.name || '').toLowerCase().includes(searchStaff.toLowerCase())) return false;
        return true;
     }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [submissions, filterMonth, filterYear, filterDept, filterSection, filterStatus, searchStaff]);

  const groupedStaffArchive = useMemo(() => {
     if (!filteredArchive) return [];
     const groups = {};
     filteredArchive.forEach(sub => {
        const staffId = sub.user_id?._id || 'unknown';
        if (!groups[staffId]) {
           groups[staffId] = {
              staffDetails: {
                 name: sub.user_id?.name || 'Unknown',
                 department: sub.user_id?.department_id?.name || 'Unassigned',
                 _id: staffId
              },
              latestDate: new Date(0),
              submissions: []
           };
        }
        groups[staffId].submissions.push(sub);
        const subDate = new Date(sub.createdAt);
        if (subDate > groups[staffId].latestDate) {
           groups[staffId].latestDate = subDate;
        }
     });
     return Object.values(groups).sort((a, b) => b.latestDate - a.latestDate);
  }, [filteredArchive]);

  const pagedStaffArchive = groupedStaffArchive.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const exportPDF = () => {
     const element = pdfRef.current;
     const opt = {
       margin:       0.5,
       filename:     `IQAC_Global_Archive_${new Date().toISOString().slice(0,10)}.pdf`,
       image:        { type: 'jpeg', quality: 0.98 },
       html2canvas:  { scale: 2 },
       jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
     };
     element.style.display = 'block';
     html2pdf().set(opt).from(element).save().then(() => {
        element.style.display = 'none';
     });
  };

  return (
    <Box>
       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>Global Submissions Archive</Typography>
          <Button variant="contained" color="secondary" startIcon={<PictureAsPdfIcon />} onClick={exportPDF} disabled={groupedStaffArchive.length === 0}>
             Export View to PDF
          </Button>
       </Box>

       <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
             <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                   <InputLabel>Month</InputLabel>
                   <Select value={filterMonth} label="Month" onChange={e => {setFilterMonth(e.target.value); setPage(0);}}>
                      <MenuItem value="all">All Months</MenuItem>
                      {Array.from({length: 12}).map((_, i) => (
                         <MenuItem key={i} value={i}>{new Date(0, i).toLocaleString('en', { month: 'short' })}</MenuItem>
                      ))}
                   </Select>
                </FormControl>
             </Grid>
             <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                   <InputLabel>Year</InputLabel>
                   <Select value={filterYear} label="Year" onChange={e => {setFilterYear(e.target.value); setPage(0);}}>
                      <MenuItem value="all">All Years</MenuItem>
                      {uniqueYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                   </Select>
                </FormControl>
             </Grid>
             <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                   <InputLabel>Department</InputLabel>
                   <Select value={filterDept} label="Department" onChange={e => {setFilterDept(e.target.value); setPage(0);}}>
                      <MenuItem value="all">All Departments</MenuItem>
                      {uniqueDepts.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                   </Select>
                </FormControl>
             </Grid>
             <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                   <InputLabel>Section</InputLabel>
                   <Select value={filterSection} label="Section" onChange={e => {setFilterSection(e.target.value); setPage(0);}}>
                      <MenuItem value="all">All Sections</MenuItem>
                      {uniqueSections.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                   </Select>
                </FormControl>
             </Grid>
             <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                   <InputLabel>Status</InputLabel>
                   <Select value={filterStatus} label="Status" onChange={e => {setFilterStatus(e.target.value); setPage(0);}}>
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                   </Select>
                </FormControl>
             </Grid>
             <Grid item xs={12} sm={6} md={2}>
                <TextField 
                   fullWidth size="small" label="Search Staff Name" 
                   value={searchStaff} onChange={e => {setSearchStaff(e.target.value); setPage(0);}} 
                />
             </Grid>
          </Grid>
       </Paper>

       <Paper sx={{ overflowX: 'auto', mb: 2 }}>
           <Table>
             <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                   <TableCell sx={{ fontWeight: 'bold' }}>Staff Name</TableCell>
                   <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                   <TableCell sx={{ fontWeight: 'bold' }} align="center">Total Submissions</TableCell>
                   <TableCell sx={{ fontWeight: 'bold' }} align="center">Latest Activity</TableCell>
                   <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                </TableRow>
             </TableHead>
             <TableBody>
                {pagedStaffArchive.map(group => (
                   <TableRow key={group.staffDetails._id} hover onClick={() => { setSelectedStaffGroup(group); setStaffActivitiesOpen(true); }} sx={{ cursor: 'pointer' }}>
                      <TableCell>{group.staffDetails.name}</TableCell>
                      <TableCell>{group.staffDetails.department}</TableCell>
                      <TableCell align="center">{group.submissions.length}</TableCell>
                      <TableCell align="center">{group.latestDate.toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                         <Button size="small" variant="outlined">View Log</Button>
                      </TableCell>
                   </TableRow>
                ))}
                {pagedStaffArchive.length === 0 && (
                   <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>No staff match the current filters.</TableCell>
                   </TableRow>
                )}
             </TableBody>
          </Table>
          <TablePagination
             component="div"
             count={groupedStaffArchive.length}
             page={page}
             onPageChange={(e, newPage) => setPage(newPage)}
             rowsPerPage={rowsPerPage}
             onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
       </Paper>

       {/* Hidden PDF Layout */}
       <div style={{ display: 'none' }}>
          <Box ref={pdfRef} sx={{ p: 4, bgcolor: 'white', color: 'black' }}>
             <Typography variant="h4" mb={1} align="center" fontWeight="bold">Global Archive Submissions Export</Typography>
             <Typography variant="subtitle1" mb={4} align="center" color="textSecondary">Generated on {new Date().toLocaleString()}</Typography>
             <Table size="small">
                <TableHead sx={{ bgcolor: '#eceff1' }}>
                   <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Staff Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="center">Total Submissions</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="center">Latest Activity</TableCell>
                   </TableRow>
                </TableHead>
                <TableBody>
                   {groupedStaffArchive.map(group => (
                      <TableRow key={group.staffDetails._id}>
                         <TableCell>{group.staffDetails.name}</TableCell>
                         <TableCell>{group.staffDetails.department}</TableCell>
                         <TableCell align="center">{group.submissions.length}</TableCell>
                         <TableCell align="center">{group.latestDate.toLocaleDateString()}</TableCell>
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
          </Box>
       </div>
    </Box>
  );
};

export default IqacGlobalArchive;
