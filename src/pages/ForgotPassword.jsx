import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Helmet>
        <title>Forgot Password | Clinidea Education</title>
      </Helmet>
      <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 bg-white" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
            <i className="fas fa-key fs-3"></i>
          </div>
          <h3 className="fw-bold text-dark mb-1">Forgot Password?</h3>
          <p className="text-muted small">Enter your registered email address to receive password reset instructions.</p>
        </div>

        {submitted ? (
          <div className="alert alert-success rounded-4 text-center p-3 mb-4">
            <i className="fas fa-paper-plane fs-4 mb-2 d-block"></i>
            Password reset link has been sent to <strong>{email}</strong> if an account exists.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold text-dark">Email Address</label>
              <input 
                type="email" 
                className="form-control form-control-lg rounded-3" 
                required 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm mb-3">
              Send Reset Link
            </button>
          </form>
        )}

        <div className="text-center mt-2">
          <Link to="/login" className="text-decoration-none small text-muted">
            <i className="fas fa-arrow-left me-1"></i> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
