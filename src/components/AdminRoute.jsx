import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Simple utility to check if JWT is expired without a library
const isTokenExpired = (token) => {
  try {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return true;
    }
    return false;
  } catch (err) {
    console.error("Token decode error:", err);
    return true; // If invalid format, treat as expired
  }
};

const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 minutes

const AdminRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const lastActivity = localStorage.getItem('adminLastActivity');
      
      // Check inactivity
      if (lastActivity && (Date.now() - parseInt(lastActivity, 10) > INACTIVITY_LIMIT_MS)) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminLastActivity');
        setIsAuth(false);
        return;
      }

      if (!token || isTokenExpired(token)) {
        localStorage.removeItem('adminToken'); // Clear stale token
        setIsAuth(false);
      } else {
        localStorage.setItem('adminLastActivity', Date.now().toString());
        setIsAuth(true);
      }
    };

    checkAuth();

    // Activity tracker
    const updateActivity = () => {
      if (localStorage.getItem('adminToken')) {
        localStorage.setItem('adminLastActivity', Date.now().toString());
      }
    };

    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    // Periodic check every 1 minute
    const interval = setInterval(checkAuth, 60000);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      clearInterval(interval);
    };
  }, [location]); // Re-check auth on route change

  if (isAuth === null) {
    return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border text-primary"></div></div>;
  }

  if (isAuth) {
    const adminRole = localStorage.getItem('adminRole') || 'superadmin';
    if (adminRole === 'lead_manager') {
      const allowedPaths = ['/admin/leads', '/admin/dashboard', '/admin/events'];
      if (!allowedPaths.includes(location.pathname)) {
        return <Navigate to="/admin/leads" replace />;
      }
    }
    if (adminRole === 'mentor') {
      const allowedPaths = ['/admin/lms', '/admin/sessions'];
      if (!allowedPaths.includes(location.pathname)) {
        return <Navigate to="/admin/lms" replace />;
      }
    }
    return children;
  }

  return <Navigate to="/admin/login" replace state={{ from: location }} />;
};

export default AdminRoute;
