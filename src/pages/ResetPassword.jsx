import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setIsSuccess(true);
    setMessage('Password reset successful! Redirecting to login...');
    setTimeout(() => {
      navigate('/login');
    }, 2500);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Helmet>
        <title>Reset Password | Clinidea Education</title>
      </Helmet>
      <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 bg-white" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
            <i className="fas fa-lock-open fs-3"></i>
          </div>
          <h3 className="fw-bold text-dark mb-1">Set New Password</h3>
          <p className="text-muted small">Enter your new secure password below.</p>
        </div>

        {message && (
          <div className={`alert alert-${isSuccess ? 'success' : 'danger'} rounded-4 text-center p-3 mb-4`}>
            {message}
          </div>
        )}

        <form onSubmit={handleReset}>
          <div className="mb-3">
            <label className="form-label fw-bold text-dark">New Password</label>
            <input 
              type="password" 
              className="form-control form-control-lg rounded-3" 
              required 
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold text-dark">Confirm New Password</label>
            <input 
              type="password" 
              className="form-control form-control-lg rounded-3" 
              required 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm mb-3" disabled={isSuccess}>
            Reset Password
          </button>
        </form>

        <div className="text-center mt-2">
          <Link to="/login" className="text-decoration-none small text-muted">
            <i className="fas fa-arrow-left me-1"></i> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
