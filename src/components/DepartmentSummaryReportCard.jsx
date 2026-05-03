import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Divider } from '@mui/material';

const DepartmentSummaryReportCard = React.forwardRef(({ data, columns, title, groupBy = null }, ref) => {
  if (!data || data.length === 0) return <Typography>No data available for summary report.</Typography>;

  const filteredColumns = groupBy ? columns.filter(c => c.field !== groupBy && c.header !== 'Department') : columns;

  return (
    <Box ref={ref} sx={{ p: 4, bgcolor: 'white', color: 'black', fontFamily: 'Arial, sans-serif' }}>
       <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>{title}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
             Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Typography>
       </Box>
       <Divider sx={{ mb: 3 }} />

       <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Aggregated Staff Performance Summary</Typography>
       
       {groupBy ? (
          <Box>
             {Object.entries(
                data.reduce((acc, row) => {
                   const groupVal = row[groupBy] || 'Other';
                   if (!acc[groupVal]) acc[groupVal] = [];
                   acc[groupVal].push(row);
                   return acc;
                }, {})
             ).map(([groupName, groupData]) => (
                <Box key={groupName} sx={{ mb: 4, pageBreakInside: 'avoid' }}>
                   <Typography variant="subtitle1" sx={{ fontWeight: 'bold', bgcolor: '#f0f0f0', p: 1, border: '1px solid #e0e0e0', borderBottom: 'none' }}>
                      Department: {groupName}
                   </Typography>
                   <Paper sx={{ boxShadow: 'none', border: '1px solid #e0e0e0', borderRadius: 0 }}>
                     <Table size="small">
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                           <TableRow>
                             {filteredColumns.map((col, idx) => (
                               <TableCell key={idx} sx={{ fontWeight: 'bold' }}>{col.header}</TableCell>
                             ))}
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {groupData.map((row, rIdx) => (
                             <TableRow key={rIdx} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                               {filteredColumns.map((col, cIdx) => {
                                 let cellValue;
                                 if (typeof col.valueGetter === 'function') {
                                   cellValue = col.valueGetter(row);
                                 } else {
                                   cellValue = col.field.split('.').reduce((acc, part) => acc && acc[part], row);
                                 }
                                 return <TableCell key={cIdx}>{cellValue}</TableCell>;
                               })}
                             </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                   </Paper>
                </Box>
             ))}
          </Box>
       ) : (
          <Paper sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
            <Table size="small">
               <TableHead sx={{ bgcolor: '#eeeeee' }}>
                  <TableRow>
                    {filteredColumns.map((col, idx) => (
                      <TableCell key={idx} sx={{ fontWeight: 'bold' }}>{col.header}</TableCell>
                    ))}
                  </TableRow>
               </TableHead>
               <TableBody>
                  {data.map((row, rIdx) => (
                    <TableRow key={rIdx} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fafafa' } }}>
                      {filteredColumns.map((col, cIdx) => {
                        let cellValue;
                        if (typeof col.valueGetter === 'function') {
                          cellValue = col.valueGetter(row);
                        } else {
                          cellValue = col.field.split('.').reduce((acc, part) => acc && acc[part], row);
                        }
                        return <TableCell key={cIdx}>{cellValue}</TableCell>;
                      })}
                    </TableRow>
                  ))}
               </TableBody>
            </Table>
          </Paper>
       )}

       <Box sx={{ mt: 5, textAlign: 'center', color: 'textSecondary' }}>
          <Typography variant="body2">*** End of Summary Report ***</Typography>
       </Box>
    </Box>
  );
});

export default DepartmentSummaryReportCard;
