import React from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Table, TableHead, TableRow, TableCell, TableBody, Chip, Tooltip, IconButton } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Visibility as ViewIcon, Edit as EditIcon } from '@mui/icons-material';

const StaffSubmissionsLog = ({ groupedSubmissions, isLoading, isDeadlinePassed, handleEditOpen }) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>My Submissions Log & Historical Vault</Typography>
      </Box>

      {isLoading ? <Typography>Loading...</Typography> : (
        Object.keys(groupedSubmissions).length === 0 ? (
           <Paper sx={{ p: 3, textAlign: 'center' }}>
             <Typography>You haven't submitted any activities yet.</Typography>
           </Paper>
        ) : (
           Object.entries(groupedSubmissions).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([monthYear, subs], index) => (
              <Accordion key={monthYear} defaultExpanded={index === 0} sx={{ mb: 1 }}>
                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" fontWeight="bold">{monthYear} ({subs.length} submissions)</Typography>
                 </AccordionSummary>
                 <AccordionDetails>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Activity Name</TableCell>
                          <TableCell>Submission Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Marks</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {subs.map(sub => {
                          const deadlinePassed = isDeadlinePassed();
                          return (
                            <TableRow key={sub._id}>
                              <TableCell>{sub.activity_id?.title}</TableCell>
                              <TableCell>{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                 <Chip size="small" label={sub.status.toUpperCase()} color={sub.status === 'pending' ? 'warning' : sub.status === 'approved' ? 'success' : 'error'} />
                              </TableCell>
                              <TableCell>{sub.status === 'pending' ? '-' : (sub.marks || '0')}</TableCell>
                              <TableCell align="center">
                                {sub.proof_url ? (
                                  <Tooltip title="View Proof">
                                    <IconButton component="a" href={sub.proof_url.startsWith('http') ? sub.proof_url : `http://localhost:5000/${sub.proof_url}`} target="_blank" color="primary">
                                      <ViewIcon />
                                    </IconButton>
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="No Proof Attached">
                                    <IconButton disabled><ViewIcon /></IconButton>
                                  </Tooltip>
                                )}
                                
                                <Tooltip title={deadlinePassed ? "Submission deadline passed" : "Edit Submission"}>
                                   <span>
                                     <IconButton 
                                       color="secondary" 
                                       onClick={() => handleEditOpen(sub)}
                                       disabled={deadlinePassed || sub.status !== 'pending'}
                                     >
                                       <EditIcon />
                                     </IconButton>
                                   </span>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                 </AccordionDetails>
              </Accordion>
           ))
        )
      )}
    </Box>
  );
};

export default StaffSubmissionsLog;
