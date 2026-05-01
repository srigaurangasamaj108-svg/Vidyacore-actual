import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // ✅ Only one Router here
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './index.css';

import { TRPCProvider } from './components/trpc/TRPCProvider';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TRPCProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </TRPCProvider>
    </BrowserRouter>
  </React.StrictMode>
);

