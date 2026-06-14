import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import axios from 'axios';

// Set production/development base URL dynamically for Axios
const host = window.location.hostname;
if (host !== 'localhost' && host !== '127.0.0.1') {
  if (host.includes('.onrender.com')) {
    axios.defaults.baseURL = window.location.origin.replace('-frontend', '-backend');
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
