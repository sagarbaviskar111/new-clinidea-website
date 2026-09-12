import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const RegisterInstructions = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5 mt-5">
      <Helmet>
        <title>Registration Instructions | Clinidea Education</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <div className="text-center mb-5">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-4" style={{ width: '80px', height: '80px' }}>
                  <i className="fa fa-lock fs-1"></i>
                </div>
                <h1 className="fw-bold" style={{ color: 'var(--color-primary)' }}>Secure Your Enrollment</h1>
                <p className="text-muted fs-5">You are just one step away from starting your journey with Clinidea Education.</p>
              </div>

              <div className="alert alert-info border-0 shadow-sm rounded-4 p-4 mb-5">
                <h4 className="fw-bold text-dark mb-3"><i className="fa fa-info-circle me-2 text-primary"></i> Registration Process</h4>
                <p className="mb-2">To secure your seat in the upcoming batch and unlock your student dashboard, please complete the seat booking process.</p>
                <ul className="list-unstyled mb-0 ms-2 mt-3">
                  <li className="mb-3 d-flex align-items-start">
                    <i className="fa fa-check-circle text-success mt-1 me-3 fs-5"></i>
                    <div>
                      <strong>Step 1: Seat Booking Fee (₹10,000)</strong>
                      <p className="text-muted small mb-0">A nominal fee is required to confirm your dedication and block your seat. This will be adjusted against your total course fees.</p>
                    </div>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <i className="fa fa-check-circle text-success mt-1 me-3 fs-5"></i>
                    <div>
                      <strong>Step 2: Upload Payment Proof</strong>
                      <p className="text-muted small mb-0">Pay securely via UPI or Bank Transfer, then upload the screenshot on the next screen.</p>
                    </div>
                  </li>
                  <li className="mb-0 d-flex align-items-start">
                    <i className="fa fa-check-circle text-success mt-1 me-3 fs-5"></i>
                    <div>
                      <strong>Step 3: Verification & Onboarding</strong>
                      <p className="text-muted small mb-0">Our team will verify your payment within 24 hours and unlock your full student dashboard.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => navigate('/payment-upload')} 
                  className="btn btn-primary px-5 py-3 fw-bold fs-5 shadow rounded-pill"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent) 100%)', border: 'none' }}
                >
                  Proceed to Payment <i className="fa fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterInstructions;
