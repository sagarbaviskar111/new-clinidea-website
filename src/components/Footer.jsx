import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <style>{`
        .premium-footer {
          background-color: var(--color-primary);
          color: #e2e8f0;
          padding: 5rem 0 2rem;
          font-family: var(--font-sans);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.3fr 1fr 1.2fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .footer-brand img {
          height: 75px;
          margin-bottom: 1.5rem;
        }
        .footer-desc {
          color: #94a3b8;
          line-height: 1.6;
          max-width: 400px;
          margin-bottom: 2rem;
        }
        .footer-heading {
          color: var(--color-white);
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          letter-spacing: 0.5px;
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-links li {
          margin-bottom: 0.75rem;
        }
        .footer-links a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s ease;
          display: inline-flex;
          align-items: center;
        }
        .footer-links a:hover {
          color: var(--color-accent);
          transform: translateX(5px);
        }
        .footer-links i {
          margin-right: 10px;
          color: var(--color-accent);
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 2rem;
          text-align: center;
          color: #64748b;
          font-size: 0.9rem;
        }
        .newsletter-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 12px 15px;
          border-radius: 8px;
          width: 100%;
          margin-bottom: 15px;
          font-family: var(--font-sans);
        }
        .newsletter-input:focus {
          outline: none;
          border-color: var(--color-accent);
        }
        .newsletter-btn {
          background: var(--color-accent);
          color: #fff;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          width: 100%;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }
        .newsletter-btn:hover {
          background: #0b7a6f;
        }
        
        @media (max-width: 991px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }
      `}</style>
      <footer className="premium-footer">
        <div className="container">
          <div className="footer-grid">
            
            <div className="footer-col">
              <Link to="/" className="footer-brand">
                <img loading="lazy" src="/clinidea Logo/Clinidea_Education_Logo_footer.webp" alt="Clinidea Education" />
              </Link>
              <p className="footer-desc">
                Empowering the next generation of life sciences professionals with industry-leading insights and career-focused mentorship in Clinical Research, Pharmacovigilance, and Data Management.
              </p>
            </div>
            
            <div className="footer-col">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/program">All Courses</Link></li>
                <li><Link to="/placements">Placements</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/blogs">Blogs</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Our Courses</h3>
              <ul className="footer-links">
                <li><Link to="/clinical-research-pharmacovigilance-course">Clinical Research & Pharmacovigilance</Link></li>
                <li><Link to="/clinical-research-data-management-course">Clinical Research & Data Management</Link></li>
                <li><Link to="/clinical-research-cr-pv-dm-course">Clinical Research, Pharmacovigilance & Data Management</Link></li>
                <li><Link to="/clinical-research-regulatory-affairs-course">Clinical Research & Regulatory Affairs</Link></li>
                <li><Link to="/clinical-research-medical-writing-course">Clinical Research & Medical Writing</Link></li>
                <li><Link to="/clinical-research-medical-coding-course">Clinical Research & Medical Coding</Link></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h3 className="footer-heading">Contact Us</h3>
              <ul className="footer-links">
                <li>
                  <a href="mailto:admin@clinidea.in">
                    <i className="fa fa-envelope"></i> admin@clinidea.in
                  </a>
                </li>
                <li>
                  <a href="tel:+918999213129">
                    <i className="fa fa-phone"></i> +91 8999213129
                  </a>
                </li>
                <li>
                  <span style={{ color: '#94a3b8', display: 'flex' }}>
                    <i className="fa fa-map-marker" style={{ marginTop: '5px', marginRight: '10px', color: 'var(--color-accent)' }}></i>
                    Pune, Maharashtra, India
                  </span>
                </li>
              </ul>
              <div style={{ marginTop: '1.5rem' }}>
                <Link to="/login" className="newsletter-btn" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center', backgroundColor: '#ffffff', color: 'var(--color-primary)' }}>
                  <i className="fa fa-user-graduate" style={{ marginRight: '8px' }}></i> LMS Login
                </Link>
              </div>
            </div>
            
            <div className="footer-col">
              <h3 className="footer-heading">Stay Updated</h3>
              <p className="footer-desc" style={{ marginBottom: '15px' }}>
                Subscribe to our newsletter for the latest updates.
              </p>
              <form onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Email Address" className="newsletter-input" required />
                <button type="submit" className="newsletter-btn">Subscribe <i className="fa fa-paper-plane" style={{ marginLeft: '5px' }}></i></button>
              </form>
            </div>
            
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Clinidea Education. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
