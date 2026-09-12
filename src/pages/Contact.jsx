import React, { useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import EnquiryForm from '../components/EnquiryForm';

const Contact = () => {
  useEffect(() => {
    if (window.initializeTheme) window.initializeTheme(window.jQuery);
  }, []);

  return (
    <>
      <SEOHead
        title="Contact Us | Admissions & Inquiries | Clinidea Education"
        description="Get in touch with Clinidea Education. Reach out to our career counselors, join our WhatsApp group, or contact us for clinical research course admissions."
        canonical="https://clinidea.in/contact"
        ogImage="https://clinidea.in/images/about.webp"
      />
      {/* Hero Section */}
      <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: 'url(/images/bg_2.webp)' }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end">
            <div className="col-md-9 pb-5">
              <p className="breadcrumbs mb-2"><span className="mr-2"><a href="/index">Home <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></a></span> <span>Contact <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></span></p>
              <h1 className="mb-0 bread">Get in Touch</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5 contact">
    <div className="bg-white p-4 p-md-5 rounded shadow-lg">
      <div className="text-center mb-5">
        <h1 className="font-weight-bold" style={{ color: 'var(--color-primary)' }}>Get in Touch</h1>
        <p className="text-muted" style={{ fontSize: '1.2rem' }}>We're here to guide your career. Reach out or join our community today!</p>
      </div>

      <div className="row justify-content-center mb-5">
        {/* WhatsApp Card */}
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card-premium p-4 text-center h-100 border-0" style={{ cursor: 'pointer' }} onClick={() => window.open('https://wa.me/918999213129', '_blank')}>
            <div className="mb-3 d-flex align-items-center justify-content-center mx-auto" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#25D366', color: 'white', fontSize: '28px' }}>
              <i className="fa fa-whatsapp"></i>
            </div>
            <h4 className="font-weight-bold" style={{color: 'var(--color-primary)'}}>WhatsApp</h4>
            <p className="text-muted mb-2">Instant Chat Support</p>
            <p className="font-weight-bold text-dark" style={{ fontSize: '1.1rem' }}>+91 8999213129</p>
            <span className="text-success small font-weight-bold">Chat Now &rarr;</span>
          </div>
        </div>

        {/* Email Card */}
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card-premium p-4 text-center h-100 border-0" style={{ cursor: 'pointer' }} onClick={() => window.location.href='mailto:admin@clinidea.in'}>
            <div className="mb-3 d-flex align-items-center justify-content-center mx-auto" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)', color: 'white', fontSize: '24px' }}>
              <i className="fa fa-envelope"></i>
            </div>
            <h4 className="font-weight-bold" style={{color: 'var(--color-primary)'}}>Email</h4>
            <p className="text-muted mb-2">General & Admission</p>
            <p className="font-weight-bold text-dark" style={{ fontSize: '1.1rem' }}>admin@clinidea.in</p>
            <span className="small font-weight-bold" style={{color: 'var(--color-secondary)'}}>Email Us &rarr;</span>
          </div>
        </div>

        {/* Working Hours Card */}
        <div className="col-lg-4 col-md-12 mb-4">
          <div className="card-premium p-4 text-center h-100 border-0">
            <div className="mb-3 d-flex align-items-center justify-content-center mx-auto" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '24px' }}>
              <i className="fa fa-clock-o"></i>
            </div>
            <h4 className="font-weight-bold" style={{color: 'var(--color-primary)'}}>Working Hours</h4>
            <p className="text-muted mb-2">We are open</p>
            <p className="font-weight-bold text-dark mb-0" style={{ fontSize: '1.2rem' }}>24 × 7</p>
            <p className="font-weight-bold mt-1" style={{color: 'var(--color-accent)'}}>Always Available</p>
          </div>
        </div>
      </div>

      <div className="text-center mb-5">
        <h3 className="font-weight-bold mb-4" style={{ color: 'var(--color-primary)' }}>Connect on Social Media</h3>
        <div className="d-flex justify-content-center flex-wrap" style={{ gap: '15px' }}>
          <a href="https://www.instagram.com/clinidea_education" target="_blank" className="btn btn-lg shadow-sm text-white" style={{ backgroundColor: '#E1306C', borderRadius: '30px', padding: '12px 30px', fontWeight: '600' }}>
            <i className="fa fa-instagram mr-2"></i> Instagram
          </a>
          <a href="https://www.linkedin.com/company/clinideaeducation" target="_blank" className="btn btn-lg shadow-sm text-white" style={{ backgroundColor: '#0077B5', borderRadius: '30px', padding: '12px 30px', fontWeight: '600' }}>
            <i className="fa fa-linkedin mr-2"></i> LinkedIn
          </a>
          <a href="https://www.youtube.com/channel/UCVM8AaVYBdMiIpRyvsfcqZg" target="_blank" className="btn btn-lg shadow-sm text-white" style={{ backgroundColor: '#FF0000', borderRadius: '30px', padding: '12px 30px', fontWeight: '600' }}>
            <i className="fa fa-youtube-play mr-2"></i> YouTube
          </a>
        </div>
      </div>

      <div className="text-center mb-5 mt-5">
        <h3 className="font-weight-bold mb-4" style={{ color: 'var(--color-primary)' }}>Join Our Community</h3>
        <div className="d-flex justify-content-center flex-wrap" style={{ gap: '20px' }}>
          {/* WhatsApp Group */}
          <a href="https://chat.whatsapp.com/FdjVRzRkl9e9OLi3ItW6SZ" target="_blank" className="card-premium p-3 text-center border-0 text-decoration-none" style={{ minWidth: '220px' }}>
            <div className="mb-2 d-flex align-items-center justify-content-center mx-auto" style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#25D366', color: 'white', fontSize: '24px' }}>
              <i className="fa fa-users"></i>
            </div>
            <h5 className="font-weight-bold mb-1" style={{color: 'var(--color-primary)'}}>WhatsApp Group</h5>
            <span className="text-success small font-weight-bold">Join Group &rarr;</span>
          </a>

          {/* WhatsApp Channel */}
          <a href="https://whatsapp.com/channel/0029Vb7rDON17Emym6DTR80e" target="_blank" className="card-premium p-3 text-center border-0 text-decoration-none" style={{ minWidth: '220px' }}>
            <div className="mb-2 d-flex align-items-center justify-content-center mx-auto" style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#25D366', color: 'white', fontSize: '24px' }}>
              <i className="fa fa-bullhorn"></i>
            </div>
            <h5 className="font-weight-bold mb-1" style={{color: 'var(--color-primary)'}}>WhatsApp Channel</h5>
            <span className="text-success small font-weight-bold">Follow Channel &rarr;</span>
          </a>
        </div>
      </div>

      <hr className="my-5" style={{ borderColor: '#e9ecef' }} />

      <div className="row justify-content-between align-items-center">
        <div className="col-lg-5 mb-5 mb-lg-0">
          <h2 className="font-weight-bold mb-3" style={{ color: 'var(--color-primary)' }}>Send us a Message</h2>
          <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>Have specific questions about our courses or placements? Fill out the form and our career counselors will get in touch with you shortly.</p>
          

          <div className="mt-4 rounded overflow-hidden shadow-sm border">
            <iframe 
              src="https://maps.google.com/maps?q=Pune,%20Maharashtra&t=&z=13&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="350" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Clinidea Education Location">
            </iframe>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="bg-white p-4 rounded border shadow-sm" style={{ position: 'relative' }}>
            <EnquiryForm />
          </div>
        </div>
      </div>

    </div>
  </div>

  
  
</>
  );
};

export default Contact;
