// Dynamically resolve backend URL.
// 1. Explicit VITE_API_URL if defined
// 2. localhost / 127.0.0.1 -> http://localhost:5000
// 3. Local network IP (e.g. 192.168.x.x) -> port 5000 for mobile testing
// 4. Production Domain -> current origin (proxied by Nginx)
const currentHostname = window.location.hostname;
const currentProtocol = window.location.protocol;
const isLocalhost = currentHostname === 'localhost' || currentHostname === '127.0.0.1';
const isLocalIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(currentHostname);

export const BASE_URL = import.meta.env.VITE_API_URL || 
  (isLocalhost 
    ? 'http://localhost:5000' 
    : (isLocalIp ? `${currentProtocol}//${currentHostname}:5000` : `${currentProtocol}//${currentHostname}`));
