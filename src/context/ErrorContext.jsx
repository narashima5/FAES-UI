import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ErrorContext = createContext();

// Create an event emitter approach so that non-React code (like main.jsx query clients) can trigger errors.
export const triggerGlobalError = (message, title = 'An Error Occurred') => {
   const event = new CustomEvent('global-error', { detail: { message, title } });
   window.dispatchEvent(event);
};

export const ErrorProvider = ({ children }) => {
  const [errorState, setErrorState] = useState({ open: false, title: '', message: '' });

  const showError = useCallback((message, title = 'Application Error') => {
    console.error(`[GlobalError] ${title}:`, message);
    setErrorState({ open: true, title, message: String(message) });
  }, []);

  const hideError = useCallback(() => {
    setErrorState(prev => ({ ...prev, open: false }));
  }, []);

  useEffect(() => {
    // Listen for custom dispatch events
    const handleCustomError = (e) => {
       showError(e.detail.message, e.detail.title);
    };

    // Listen for unhandled promise rejections (often API crashes without TanStack)
    const handleUnhandledRejection = (e) => {
       console.error("Unhandled Rejection caught globally:", e.reason);
       // Avoid intercepting React Router navigation aborts
       if (e.reason?.name !== 'AbortError') {
          showError(e.reason?.message || "An unexpected network or logic error occurred.", "Unhandled Rejection");
       }
    };

    // Listen for synchronous JS crashes
    const handleWindowError = (e) => {
       console.error("Window error caught globally:", e.error);
       showError(e.message, "Runtime Error");
    };

    window.addEventListener('global-error', handleCustomError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleWindowError);

    return () => {
       window.removeEventListener('global-error', handleCustomError);
       window.removeEventListener('unhandledrejection', handleUnhandledRejection);
       window.removeEventListener('error', handleWindowError);
    };
  }, [showError]);

  return (
    <ErrorContext.Provider value={{ errorState, showError, hideError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
