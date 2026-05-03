import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { 
  AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, 
  ListItemText, ListItemButton, Box, IconButton, CssBaseline, Divider
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon, Assignment, 
  FilePresent, Assessment, Group, Domain, Settings, Logout
} from '@mui/icons-material';

const drawerWidth = 240;

const menuConfigs = {
  staff: [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Activities', icon: <Assignment />, path: '/dashboard/activities' },
    { label: 'My Submissions', icon: <FilePresent />, path: '/dashboard/submissions' },
    { label: 'Scores', icon: <Assessment />, path: '/dashboard/scores' },
  ],
  hod: [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Activities', icon: <Assignment />, path: '/dashboard/activities' },
    { label: 'Department Staff', icon: <Group />, path: '/dashboard/department-staff' },
    { label: 'Reports', icon: <Assessment />, path: '/dashboard/hod-reports' },
  ],
  iqac: [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'All Submissions', icon: <FilePresent />, path: '/dashboard/all-submissions' },
    { label: 'Evaluation Panel', icon: <Assignment />, path: '/dashboard/evaluate' },
  ],
  management: [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Global Analytics', icon: <Assessment />, path: '/dashboard/management-analytics' },
  ],
  admin: [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'User Management', icon: <Group />, path: '/dashboard/users' },
    { label: 'Departments', icon: <Domain />, path: '/dashboard/departments' },
    { label: 'Activities Management', icon: <Assignment />, path: '/dashboard/manage-activities' },
    { label: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
  ]
};

const Layout = () => {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const currentMenu = menuConfigs[user.role] || [];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          {settings?.platform_title || 'FAES Panel'}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {currentMenu.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { logout(); navigate('/login'); }}>
            <ListItemIcon><Logout color="error" /></ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: 'error.main' }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {currentMenu.find(m => m.path === location.pathname)?.label || 'Dashboard'}
          </Typography>
          <Typography variant="body1">
            Welcome, <strong>{user.name}</strong> ({user.role.toUpperCase()})
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, backgroundColor: '#f4f6f8', minHeight: '100vh' }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
