import React, { useState, useRef } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Dialog, IconButton, Tooltip, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FacultyReportCard from './FacultyReportCard.jsx';
import DepartmentSummaryReportCard from './DepartmentSummaryReportCard.jsx';
import html2pdf from 'html2pdf.js';
import { fetchMonthlyFacultyReport } from '../api/reportApi.js';

const ReportGenerator = ({ data, columns, title = 'Generated Report', groupBy = null }) => {
  const [openPdf, setOpenPdf] = useState(false);
  const [openSummaryPdf, setOpenSummaryPdf] = useState(false);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [fetchedUserReport, setFetchedUserReport] = useState(null);
  
  const [expandedGroup, setExpandedGroup] = useState(false);
  
  const reportRef = useRef();
  const summaryReportRef = useRef();

  const handleGroupChange = (panel) => (event, isExpanded) => {
     setExpandedGroup(isExpanded ? panel : false);
  };

  const handleOpenPdf = async (row) => {
     const userId = row.user_id?._id || row.id; 
     if (!userId) return;

     setLoadingUserId(userId);
     try {
       const reports = await fetchMonthlyFacultyReport();
       const userReport = reports.find(r => r.user?._id === userId);
       
       if (userReport) {
          setFetchedUserReport(userReport);
          setOpenPdf(true);
       } else {
          alert('Could not find compiled monthly report for this user.');
       }
     } catch (err) {
        console.error('Failed to compile report via backend API', err);
        alert('API Error fetching detailed report');
     } finally {
        setLoadingUserId(null);
     }
  };

  const downloadPDF = () => {
     if (!fetchedUserReport) return;
     const element = reportRef.current;
     const opt = {
       margin:       0.5,
       filename:     `${fetchedUserReport.user?.name || 'Faculty'}_Evaluation_Report_${fetchedUserReport.month}_${fetchedUserReport.year}.pdf`,
       image:        { type: 'jpeg', quality: 0.98 },
       html2canvas:  { scale: 2 },
       jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
     };

     html2pdf().set(opt).from(element).save();
  };

  const downloadSummaryPDF = () => {
     const element = summaryReportRef.current;
     const opt = {
       margin:       0.5,
       filename:     `${title.replace(/\s+/g, '_')}_Summary.pdf`,
       image:        { type: 'jpeg', quality: 0.98 },
       html2canvas:  { scale: 2 },
       jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
     };

     html2pdf().set(opt).from(element).save();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">{title}</Typography>
        <Button variant="contained" color="primary" startIcon={<PictureAsPdfIcon />} onClick={() => setOpenSummaryPdf(true)}>
           Download Summary
        </Button>
      </Box>

      {groupBy ? (
         <Box>
           {Object.entries(
             (data || []).reduce((acc, row) => {
                const groupVal = row[groupBy] || 'Other';
                if (!acc[groupVal]) acc[groupVal] = [];
                acc[groupVal].push(row);
                return acc;
             }, {})
           ).map(([groupName, groupData]) => (
              <Accordion 
                 key={groupName} 
                 expanded={expandedGroup === groupName} 
                 onChange={handleGroupChange(groupName)}
                 sx={{ mb: 1, border: '1px solid #cfd8dc', boxShadow: 'none', '&:before': { display: 'none' } }}
              >
                 <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#eceff1' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Department: {groupName}</Typography>
                 </AccordionSummary>
                 <AccordionDetails sx={{ p: 0 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#fafafa' }}>
                          {columns.filter(c => c.field !== groupBy && c.header !== 'Department').map((col, idx) => (
                            <TableCell key={idx} sx={{ fontWeight: 'bold' }}>{col.header}</TableCell>
                          ))}
                          <TableCell sx={{ fontWeight: 'bold' }} align="center">Detailed Report</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {groupData.map((row, rIdx) => (
                          <TableRow key={rIdx}>
                            {columns.filter(c => c.field !== groupBy && c.header !== 'Department').map((col, cIdx) => {
                              let cellValue;
                              if (typeof col.valueGetter === 'function') {
                                cellValue = col.valueGetter(row);
                              } else {
                                cellValue = col.field.split('.').reduce((acc, part) => acc && acc[part], row);
                              }
                              return <TableCell key={cIdx}>{cellValue}</TableCell>;
                            })}
                            <TableCell align="center">
                               <Tooltip title="Generate Full PDF Report">
                                  <IconButton color="secondary" onClick={() => handleOpenPdf(row)} disabled={loadingUserId === (row.user_id?._id || row.id)}>
                                     {loadingUserId === (row.user_id?._id || row.id) ? <CircularProgress size={24} /> : <PictureAsPdfIcon />}
                                  </IconButton>
                               </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </AccordionDetails>
              </Accordion>
           ))}
           {(!data || data.length === 0) && <Typography>No data available.</Typography>}
         </Box>
      ) : (
         <Paper sx={{ p: 2, overflowX: 'auto', maxHeight: '500px' }}>
           <Table stickyHeader>
             <TableHead>
               <TableRow>
                 {columns.map((col, idx) => (
                   <TableCell key={idx} sx={{ fontWeight: 'bold' }}>{col.header}</TableCell>
                 ))}
                 <TableCell sx={{ fontWeight: 'bold' }} align="center">Detailed Report</TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
               {data && data.length > 0 ? (
                 data.map((row, rIdx) => (
                   <TableRow key={rIdx}>
                     {columns.map((col, cIdx) => {
                       let cellValue;
                       if (typeof col.valueGetter === 'function') {
                         cellValue = col.valueGetter(row);
                       } else {
                         cellValue = col.field.split('.').reduce((acc, part) => acc && acc[part], row);
                       }
                       return <TableCell key={cIdx}>{cellValue}</TableCell>;
                     })}
                     <TableCell align="center">
                        <Tooltip title="Generate Full PDF Report">
                           <IconButton color="secondary" onClick={() => handleOpenPdf(row)} disabled={loadingUserId === (row.user_id?._id || row.id)}>
                              {loadingUserId === (row.user_id?._id || row.id) ? <CircularProgress size={24} /> : <PictureAsPdfIcon />}
                           </IconButton>
                        </Tooltip>
                     </TableCell>
                   </TableRow>
                 ))
               ) : (
                 <TableRow>
                   <TableCell colSpan={columns.length + 1} align="center">
                     No data available.
                   </TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </Paper>
      )}

      <Dialog open={openPdf} onClose={() => setOpenPdf(false)} maxWidth="md" fullWidth>
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, bgcolor: '#f4f6f8' }}>
            <Button variant="outlined" onClick={() => setOpenPdf(false)} sx={{ mr: 2 }}>Close</Button>
            <Button variant="contained" color="secondary" startIcon={<PictureAsPdfIcon />} onClick={downloadPDF}>
               Download as PDF
            </Button>
         </Box>
         <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <FacultyReportCard ref={reportRef} report={fetchedUserReport} />
         </Box>
      </Dialog>

      <Dialog open={openSummaryPdf} onClose={() => setOpenSummaryPdf(false)} maxWidth="lg" fullWidth>
         <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, bgcolor: '#f4f6f8' }}>
            <Button variant="outlined" onClick={() => setOpenSummaryPdf(false)} sx={{ mr: 2 }}>Close</Button>
            <Button variant="contained" color="primary" startIcon={<PictureAsPdfIcon />} onClick={downloadSummaryPDF}>
               Download Summary PDF
            </Button>
         </Box>
         <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <DepartmentSummaryReportCard ref={summaryReportRef} data={data} columns={columns} title={title} groupBy={groupBy} />
         </Box>
      </Dialog>
    </Box>
  );
};

export default ReportGenerator;
