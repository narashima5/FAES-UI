import React, { useState } from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Table, TableHead, TableRow, TableCell, TableBody, Chip, Tooltip, IconButton } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, AssignmentTurnedIn as EvaluateIcon } from '@mui/icons-material';

const IqacEvaluationSandbox = ({ isLoading, groupedData, openEvalModal }) => {
  const [expandedDept, setExpandedDept] = useState(false);
  const [expandedFaculty, setExpandedFaculty] = useState(false);
  const [expandedSection, setExpandedSection] = useState(false);
  const [expandedSubSection, setExpandedSubSection] = useState(false);

  const handleDeptChange = (panel) => (event, isExpanded) => setExpandedDept(isExpanded ? panel : false);
  const handleFacultyChange = (panel) => (event, isExpanded) => setExpandedFaculty(isExpanded ? panel : false);
  const handleSectionChange = (panel) => (event, isExpanded) => setExpandedSection(isExpanded ? panel : false);
  const handleSubSectionChange = (panel) => (event, isExpanded) => setExpandedSubSection(isExpanded ? panel : false);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>Evaluation Sandbox</Typography>
      </Box>

      {isLoading ? <Typography>Loading submissions data...</Typography> : (
         <Box>
            {Object.keys(groupedData).length === 0 ? (
               <Paper sx={{ p: 4, textAlign: 'center' }}><Typography>No submissions found.</Typography></Paper>
            ) : (
               Object.entries(groupedData).map(([deptName, faculties]) => (
                  <Accordion key={deptName} expanded={expandedDept === deptName} onChange={handleDeptChange(deptName)} sx={{ mb: 2, border: '1px solid #1976d2', borderRadius: '4px', '&:before': { display: 'none' } }}>
                     <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#e3f2fd', borderRadius: '4px' }}>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>Department: {deptName}</Typography>
                     </AccordionSummary>
                     <AccordionDetails sx={{ p: 2, pt: 3, bgcolor: '#ffffff' }}>
                        {Object.entries(faculties).map(([facultyKey, sections]) => {
                           const [facNameStr, facId] = facultyKey.split('|||');
                           return (
                              <Accordion key={facId} expanded={expandedFaculty === facId} onChange={handleFacultyChange(facId)} sx={{ mb: 2, border: '1px solid #cfd8dc', boxShadow: 'none', '&:before': { display: 'none' } }}>
                                 <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#eceff1' }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Faculty: {facNameStr}</Typography>
                                 </AccordionSummary>
                                 <AccordionDetails sx={{ p: 2, pt: 2 }}>
                                    {Object.entries(sections).map(([secName, subSections]) => (
                                       <Accordion key={secName} expanded={expandedSection === secName} onChange={handleSectionChange(secName)} sx={{ mb: 1, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                             <Typography variant="subtitle2" color="secondary" sx={{ fontWeight: 'bold' }}>Section: {secName}</Typography>
                                          </AccordionSummary>
                                          <AccordionDetails sx={{ p: 1, pt: 0 }}>
                                             {Object.entries(subSections).map(([subSecName, subs]) => (
                                                <Accordion key={subSecName} expanded={expandedSubSection === subSecName} onChange={handleSubSectionChange(subSecName)} sx={{ mb: 1, boxShadow: 'none', bgcolor: '#fafafa' }}>
                                                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Sub-Section: {subSecName}</Typography>
                                                   </AccordionSummary>
                                                   <AccordionDetails sx={{ p: 0 }}>
                                                      <Table size="small">
                                                         <TableHead>
                                                            <TableRow sx={{ bgcolor: '#eeeeee' }}>
                                                               <TableCell>Activity Title</TableCell>
                                                               <TableCell>Max Marks</TableCell>
                                                               <TableCell>Status</TableCell>
                                                               <TableCell align="center">Actions</TableCell>
                                                            </TableRow>
                                                         </TableHead>
                                                         <TableBody>
                                                            {subs.map(sub => (
                                                               <TableRow key={sub._id}>
                                                                  <TableCell>{sub.activity_id?.title || 'Deleted Activity'}</TableCell>
                                                                  <TableCell>{sub.activity_id?.max_marks || 'N/A'}</TableCell>
                                                                  <TableCell>
                                                                     <Chip 
                                                                       size="small" 
                                                                       label={sub.status.toUpperCase()} 
                                                                       color={sub.status === 'pending' ? 'warning' : sub.status === 'approved' ? 'success' : 'error'} 
                                                                     />
                                                                  </TableCell>
                                                                  <TableCell align="center">
                                                                     <Tooltip title="Evaluate">
                                                                        <IconButton color="primary" onClick={() => openEvalModal(sub)} size="small">
                                                                           <EvaluateIcon />
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
                                          </AccordionDetails>
                                       </Accordion>
                                    ))}
                                 </AccordionDetails>
                              </Accordion>
                           )
                        })}
                     </AccordionDetails>
                  </Accordion>
               ))
            )}
         </Box>
      )}
    </Box>
  );
};

export default IqacEvaluationSandbox;
