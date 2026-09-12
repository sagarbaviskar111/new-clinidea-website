import React from 'react';
import { Navigate } from 'react-router-dom';

const CoordinatorRoute = ({ children }) => {
  const token = localStorage.getItem('coordinatorToken');
  if (!token) {
    return <Navigate to="/studentcoordinator/login" replace />;
  }
  return children;
};

export default CoordinatorRoute;
