import React from 'react';
import { Navigate } from 'react-router-dom';

const MentorRoute = ({ children }) => {
  const token = localStorage.getItem('mentorToken');
  
  if (!token) {
    return <Navigate to="/mentor/login" replace />;
  }

  // Optionally decode the JWT here to check for 'mentor' or 'superadmin' role, 
  // but for simple UI protection, presence of mentorToken is usually enough.
  return children;
};

export default MentorRoute;
