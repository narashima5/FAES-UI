import React from 'react';
import { Snackbar, Alert, AlertTitle, Box, Typography, Slide } from '@mui/material';
import { useError } from '../context/ErrorContext.jsx';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const GlobalErrorAlert = () => {
  const { errorState, hideError } = useError();

  return (
    <Snackbar 
      open={errorState.open} 
      autoHideDuration={8000} 
      onClose={hideError}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
      sx={{ mt: 3 }}
    >
      <Alert 
        onClose={hideError} 
        icon={<ErrorOutlineIcon sx={{ fontSize: 32, color: '#ff4d4f' }} />}
        sx={{ 
           width: '100%', 
           minWidth: { xs: '300px', sm: '400px' },
           maxWidth: '600px', 
           backgroundColor: 'rgba(25, 25, 25, 0.95)',
           color: '#fff',
           backdropFilter: 'blur(10px)',
           border: '1px solid rgba(255, 77, 79, 0.3)',
           borderLeft: '6px solid #ff4d4f',
           boxShadow: '0 8px 32px rgba(255, 77, 79, 0.25)',
           borderRadius: 3,
           alignItems: 'center',
           '& .MuiAlert-icon': {
             alignItems: 'center',
             mr: 2
           },
           '& .MuiAlert-message': { 
             width: '100%',
             py: 1
           },
           '& .MuiAlert-action': {
             color: 'rgba(255,255,255,0.7)',
             alignItems: 'flex-start',
             pt: 1,
             '&:hover': {
               color: '#fff'
             }
           }
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, fontSize: '1.15rem', color: '#ff4d4f', mb: 0.5, letterSpacing: '0.5px' }}>
           {errorState.title || 'System Alert'}
        </AlertTitle>
        <Box sx={{ mt: 0.5 }}>
           <Typography variant="body2" sx={{ 
             wordBreak: 'break-word', 
             whiteSpace: 'pre-wrap',
             color: 'rgba(255, 255, 255, 0.85)',
             lineHeight: 1.5,
             fontSize: '0.95rem'
           }}>
             {errorState.message}
           </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default GlobalErrorAlert;
