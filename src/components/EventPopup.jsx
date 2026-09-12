import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

const EventPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    if (isExcludedRoute) return;

    // Check sessionStorage so it shows once per session
    const lastShown = sessionStorage.getItem('event_popup_last_shown');
    if (lastShown) return;

    // Fetch upcoming event
    fetch(`${BASE_URL}/api/events`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Get the nearest upcoming event (including today's events)
          const upcoming = data.filter(e => new Date(e.eventDate).getTime() >= today.getTime())
                               .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))[0];
          
          if (upcoming) {
            setEventData(upcoming);
            
            // Show popup after 3 seconds of page load
            setTimeout(() => {
              // Ensure we don't conflict with Enquiry Popup if it's currently open
              const enquiryPopup = document.querySelector('.enquiry-popup-overlay.active:not(.event-popup-active)');
              if (!enquiryPopup) {
                setIsOpen(true);
                sessionStorage.setItem('event_popup_last_shown', 'true');
              }
            }, 3000);
          }
        }
      })
      .catch(err => console.error("Event fetch error", err));

  }, [isExcludedRoute]);

  if (!isOpen || !eventData) return null;

  return (
    <div className="enquiry-popup-overlay event-popup-active active" style={{ zIndex: 1060 }}>
      <div className="enquiry-popup-content" style={{ maxWidth: '500px', width: '95%', maxHeight: '80vh', overflowY: 'auto', padding: '0', margin: '0 auto', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <button 
          className="enquiry-popup-close" 
          onClick={() => setIsOpen(false)}
          title="Close"
          style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
        >
          &times;
        </button>
        
        {eventData.imageUrl && (
          <div style={{ width: '100%', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <img loading="lazy" src={eventData.imageUrl.startsWith('http') ? eventData.imageUrl : `${BASE_URL}${eventData.imageUrl}`} alt={eventData.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }} />
          </div>
        )}
        
        <div style={{ padding: '20px', paddingBottom: '25px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span className="badge" style={{ backgroundColor: '#eef2ff', color: 'var(--color-secondary)', padding: '6px 10px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '10px', display: 'inline-block', alignSelf: 'flex-start' }}>
            UPCOMING {eventData.eventType ? eventData.eventType.toUpperCase() : 'EVENT'}
          </span>
          <h3 style={{ marginBottom: '10px', color: 'var(--color-primary)', fontWeight: '800', fontSize: '1.25rem' }}>{eventData.title}</h3>
          
          <div className="mb-3 text-muted" style={{ fontSize: '0.85rem' }}>
            <div className="mb-1"><span className="fa fa-calendar mr-2" style={{ color: 'var(--color-secondary)' }}></span> {new Date(eventData.eventDate).toLocaleDateString()}</div>
            <div><span className="fa fa-clock-o mr-2" style={{ color: 'var(--color-secondary)' }}></span> {eventData.eventTime}</div>
          </div>
          
          <div onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer', marginBottom: '20px' }}>
            <p style={{ 
              color: '#666', 
              fontSize: '0.9rem', 
              marginBottom: '5px', 
              display: isExpanded ? 'block' : '-webkit-box', 
              WebkitLineClamp: isExpanded ? 'unset' : 2, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden'
            }}>
              {eventData.description}
            </p>
            {eventData.description && eventData.description.length > 80 && (
              <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {isExpanded ? 'Show Less' : 'View Full Details...'}
              </span>
            )}
          </div>
          
          <div className="d-flex flex-column flex-sm-row gap-2 mt-auto pb-2">
             <button onClick={() => { setIsOpen(false); navigate('/events'); }} className="btn btn-primary w-100 py-2" style={{ background: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
               Register Now
             </button>
             <button onClick={() => setIsOpen(false)} className="btn btn-outline-secondary w-100 py-2" style={{ borderRadius: '8px', fontWeight: 'bold' }}>
               Maybe Later
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventPopup;
