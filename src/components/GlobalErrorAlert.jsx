import React from 'react';
import { Snackbar, Alert, AlertTitle, Box, Typography } from '@mui/material';
import { useError } from '../context/ErrorContext.jsx';

const GlobalErrorAlert = () => {
  const { errorState, hideError } = useError();

  return (
    <Snackbar 
      open={errorState.open} 
      autoHideDuration={8000} 
      onClose={hideError}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 2 }}
    >
      <Alert 
        onClose={hideError} 
        severity="error" 
        variant="filled"
        sx={{ 
           width: '100%', 
           maxWidth: '600px', 
           boxShadow: 3, 
           borderRadius: 2,
           '& .MuiAlert-message': { width: '100%' }
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
           {errorState.title}
        </AlertTitle>
        <Box sx={{ mt: 1 }}>
           <Typography variant="body2" sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
             {errorState.message}
           </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default GlobalErrorAlert;
