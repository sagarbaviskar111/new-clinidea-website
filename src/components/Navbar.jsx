import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <style>{`
        .premium-navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.3s ease;
          background: ${isScrolled ? 'rgba(255, 255, 255, 0.85)' : '#ffffff'};
          backdrop-filter: ${isScrolled ? 'blur(16px)' : 'none'};
          -webkit-backdrop-filter: ${isScrolled ? 'blur(16px)' : 'none'};
          box-shadow: ${isScrolled ? '0 10px 40px rgba(0,0,0,0.04)' : 'none'};
          border-bottom: ${isScrolled ? '1px solid rgba(255,255,255,0.3)' : '1px solid var(--color-border)'};
        }
        .nav-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 15px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo img {
          height: 50px;
          transition: height 0.3s ease;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .nav-link {
          color: var(--color-primary);
          font-weight: 600;
          font-size: 1.05rem;
          text-decoration: none;
          transition: color 0.2s ease;
          position: relative;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--color-accent);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0%;
          height: 2px;
          background-color: var(--color-accent);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after, .nav-link.active::after {
          width: 100%;
        }
        .hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          color: var(--color-primary);
        }
        @media (max-width: 991px) {
          .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: #fff;
            flex-direction: column;
            padding: 2rem;
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
            gap: 1.5rem;
          }
          .nav-links.mobile-active {
            display: flex;
          }
          .hamburger {
            display: block;
          }
          .nav-logo img {
            height: 40px;
          }
          .top-bar {
            display: none !important;
          }
          .premium-navbar.scrolled {
            top: 0;
          }
        }
        .top-bar {
          background-color: var(--color-primary);
          color: rgba(255,255,255,0.9);
          padding: 8px 0;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .top-bar-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .top-contact {
          display: flex;
          gap: 20px;
        }
        .top-contact a {
          color: rgba(255,255,255,0.9);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .top-contact a:hover {
          color: var(--color-accent);
        }
        .top-socials {
          display: flex;
          gap: 15px;
        }
        .top-socials a {
          color: rgba(255,255,255,0.9);
          transition: color 0.2s ease;
        }
        .top-socials a:hover {
          color: var(--color-accent);
        }
        .premium-enroll-btn {
          background: linear-gradient(135deg, var(--color-accent) 0%, #0b7a6f 100%);
          color: #fff !important;
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(13, 148, 136, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .premium-enroll-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(13, 148, 136, 0.4);
        }
        .premium-navbar.scrolled {
          top: -40px; /* Hide top bar when scrolled */
        }
      `}</style>

      <header className={`premium-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="top-bar">
          <div className="top-bar-container">
            <div className="top-contact">
              <a href="mailto:admin@clinidea.in"><i className="fa fa-envelope"></i> admin@clinidea.in</a>
              <a href="tel:+918999213129"><i className="fa fa-phone"></i> +91 8999213129</a>
            </div>
            <div className="top-socials">
              <a href="https://www.linkedin.com/company/clinideaeducation" target="_blank" rel="noreferrer"><i className="fa fa-linkedin"></i></a>
              <a href="https://www.instagram.com/clinidea_education" target="_blank" rel="noreferrer"><i className="fa fa-instagram"></i></a>
              <a href="https://www.youtube.com/channel/UCVM8AaVYBdMiIpRyvsfcqZg" target="_blank" rel="noreferrer"><i className="fa fa-youtube-play"></i></a>
            </div>
          </div>
        </div>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <img loading="lazy" src="/clinidea Logo/Clinidea_Education_Logo_header.webp" alt="Clinidea Education Logo" />
          </Link>
          
          <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <i className={`fa ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          <div className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About Us</Link>
            <Link to="/program" className={`nav-link ${location.pathname === '/program' || location.pathname.includes('course') || location.pathname.includes('clinical') ? 'active' : ''}`}>Courses</Link>
            <Link to="/events" className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}>Events</Link>
            <Link to="/blogs" className={`nav-link ${location.pathname === '/blogs' ? 'active' : ''}`}>Blogs</Link>
            <Link to="/placements" className={`nav-link ${location.pathname === '/placements' ? 'active' : ''}`}>Placements</Link>
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
          </div>
        </div>
      </header>
      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div style={{ height: '90px' }}></div>
    </>
  );
};

export default Navbar;
