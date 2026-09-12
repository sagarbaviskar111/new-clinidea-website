import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';
import StudentReviewVideos from '../components/StudentReviewVideos';

const PlacementsPage = () => {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    fetch(`${BASE_URL}/api/placements`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPlacements(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load placements', err);
        setLoading(false);
      });
  }, []);

  // Simple CSS for the lightbox
  const lightboxStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: lightboxImage ? 1 : 0,
    pointerEvents: lightboxImage ? 'auto' : 'none',
    transition: 'opacity 0.3s ease',
    padding: '20px'
  };

  const closeBtnStyle = {
    position: 'absolute',
    top: '20px',
    right: '30px',
    color: '#fff',
    fontSize: '40px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    zIndex: 10000
  };

  return (
    <>
      <Helmet>
        <title>Recent Placements | Student Placements & Wall of Fame | Clinidea Education</title>
        <meta name="description" content="Explore our wall of fame! See the recent placements of our successful students at top healthcare and life science companies." />
        <meta name="keywords" content="Clinidea Education placements, student success stories, pharma placement record, clinical research jobs freshers" />
        <link rel="canonical" href="https://clinidea.in/placements" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Recent Placements | Wall of Fame | Clinidea Education" />
        <meta property="og:description" content="See our student success stories and recent placements at top-tier healthcare & CRO companies." />
        <meta property="og:url" content="https://clinidea.in/placements" />
        <meta property="og:image" content="https://clinidea.in/images/about.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Recent Placements | Clinidea Education" />
        <meta name="twitter:description" content="See our student success stories and recent placements at top-tier healthcare & CRO companies." />
        <meta name="twitter:image" content="https://clinidea.in/images/about.webp" />
      </Helmet>

      {/* Hero Section */}
      <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: 'url(/images/bg_2.webp)' }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end">
            <div className="col-md-9 pb-5">
              <p className="breadcrumbs mb-2"><span className="mr-2"><a href="/index">Home <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></a></span> <span>Placements <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></span></p>
              <h1 className="mb-0 bread">Our Recent Placements</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Placements Grid Section */}
      <section className="ftco-section bg-light py-5">
        <div className="container">
          <div className="row justify-content-center mb-5 pb-3">
            <div className="col-md-8 text-center heading-section">
              <span className="subheading" style={{ color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Wall of Fame</span>
              <h2 className="mb-4" style={{ color: 'var(--color-primary)', fontWeight: 800 }}>Student Success Stories</h2>
              <p className="text-muted" style={{ fontSize: '1.1rem' }}>Click on any poster to view the full placement details.</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="mt-3 text-muted fw-bold">Loading Placement Records...</p>
            </div>
          ) : placements.length > 0 ? (
            <>
              <div className="row g-4 justify-content-center">
                {placements.slice(0, visibleCount).map(p => (
                  <div key={p.id} className="col-11 col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div 
                      className="placement-card-grid"
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(13, 148, 136, 0.1)',
                        background: '#fff'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(13, 148, 136, 0.2)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                      }}
                      onClick={() => setLightboxImage(p.imageUrl.startsWith('http') ? p.imageUrl : `${BASE_URL}/${p.imageUrl.replace(/^\/+/, '')}`)}
                    >
                      <div style={{ position: 'relative', width: '100%', background: '#f8f9fa' }}>
                        <span className="badge bg-primary" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, opacity: 0.9 }}>Hired</span>
                        <img loading="lazy" src={p.imageUrl.startsWith('http') ? p.imageUrl : `${BASE_URL}/${p.imageUrl.replace(/^\/+/, '')}`} 
                          alt={p.studentName} 
                          style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {visibleCount < placements.length && (
                <div className="text-center mt-5">
                  <button 
                    className="btn btn-primary px-5 py-3 fw-bold shadow-sm" 
                    onClick={() => setVisibleCount(prev => prev + 8)}
                    style={{ borderRadius: '50px', fontSize: '1.1rem' }}
                  >
                    Load More Placements <i className="fa fa-refresh ms-2"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <i className="fa fa-image text-muted opacity-25" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-4 text-muted">More placements being updated soon!</h4>
            </div>
          )}
        </div>
      </section>

      <StudentReviewVideos />

      {/* Lightbox Modal */}
      <div style={lightboxStyle} onClick={() => setLightboxImage(null)}>
        {lightboxImage && (
          <>
            <button style={closeBtnStyle} onClick={() => setLightboxImage(null)}>&times;</button>
            <img loading="lazy" 
              src={lightboxImage} 
              alt="Placement Poster" 
              style={{ 
                maxHeight: '90vh', 
                maxWidth: '90vw', 
                objectFit: 'contain',
                borderRadius: '10px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                transition: 'transform 0.3s ease'
              }} 
              onClick={(e) => e.stopPropagation()} 
            />
          </>
        )}
      </div>
    </>
  );
};

export default PlacementsPage;
