import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Unauthorized = () => {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Helmet>
        <title>Unauthorized Access | Clinidea Education</title>
      </Helmet>
      <div className="text-center p-5 bg-white rounded-4 shadow-sm max-w-md border" style={{ maxWidth: '480px' }}>
        <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
          <i className="fas fa-lock fs-1"></i>
        </div>
        <h2 className="fw-bold text-dark mb-2">Access Denied</h2>
        <p className="text-muted mb-4">
          You do not have permission to view this resource. Please contact your system administrator if you believe this is an error.
        </p>
        <Link to="/login" className="btn btn-primary rounded-pill px-4 py-2.5 fw-bold">
          <i className="fas fa-arrow-left me-2"></i> Return to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
