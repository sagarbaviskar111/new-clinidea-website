import React from 'react';
import { useNavigate } from 'react-router-dom';

const InternalNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        .internal-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1050;
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .internal-nav-container {
          padding: 15px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .internal-logo img {
          height: 45px;
        }
        @media (max-width: 768px) {
          .internal-logo img {
            height: 35px;
          }
          .internal-lms-text {
            display: none !important;
          }
        }
      `}</style>

      <header className="internal-navbar">
        <div className="internal-nav-container">
          <div className="internal-logo d-flex align-items-center">
            <img loading="lazy" src="/clinidea Logo/Clinidea_Education_Logo_header.webp" alt="Clinidea Education Logo" />
            <span className="internal-lms-text ms-3 fw-bold fs-5 text-secondary border-start ps-3 border-2">Learning Management System</span>
          </div>
          <div>
            <button onClick={handleLogout} className="btn btn-outline-danger fw-bold rounded-pill px-4">
              <i className="fa fa-sign-out-alt me-2"></i> Logout
            </button>
          </div>
        </div>
      </header>
      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div style={{ height: '75px' }}></div>
    </>
  );
};

export default InternalNavbar;
