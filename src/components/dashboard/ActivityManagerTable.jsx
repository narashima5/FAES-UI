import React, { useState } from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ActivityManagerTable = ({ sections, subSections, activities, handleOpen, mutDelete }) => {
  const [expandedOuterSection, setExpandedOuterSection] = useState(false);
  const handleOuterAccordionChange = (panel) => (event, isExpanded) => {
     setExpandedOuterSection(isExpanded ? panel : false);
  };

  const [expandedSection, setExpandedSection] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
     setExpandedSection(isExpanded ? panel : false);
  };

  return (
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
                         <AccordionDetails sx={{ p: 0 }}>
                            <Table>
                               <TableHead>
                                  <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Max Marks</TableCell>
                                    <TableCell>Proof Type</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                  </TableRow>
                               </TableHead>
                               <TableBody>
                                  {secActivities.map(act => (
                                    <TableRow key={act._id}>
                                      <TableCell>{act.title}</TableCell>
                                      <TableCell>{act.max_marks}</TableCell>
                                      <TableCell>{act.proof_type.toUpperCase()}</TableCell>
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
                </AccordionDetails>
             </Accordion>
          );
       })}
       {(!sections || sections.length === 0) && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
             <Typography color="textSecondary">No sections defined. Create a section first!</Typography>
          </Paper>
       )}
    </Box>
  );
};

export default ActivityManagerTable;
