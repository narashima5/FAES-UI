import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, FormControlLabel, Switch, Divider, TextField, Button } from '@mui/material';
import { useSettings } from '../../context/SettingsContext.jsx';

const AdminSystemSettingsPanel = ({ updateSettingsMutation }) => {
  const { settings } = useSettings();
  
  const [config, setConfig] = useState({
     maintenance_mode: settings?.maintenance_mode || false,
     emergency_override: settings?.emergency_override || false,
     platform_title: settings?.platform_title || 'FAES Panel',
     primary_color: settings?.primary_color || '#1976d2'
  });

  useEffect(() => {
    if (settings) {
       setConfig({
         maintenance_mode: settings.maintenance_mode || false,
         emergency_override: settings.emergency_override || false,
         platform_title: settings.platform_title || 'FAES Panel',
         primary_color: settings.primary_color || '#1976d2'
       });
    }
  }, [settings]);

  const handleSaveSettings = () => {
     updateSettingsMutation.mutate(config);
  };

  return (
     <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
       <Typography variant="h6" mb={3} color="primary">Global Configuration</Typography>
       
       <Box mb={3}>
          <FormControlLabel 
             control={<Switch checked={config.maintenance_mode} onChange={e => setConfig({...config, maintenance_mode: e.target.checked})} color="error" />} 
             label="Maintenance Mode (Lockout Staff/HODs)" 
          />
          <Typography variant="body2" color="textSecondary" ml={4}>When enabled, standard users cannot access the platform.</Typography>
       </Box>

       <Box mb={3}>
          <FormControlLabel 
             control={<Switch checked={config.emergency_override} onChange={e => setConfig({...config, emergency_override: e.target.checked})} color="warning" />} 
             label="Emergency Submission Override" 
          />
          <Typography variant="body2" color="textSecondary" ml={4}>When enabled, ignores the 28th-of-the-month deadline restriction.</Typography>
       </Box>

       <Divider sx={{ my: 3 }} />
       <Typography variant="h6" mb={3} color="primary">Platform Branding</Typography>

       <TextField 
          fullWidth label="Platform Title" value={config.platform_title} 
          onChange={e => setConfig({...config, platform_title: e.target.value})} 
          sx={{ mb: 3 }}
       />
       
       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Typography>Primary Accent Color:</Typography>
          <input 
             type="color" 
             value={config.primary_color} 
             onChange={e => setConfig({...config, primary_color: e.target.value})} 
             style={{ width: '50px', height: '40px', cursor: 'pointer', border: '1px solid #ccc' }}
          />
       </Box>

       <Button 
          variant="contained" fullWidth size="large" 
          onClick={handleSaveSettings}
          disabled={updateSettingsMutation.isPending}
       >
          {updateSettingsMutation.isPending ? 'Saving...' : 'Save Configuration'}
       </Button>
     </Paper>
  );
};

export default AdminSystemSettingsPanel;
