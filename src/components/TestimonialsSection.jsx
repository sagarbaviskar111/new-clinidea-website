import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    fetch(`${BASE_URL}/api/testimonials`)
      .then(res => {
        if (!res.ok) throw new Error("Not OK");
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) return res.json();
        return [];
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        }
      })
      .catch(err => console.error('Failed to load testimonials', err));
  }, []);

  if (testimonials.length === 0) return null;

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 3);
  };

  return (
    <section className="testimonials-section py-5" style={{ background: 'var(--color-bg-light)', borderTop: '1px solid var(--color-border)' }}>
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-md-8 text-center">
            <span className="badge mb-3" style={{ background: 'rgba(13, 148, 136, 0.1)', color: 'var(--color-accent)', padding: '8px 20px', borderRadius: '30px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
              <i className="fa fa-star me-2"></i> Student Success Stories
            </span>
            <h2 className="fw-bold" style={{ color: 'var(--color-primary)', fontSize: '2.5rem' }}>What Our Students Say</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
              Discover how Clinidea Education has transformed careers and helped professionals achieve their dreams in the healthcare industry.
            </p>
          </div>
        </div>

        <div className="row justify-content-center pb-4">
          <div className="col-lg-10 col-xl-8">
            {testimonials.slice(0, visibleCount).map((t) => (
              <div 
                key={t.id}
                className="testimonial-card p-4 p-md-5 d-flex flex-column mb-4" 
                style={{ 
                  background: '#fff', 
                  borderRadius: '20px', 
                  border: '1px solid var(--color-border)', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={e => {e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 15px 35px rgba(0,0,0,0.08)'}} 
                onMouseLeave={e => {e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 10px 30px rgba(0,0,0,0.03)'}}
              >
                <div className="d-flex align-items-center mb-4">
                  {t.imageUrl ? (
                    <img loading="lazy" 
                      src={t.imageUrl.startsWith('http') ? t.imageUrl : `${BASE_URL}/${t.imageUrl.replace(/^\/+/, '')}`} 
                      alt={t.studentName} 
                      style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(13, 148, 136, 0.2)' }}
                    />
                  ) : (
                    <div 
                      className="d-flex align-items-center justify-content-center fw-bold" 
                      style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--color-secondary)', fontSize: '1.8rem', border: '3px solid rgba(2, 132, 199, 0.2)' }}
                    >
                      {t.studentName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="ms-4">
                    <h5 className="mb-0 fw-bold" style={{ color: 'var(--color-primary)', fontSize: '1.3rem' }}>{t.studentName}</h5>
                    <div style={{ color: '#F59E0B', fontSize: '1rem', marginTop: '4px' }}>
                      {[...Array(5)].map((star, i) => (
                        <i key={i} className={`fa fa-star ${i < t.rating ? '' : 'text-muted opacity-25'}`}></i>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-grow-1 position-relative mt-2">
                  <i className="fa fa-quote-left position-absolute" style={{ fontSize: '3rem', color: 'rgba(0,0,0,0.03)', top: '-15px', left: '-15px', zIndex: 0 }}></i>
                  <p className="position-relative" style={{ color: 'var(--color-text-dark)', lineHeight: 1.8, fontStyle: 'italic', zIndex: 1, fontSize: '1.1rem' }}>
                    "{t.reviewText}"
                  </p>
                </div>
              </div>
            ))}

            {visibleCount < testimonials.length && (
              <div className="text-center mt-4">
                <button 
                  onClick={handleShowMore} 
                  className="btn px-4 py-2" 
                  style={{ 
                    background: 'var(--color-primary)', 
                    color: '#fff', 
                    borderRadius: '30px', 
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(15, 23, 42, 0.2)' 
                  }}
                >
                  Show More Reviews <i className="fa fa-angle-down ms-2"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
