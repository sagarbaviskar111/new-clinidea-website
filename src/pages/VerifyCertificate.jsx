import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const [certId, setCertId] = useState(certificateId || '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!!certificateId);

  useEffect(() => {
    if (certificateId) {
      handleAutoVerify(certificateId);
    }
  }, [certificateId]);

  const handleAutoVerify = async (id) => {
    try {
      const url = `${BASE_URL}/api/certificates/verify/${id}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Verification failed. Invalid ID.');
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certId.trim()) {
      setError('Please enter a valid Certificate ID.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    handleAutoVerify(certId.trim());
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="container py-5" style={{ minHeight: '80vh', marginTop: '60px' }}>
      <Helmet>
        <title>Verify Certificate | Clinidea Education</title>
        <meta name="description" content="Authenticate and verify student training certificates issued by Clinidea Education." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-header bg-white border-0 pt-5 pb-0 text-center">
              <div className="mb-3">
                <i className="fa fa-shield-alt text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h2 className="fw-bold text-dark" style={{ color: 'var(--color-primary)' }}>Verify Certificate</h2>
              <p className="text-muted">Enter the unique ID found on your certificate to verify its authenticity.</p>
            </div>
            
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleVerify}>
                <div className="mb-4">
                  <label className="form-label fw-bold">Certificate ID</label>
                  <input 
                    type="text" 
                    className="form-control form-control-lg bg-light" 
                    placeholder="e.g. CERT-A1B2C3D4" 
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100 fw-bold"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Now'}
                </button>
              </form>

              {error && (
                <div className="alert alert-danger mt-4 fw-bold shadow-sm">
                  <i className="fa fa-exclamation-circle me-2"></i> {error}
                </div>
              )}

              {result && (
                <div className="mt-5 p-4 rounded-4" style={{ backgroundColor: 'rgba(24, 183, 165, 0.05)', border: '1px solid rgba(24, 183, 165, 0.2)' }}>
                  <div className="text-center mb-4">
                    <span className="badge bg-success p-2 px-3 fs-6 rounded-pill mb-2">
                      <i className="fa fa-check-circle me-1"></i> Verification Completed
                    </span>
                  </div>
                  
                  <div className="row mb-2">
                    <div className="col-5 text-muted fw-bold small text-uppercase">Student Name</div>
                    <div className="col-7 fw-bold text-dark">{result.studentName}</div>
                  </div>
                  <hr className="my-2 opacity-25" />
                  <div className="row mb-2">
                    <div className="col-5 text-muted fw-bold small text-uppercase">Course Name</div>
                    <div className="col-7 fw-bold text-dark">{result.courseName}</div>
                  </div>
                  <hr className="my-2 opacity-25" />
                  <div className="row mb-2">
                    <div className="col-5 text-muted fw-bold small text-uppercase">Duration</div>
                    <div className="col-7 fw-bold text-dark">
                      {result.startDate ? `${formatDate(result.startDate)} to ${formatDate(result.endDate)}` : 'N/A'}
                    </div>
                  </div>
                  <hr className="my-2 opacity-25" />
                  <div className="row">
                    <div className="col-5 text-muted fw-bold small text-uppercase">Status</div>
                    <div className="col-7 fw-bold">
                      {result.status === 'revoked' ? (
                        <span className="text-danger"><i className="fa fa-times-circle me-1"></i> Revoked</span>
                      ) : (
                        <span className="text-success"><i className="fa fa-check-circle me-1"></i> Valid</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <Link to="/" className="btn btn-outline-primary btn-sm fw-bold">Back to Home</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
