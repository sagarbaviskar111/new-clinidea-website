import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-bg-light)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>Thank You | Clinidea Education</title>
      </Helmet>

      {/* Simple Header fallback if Navbar isn't wrapping it */}
      

      <div className="container flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="row justify-content-center w-100">
          <div className="col-md-8 text-center ftco-animate fadeInUp ftco-animated">
            <div 
              style={{
                background: '#fff',
                padding: '60px 40px',
                borderRadius: '20px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.08)'
              }}
            >
              <div 
                className="icon d-flex align-items-center justify-content-center mx-auto mb-4" 
                style={{
                  width: '100px',
                  height: '100px',
                  background: 'rgba(30, 94, 255, 0.05)',
                  borderRadius: '50%',
                  color: 'var(--color-secondary)',
                  fontSize: '40px'
                }}
              >
                <span className="fa fa-check"></span>
              </div>
              
              <h1 className="mb-3" style={{ fontWeight: '800', color: 'var(--color-primary)', fontSize: '2.5rem' }}>
                Thank You!
              </h1>
              
              <p className="mb-5" style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>
                Your enquiry has been received successfully. Our team will contact you soon.
              </p>
              
              <Link 
                to="/" 
                className="btn btn-primary py-3 px-5" 
                style={{ 
                  borderRadius: '50px', 
                  fontWeight: '700', 
                  background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)',
                  border: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 10px 20px rgba(75, 108, 183, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
