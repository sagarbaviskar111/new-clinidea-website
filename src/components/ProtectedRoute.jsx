import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const userToken = localStorage.getItem('userToken');
  const adminToken = localStorage.getItem('adminToken');
  
  if (!userToken && !adminToken) {
    // Redirect inactive or unauthorized users straight to the login barrier, preserving their intended destination
    const redirectPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />;
  }
  
  // If token exists, render the protected component securely
  return children;
};

export default ProtectedRoute;
