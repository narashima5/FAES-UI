import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { ErrorProvider, triggerGlobalError } from './context/ErrorContext.jsx'
import App from './App.jsx'

const handleQueryError = async (error, title) => {
  let msg = error.message;
  if (error.response) {
     try {
       const body = await error.response.clone().json();
       if (body.message) msg = body.message;
     } catch(e) {}
  }
  triggerGlobalError(msg, title);
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => handleQueryError(error, 'Data Fetch Error')
  }),
  mutationCache: new MutationCache({
    onError: (error) => handleQueryError(error, 'Action Failed')
  })
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <SettingsProvider>
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthProvider>
        </SettingsProvider>
      </ErrorProvider>
    </QueryClientProvider>
  </StrictMode>,
)
