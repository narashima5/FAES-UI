import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Divider } from '@mui/material';

const FacultyReportCard = React.forwardRef(({ report }, ref) => {
  if (!report) return <Typography>No data provided to report card.</Typography>;

  const { user, month, year, activities, section_scores, calculations } = report;

  return (
    <Box ref={ref} sx={{ p: 4, bgcolor: 'white', color: 'black', fontFamily: 'Arial, sans-serif' }}>
       {/* Header */}
       <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Faculty Activity Evaluation Report</Typography>
          <Typography variant="subtitle1" color="textSecondary">
             For Period: {month}/{year} | Generated on: {new Date().toLocaleDateString()}
          </Typography>
       </Box>
       <Divider sx={{ mb: 3 }} />

       {/* Faculty Details */}
       <Box sx={{ mb: 4, p: 2, bgcolor: '#f4f6f8', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Faculty Profile</Typography>
          <Typography><strong>Name:</strong> {user?.name || 'Unknown'}</Typography>
          <Typography><strong>Department:</strong> {user?.department_id?.name || 'Unassigned'}</Typography>
          <Typography><strong>Email:</strong> {user?.email || 'N/A'}</Typography>
       </Box>

       {/* Submissions Table */}
       <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Activity Breakdown</Typography>
       <Paper sx={{ mb: 4, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
         <Table size="small">
            <TableHead sx={{ bgcolor: '#eeeeee' }}>
               <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Section</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Activity Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Evaluated Marks</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {(!activities || activities.length === 0) ? (
                  <TableRow><TableCell colSpan={4} align="center">No activities submitted.</TableCell></TableRow>
               ) : (
                  section_scores?.map((sec, idx) => {
                    const secActivities = activities.filter(a => a.section_title === sec.title);
                    const subSecMap = {};
                    secActivities.forEach(act => {
                       if (!subSecMap[act.sub_section_title]) subSecMap[act.sub_section_title] = [];
                       subSecMap[act.sub_section_title].push(act);
                    });

                    return (
                       <React.Fragment key={idx}>
                          <TableRow sx={{ bgcolor: '#fafafa' }}>
                             <TableCell colSpan={4} sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                {sec.title} (Raw Total: {sec.marks})
                             </TableCell>
                          </TableRow>
                          {secActivities.length === 0 ? (
                             <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                                   No activities under this section
                                </TableCell>
                             </TableRow>
                          ) : (
                             Object.entries(subSecMap).map(([subSecTitle, subSecActs]) => (
                                <React.Fragment key={subSecTitle}>
                                   <TableRow>
                                      <TableCell colSpan={4} sx={{ fontWeight: 'bold', pl: 4, bgcolor: '#f5f5f5', color: '#555' }}>
                                         {subSecTitle}
                                      </TableCell>
                                   </TableRow>
                                   {subSecActs.map(act => (
                                      <TableRow key={act.submission_id}>
                                         <TableCell></TableCell>
                                         <TableCell sx={{ pl: 6 }}>{act.activity_title} ({act.max_marks})</TableCell>
                                         <TableCell>{act.status.toUpperCase()}</TableCell>
                                         <TableCell align="right">{act.marks_obtained}</TableCell>
                                      </TableRow>
                                   ))}
                                </React.Fragment>
                             ))
                          )}
                       </React.Fragment>
                    )
                  })
               )}
            </TableBody>
         </Table>
       </Paper>

       {/* Score Calculation Section based on Backend Calculations */}
       {calculations && (
         <Box sx={{ mt: 4, p: 3, border: '2px solid #1976d2', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>Final Score Calculation</Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
               <Typography>Aggregate of Sections 1, 2, 3 (Calculated limit to Max 75):</Typography>
               <Typography sx={{ fontWeight: 'bold' }}>{calculations.total_first_3_sections} / 75</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: 'textSecondary' }}>
               <Typography>Scaled Sections 1, 2, 3 (Converted to Max 50):</Typography>
               <Typography sx={{ fontWeight: 'bold' }}>{calculations.scaled_first_3_sections} / 50</Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
               <Typography>Section 4 Marks (Max 50):</Typography>
               <Typography sx={{ fontWeight: 'bold' }}>{calculations.total_last_section} / 50</Typography>
            </Box>

            <Divider sx={{ my: 2, borderBottomWidth: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
               <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Total Final Score (Out of 100):</Typography>
               <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {calculations.final_score} / 100
               </Typography>
            </Box>
         </Box>
       )}
    </Box>
  );
});

export default FacultyReportCard;
