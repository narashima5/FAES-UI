import React, { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { fetchSettings } from '../api/adminApi.js';

const SettingsContext = createContext(null);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
    staleTime: Infinity,
    refetchInterval: 30000 // refresh settings every 30s in case admin updates
  });

  const dynamicTheme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: settings?.primary_color || '#1976d2',
      },
      background: {
        default: '#f4f6f8'
      }
    },
  }), [settings?.primary_color]);

  if (isLoading) {
    return null; // or a tiny loader
  }

  return (
    <SettingsContext.Provider value={{ settings }}>
      <ThemeProvider theme={dynamicTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SettingsContext.Provider>
  );
};
