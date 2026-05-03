import React from 'react';
import { Box, Typography, Alert, Paper, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ReportGenerator from '../ReportGenerator.jsx';

const HodReportGenerator = ({ 
  filterMonth, setFilterMonth, filterStaff, setFilterStaff, 
  uniqueStaff, isLoading, groupedReport 
}) => {
  return (
    <Box>
       <Typography variant="h5" mb={3}>Monthly Report Generator</Typography>
       
       <Alert severity="info" sx={{ mb: 4 }}>
         Note: Submissions are active from the 1st to the 28th of every month. To ensure complete and accurate report generation, please generate the reports during the first week of the subsequent month.
       </Alert>

       <Paper sx={{ p: 3, mb: 4 }}>
         <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
               <FormControl fullWidth>
                  <InputLabel>Filter By Month</InputLabel>
                  <Select value={filterMonth} label="Filter By Month" onChange={e => setFilterMonth(e.target.value)}>
                     <MenuItem value="all">All Months</MenuItem>
                     {Array.from({length: 12}).map((_, i) => (
                        <MenuItem key={i} value={i}>{new Date(0, i).toLocaleString('en', { month: 'long' })}</MenuItem>
                     ))}
                  </Select>
               </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
               <FormControl fullWidth>
                  <InputLabel>Filter By Staff</InputLabel>
                  <Select value={filterStaff} label="Filter By Staff" onChange={e => setFilterStaff(e.target.value)}>
                     <MenuItem value="all">All Staff Members</MenuItem>
                     {uniqueStaff.map(s => (
                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                     ))}
                  </Select>
               </FormControl>
            </Grid>
         </Grid>
       </Paper>

       <Box mt={2}>
         {isLoading ? <Typography>Loading...</Typography> : (
           <ReportGenerator 
              data={groupedReport} 
              columns={[
                 { header: 'Staff Name', valueGetter: (row) => row.name },
                 { header: 'Total Activities Submitted', valueGetter: (row) => row.totalActivities },
                 { header: 'Total Approved Marks', valueGetter: (row) => row.totalMarks }
              ]}
              title="Department Staff Performance Report"
           />
         )}
       </Box>
    </Box>
  );
};

export default HodReportGenerator;
