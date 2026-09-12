import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import EnquiryForm from './EnquiryForm';

const PopupEnquiryForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialCourse, setInitialCourse] = useState('');
  const location = useLocation();

  const path = location.pathname.toLowerCase();
  
  // Disable popup on admin, login, student LMS, and payment routes
  const isExcludedRoute = 
    path.startsWith('/admin') || 
    path.startsWith('/login') || 
    path.startsWith('/student') ||
    path.startsWith('/dashboard') ||
    path.startsWith('/register') ||
    path.startsWith('/enroll') ||
    path.startsWith('/live');

  useEffect(() => {
    const handleOpenEnquiry = (e) => {
      if (e.detail && e.detail.course) {
        setInitialCourse(e.detail.course);
      } else {
        setInitialCourse('');
      }
      setIsOpen(true);
    };
    window.addEventListener('open-enquiry-modal', handleOpenEnquiry);
    return () => window.removeEventListener('open-enquiry-modal', handleOpenEnquiry);
  }, []);

  useEffect(() => {
    if (isExcludedRoute) return;

    if (!sessionStorage.getItem('enq_first_visit')) {
      sessionStorage.setItem('enq_first_visit', Date.now().toString());
    }

    const checkPopupTiming = () => {
      // Prevent stacking if another major modal is open (like Event popup)
      if (document.querySelector('.event-popup-active')) return;

      const firstVisit = parseInt(sessionStorage.getItem('enq_first_visit') || '0', 10);
      const lastShown = parseInt(sessionStorage.getItem('enq_last_shown') || '0', 10);
      const now = Date.now();

      if (lastShown === 0) {
        // First time showing: 20 seconds (20000ms) after first visit
        if (now - firstVisit >= 20000) {
          setIsOpen(true);
          sessionStorage.setItem('enq_last_shown', now.toString());
        }
      } else {
        // Subsequent showings: 4 minutes (240000ms) after last closed/shown
        if (now - lastShown >= 240000) {
          setIsOpen(true);
          sessionStorage.setItem('enq_last_shown', now.toString());
        }
      }
    };

    // Run the checker every 5 seconds
    const timerInterval = setInterval(() => {
      if (!isOpen) {
        checkPopupTiming();
      }
    }, 5000);

    return () => clearInterval(timerInterval);
  }, [isExcludedRoute, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('enq_last_shown', Date.now().toString());
  };

  if (isExcludedRoute || !isOpen) return null;

  return (
    <div className="enquiry-popup-overlay active">
      <div className="enquiry-popup-content">
        <button 
          className="enquiry-popup-close" 
          onClick={handleClose}
          title="Close"
        >
          &times;
        </button>
        <h3 style={{ textAlign: 'center', marginBottom: '10px', color: 'var(--color-text-dark)', fontWeight: '700' }}>Enquiry Now</h3>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '20px', fontSize: '0.9rem' }}>
          Take the first step toward your life sciences career.
        </p>
        <EnquiryForm initialCourse={initialCourse} />
      </div>
    </div>
  );
};

export default PopupEnquiryForm;
