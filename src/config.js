// Dynamically resolve backend API URL
// 1. In Local Development (localhost / 127.0.0.1 or Vite dev server on port 5173):
//    Points to http://localhost:5000
// 2. In Production (VPS IP, Domain, Nginx):
//    Uses relative path "" so requests go directly to /api/ via Nginx (port 80/443, NO :5000!)
const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
const currentPort = typeof window !== 'undefined' ? window.location.port : '';
const isLocalhost = currentHostname === 'localhost' || currentHostname === '127.0.0.1';
const isViteDev = currentPort === '5173';

export const BASE_URL = (import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== '')
  ? import.meta.env.VITE_API_URL
  : (isLocalhost || isViteDev ? 'http://localhost:5000' : '');

