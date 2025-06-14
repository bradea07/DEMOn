import React from 'react';
import ReactDOM from 'react-dom/client';
import './Login.css'; // Adjust the path if needed
import './Signup.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);


reportWebVitals();
