import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Grid, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      // Role is automatically securely extrapolated from the backend JWT payload.
      await login(email, password, 'generic'); 
      navigate('/dashboard');
    } catch (error) {
      setErrorMsg(error.message || 'Login failed. Please verify credentials.');
    } finally {
       setLoading(false);
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      {/* Left Branding Panel */}
      <Grid item xs={12} md={5} sx={{
         display: { xs: 'none', md: 'flex' },
         flexDirection: 'column',
         justifyContent: 'center',
         alignItems: 'center',
         background: 'linear-gradient(145deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
         color: '#ffffff',
         p: 6
      }}>
        <Box sx={{ maxWidth: 400 }}>
           <Typography variant="h3" fontWeight="800" gutterBottom>
             Empowering Excellence
           </Typography>
           <Typography variant="h6" color="rgba(255,255,255,0.7)" sx={{ lineHeight: 1.6 }}>
             Secure logging gateway for the Faculty Activity Evaluation System. Streamline your departmental analytics in one platform.
           </Typography>
        </Box>
      </Grid>

      {/* Right Login Panel */}
      <Grid item xs={12} md={7} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={0} sx={{ 
           width: '100%', maxWidth: 480, p: { xs: 4, md: 8 }, 
           bgcolor: 'transparent'
        }}>
          <Typography component="h1" variant="h4" fontWeight="bold" color="textPrimary" mb={1}>
             Welcome Back
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" mb={5}>
             Please enter your institutional credentials to access your portal.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {errorMsg && (
               <Alert severity="error" sx={{ mb: 4, borderRadius: 1 }}>{errorMsg}</Alert>
            )}

            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 600 }}>Email Address</Typography>
            <TextField
              required fullWidth id="email"
              placeholder="name@institution.edu"
              name="email" autoComplete="email" autoFocus
              value={email} onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1, fontWeight: 600 }}>Account Password</Typography>
            <TextField
              required fullWidth name="password"
              placeholder="••••••••"
              type="password" id="password" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 5 }}
            />

            <Button
              type="submit" fullWidth variant="contained" disabled={loading}
              sx={{
                 py: 2, 
                 fontSize: '1rem', 
                 fontWeight: 'bold', 
                 borderRadius: 1,
                 textTransform: 'none',
                 bgcolor: '#0f2027',
                 '&:hover': { bgcolor: '#203a43' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign into portal'}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
