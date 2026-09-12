import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global Fetch Interceptor for robust API connectivity and graceful retries
const originalFetch = window.fetch;
window.fetch = async function (...args) {
  let retries = 3;
  let delay = 1000;

  while (retries > 0) {
    try {
      const response = await originalFetch.apply(this, args);
      
      // Auto-Logout on Invalid/Expired Token
      if (response.status === 401 && window.location.pathname.startsWith('/admin')) {
        if (localStorage.getItem('adminToken')) {
          console.warn('Global Interceptor: 401 Unauthorized detected. Clearing stale session.');
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
        }
      }
      
      return response;
    } catch (error) {
      if (error.name === 'TypeError' && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        retries -= 1;
        if (retries === 0) {
          console.error('Global API Error: Backend server is unreachable after multiple retries.', args[0]);
          window.dispatchEvent(new CustomEvent('api-network-error'));
          
          // Return a graceful 503 response so the UI flow doesn't break
          return new Response(JSON.stringify({ 
            error: "Network Error: Cannot connect to the server. Please try again later.",
            success: false 
          }), {
            status: 503,
            statusText: "Service Unavailable",
            headers: { 'Content-Type': 'application/json' }
          });
        }
        // Exponential backoff
        await new Promise(res => setTimeout(res, delay));
        delay *= 1.5;
      } else {
        throw error;
      }
    }
  }
};

createRoot(document.getElementById('root')).render(
  <App />
)
