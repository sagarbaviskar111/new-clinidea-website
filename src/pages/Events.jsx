import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';
import EventRegistrationForm from '../components/EventRegistrationForm';

const EventCountdown = ({ targetDate, targetTime }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: false });

  useEffect(() => {
    if (!targetDate || !targetTime) return;
    const datePart = new Date(targetDate).toISOString().split('T')[0];
    const target = new Date(`${datePart}T${targetTime}:00`).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          isLive: false
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  if (timeLeft.isLive) {
    return <div className="text-success fw-bold" style={{ animation: 'blink 1s linear infinite' }}>● Live Now</div>;
  }

  return (
    <div className="d-flex gap-2 text-center text-muted small fw-bold">
      <div className="bg-light p-1 rounded" style={{ minWidth: '35px' }}><span>{timeLeft.days}</span>d</div>
      <div className="bg-light p-1 rounded" style={{ minWidth: '35px' }}><span>{timeLeft.hours}</span>h</div>
      <div className="bg-light p-1 rounded" style={{ minWidth: '35px' }}><span>{timeLeft.minutes}</span>m</div>
      <div className="bg-light p-1 rounded" style={{ minWidth: '35px' }}><span>{timeLeft.seconds}</span>s</div>
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE_URL}/api/events`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if(Array.isArray(data)) {
           setEvents(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch events:", err);
        setLoading(false);
      });
  }, []);

  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  const handleShare = (event) => {
    const shareText = `Check out this upcoming event: ${event.title} on ${new Date(event.eventDate).toLocaleDateString()} at ${event.eventTime}.`;
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: shareText,
        url: shareUrl,
      }).catch(err => console.log('Error sharing', err));
    } else {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div>
      
      <Helmet>
        <title>Upcoming Events & Webinars | Clinidea Education</title>
        <meta name="description" content="Join our upcoming healthcare and clinical research events, webinars, and demo sessions. Learn from industry experts and boost your career." />
        <meta name="keywords" content="Clinical Research webinars, Pharmacovigilance events, Healthcare career seminars" />
        <link rel="canonical" href="https://clinidea.in/events" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Upcoming Events & Webinars | Clinidea Education" />
        <meta property="og:description" content="Join our upcoming healthcare and clinical research events, webinars, and demo sessions." />
        <meta property="og:url" content="https://clinidea.in/events" />
        <meta property="og:image" content="https://clinidea.in/images/about.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Upcoming Events & Webinars | Clinidea Education" />
        <meta name="twitter:description" content="Join our upcoming healthcare and clinical research events, webinars, and demo sessions." />
        <meta name="twitter:image" content="https://clinidea.in/images/about.webp" />
      </Helmet>

      {/* Hero Section */}
      <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: 'url(/images/bg_2.webp)' }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end">
            <div className="col-md-9 pb-5">
              <p className="breadcrumbs mb-2"><span className="mr-2"><a href="/index">Home <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></a></span> <span>Events <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></span></p>
              <h1 className="mb-0 bread">Upcoming Events & Webinars</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section bg-light" style={{ minHeight: '80vh', padding: '4em 0' }}>
        <div className="container">
          <div className="row justify-content-center pb-5 mb-3">
            <div className="col-md-7 heading-section text-center">
              <h2 style={{ fontWeight: '800', color: 'var(--color-primary)' }}>Upcoming Events</h2>
              <span className="subheading">Webinars, Demos, and Quizzes</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center" style={{fontSize: '1.2rem', color: 'var(--color-text-muted)'}}>No upcoming events at the moment. Please check back later.</div>
          ) : (
            <div className="row justify-content-center">
              {events.map(event => (
                <div key={event.id} className="col-11 col-sm-10 col-md-6 col-lg-4 d-flex align-items-stretch mb-4 mb-lg-5">
                  <div className="card-premium border-0 h-100 shadow-sm rounded-4 overflow-hidden" style={{ display: 'flex', flexDirection: 'column', width: '100%', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; }}
                  >
                    {event.imageUrl && (
                      <div style={{ width: '100%', backgroundColor: '#f8f9fa' }}>
                        <img loading="lazy" src={event.imageUrl.startsWith('http') ? event.imageUrl : `${BASE_URL}${event.imageUrl}`} alt={event.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    )}
                    <div className="card-body p-4 p-md-4 d-flex flex-column" style={{ flexGrow: 1 }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge" style={{ backgroundColor: 'rgba(30, 94, 255, 0.05)', color: 'var(--color-secondary)', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {event.eventType ? event.eventType.toUpperCase() : 'EVENT'}
                        </span>
                        <EventCountdown targetDate={event.eventDate} targetTime={event.eventTime} />
                      </div>
                      <h4 className="card-title" style={{ fontWeight: '700', color: 'var(--color-primary)' }}>{event.title}</h4>
                      <div className="mb-3 text-muted" style={{ fontSize: '0.9rem' }}>
                        <div className="mb-1"><span className="fa fa-calendar mr-2" style={{ color: 'var(--color-secondary)' }}></span> {new Date(event.eventDate).toLocaleDateString()}</div>
                        <div><span className="fa fa-clock-o mr-2" style={{ color: 'var(--color-secondary)' }}></span> {event.eventTime}</div>
                      </div>
                      <p className="card-text mb-4 flex-grow-1" style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '5px', whiteSpace: 'pre-wrap' }}>{event.description}</p>
                      
                      <div className="mt-auto d-flex flex-column gap-2">
                        {event.youtubeUrl && (
                          <a href={event.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-danger w-100 py-2 d-flex justify-content-center align-items-center" style={{ borderRadius: '8px', fontWeight: 'bold' }}>
                            <span className="fa fa-youtube-play mr-2" style={{ fontSize: '1.2rem' }}></span> Watch Teaser
                          </a>
                        )}
                        <div className="d-flex gap-2 mt-3">
                          {event.eventType === 'quiz' ? (
                            <button 
                              onClick={() => navigate(`/take-quiz/${event.id}`)}
                              className="btn flex-grow-1"
                              style={{
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                color: 'white',
                                borderRadius: '10px',
                                fontWeight: 'bold',
                                border: 'none',
                                padding: '10px 0',
                                boxShadow: '0 4px 15px rgba(30, 94, 255, 0.2)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 94, 255, 0.3)'; }}
                              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(30, 94, 255, 0.2)'; }}
                            >
                              Take Quiz
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleRegisterClick(event)} 
                              className="btn flex-grow-1"
                              style={{
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                color: 'white',
                                borderRadius: '10px',
                                fontWeight: 'bold',
                                border: 'none',
                                padding: '10px 0',
                                boxShadow: '0 4px 15px rgba(30, 94, 255, 0.2)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 94, 255, 0.3)'; }}
                              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(30, 94, 255, 0.2)'; }}
                            >
                              Register Now
                            </button>
                          )}
                          <button 
                            onClick={() => handleShare(event)} 
                            className="btn d-flex justify-content-center align-items-center" 
                            style={{ 
                              borderRadius: '10px', 
                              backgroundColor: '#f8f9fa',
                              color: 'var(--color-primary)',
                              border: '1px solid #e9ecef',
                              width: '50px',
                              padding: '0',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                              transition: 'all 0.2s ease'
                            }} 
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#e9ecef'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)'; }}
                            title="Share Event"
                          >
                            <span className="fa fa-share-alt" style={{ fontSize: '1.2rem' }}></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Registration Modal Overlay */}
      <EventRegistrationForm event={selectedEvent} onClose={handleCloseModal} />

      
      <footer className="footer bg-dark">
        <div className="container-fluid px-lg-5">
          <div className="row">
            <div className="col-md-12 py-4 text-center text-white">
              <p className="mb-0">&copy; {new Date().getFullYear()} Clinidea Education. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Events;
