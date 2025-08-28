import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
//import * as Sentry from '@sentry/react';
//import './index.css';
import { AuthProvider } from './context/AuthContextProvider'; // om du använder context

/*Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  sendDefaultPii: true,
  environment: import.meta.env.MODE,
});*/


const container = document.getElementById('app');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
