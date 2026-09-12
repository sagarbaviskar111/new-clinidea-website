import React, { useEffect, useState } from 'react';
import SEOHead from './SEOHead';
import CourseCTAs from './CourseCTAs';

const CoursePageLayout = ({
  seoTitle,
  seoDescription,
  pageUrl,
  courseTitle,
  courseSubtitle,
  courseDescription,
  modules,
  details,
  outcomes,
  faqs,
  keyHighlights,
  whyChooseUs,
  trainingApproach,
  targetAudience,
  youtubeUrl,
  ctaCourseName,
  courseData,
  heroImage
}) => {
  useEffect(() => {
    if (window.initializeTheme) window.initializeTheme(window.jQuery);
    window.scrollTo(0, 0);
  }, []);

  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFAQ = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?"'>\s]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : null;
  };
  const activeYoutubeUrl = courseData?.youtubeUrl || youtubeUrl;
  const embedUrl = getEmbedUrl(activeYoutubeUrl);

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonical={`https://clinidea.in${pageUrl}`}
        ogImage={heroImage ? `https://clinidea.in${heroImage}` : undefined}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": courseTitle || seoTitle,
            "description": courseDescription || seoDescription,
            "provider": {
              "@type": "Organization",
              "name": "Clinidea Education",
              "sameAs": "https://clinidea.in"
            },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": details?.mode?.includes('Online') ? 'Online' : 'Blended',
              "duration": details?.duration || 'P6M'
            }
          },
          ...(faqs && faqs.length > 0 ? [{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          }] : [])
        ]}
      />

      {/* Global Header */}




      {/* Modern Course Layout */}
      <style>{`
        .cr-modern-wrap {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: clamp(50px, 6vw, 100px) 0;
          color: var(--color-text-dark);
          font-family: var(--font-sans);
          overflow-x: hidden;
          width: 100%;
          position: relative;
        }
        .cr-modern-wrap::before {
          content: '';
          position: absolute;
          top: -150px;
          left: -150px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(255,255,255,0) 70%);
          z-index: 0;
        }
        .cr-modern-wrap::after {
          content: '';
          position: absolute;
          bottom: 10%;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(255,255,255,0) 70%);
          z-index: 0;
        }
        .container {
          position: relative;
          z-index: 1;
        }
        .cr-header-badge {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
          border: 1px solid rgba(79, 70, 229, 0.2);
          color: var(--color-secondary);
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 800;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          font-size: 13px;
          display: inline-block;
          margin-bottom: 25px;
          box-shadow: 0 4px 15px rgba(79, 70, 229, 0.15);
        }
        .cr-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 20px;
        }
        .cr-subtitle {
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          font-weight: 700;
          color: var(--color-text-dark);
          margin-bottom: 20px;
        }
        .cr-desc {
          font-size: clamp(1.1rem, 1.5vw, 1.25rem);
          color: #475569;
          font-weight: 500;
          max-width: 900px;
          margin: 0 auto 40px;
          line-height: 1.8;
        }
        .gradient-text {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .gradient-text-alt {
          background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .premium-glass-panel {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .premium-glass-panel:hover {
          box-shadow: 0 25px 50px rgba(79, 70, 229, 0.08);
          transform: translateY(-2px);
        }

        .glass-highlight-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 16px;
          padding: 16px 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          display: flex;
          align-items: center;
          height: 100%;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .glass-highlight-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(79, 70, 229, 0.1);
          border-color: rgba(79, 70, 229, 0.3);
        }
        .glass-highlight-icon {
          background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 1.5rem;
          margin-right: 15px;
        }
        .cr-module-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px 30px;
          border: 1px solid rgba(255,255,255,0.8);
          box-shadow: 0 15px 35px rgba(0,0,0,0.04);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-align: left;
        }
        .cr-module-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 25px 50px rgba(79, 70, 229, 0.12);
        }
        .cr-module-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(to right, var(--color-secondary), var(--color-accent));
        }
        .cr-module-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
          margin-top: 15px;
          text-align: left;
        }
        .cr-list {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: left;
        }
        .cr-list li {
          position: relative;
          padding-left: 30px;
          margin-bottom: 15px;
          line-height: 1.6;
          color: #4a5568;
          font-weight: 500;
          font-size: 1rem;
        }
        .cr-list li::before {
          content: '\u2713';
          position: absolute;
          left: 0;
          top: 0;
          color: #48bb78;
          font-size: 18px;
          font-weight: bold;
        }
        .cr-details-box {
          background: #fff;
          border-radius: 20px;
          padding: 30px;
          border: 1px solid var(--color-border);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          position: sticky;
          top: 100px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .cr-details-box::-webkit-scrollbar {
          width: 5px;
        }
        .cr-details-box::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .program-detail-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          padding: 35px 20px;
          border-radius: 24px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 15px 35px rgba(0,0,0,0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .program-detail-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
        }
        .program-detail-card .icon-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 5px 15px rgba(79, 70, 229, 0.1);
          border: 1px solid rgba(79, 70, 229, 0.2);
        }
        .program-detail-card .detail-icon {
          font-size: 2rem;
          margin: 0;
          line-height: 1;
        }
        .program-detail-card h4 {
          margin: 0 0 10px;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .program-detail-card p {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-text-dark);
          line-height: 1.5;
        }

        .outcome-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 24px;
          padding: 20px;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }
        .outcome-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.05);
          border-color: rgba(79, 70, 229, 0.3);
        }
        .outcome-card .outcome-icon {
          font-size: 36px;
          margin: 0 auto 15px;
          background: var(--color-bg-light);
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .outcome-card h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-dark);
        }
        .outcome-card p {
          margin: 0;
          color: var(--color-text-muted);
          font-size: 0.9rem;
          margin-top: 5px;
        }
        
        .video-container {
          background: #fff;
          border-radius: 24px;
          padding: 10px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
          margin-bottom: 40px;
        }
        .video-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 16px;
          background: #000;
        }
        
        .bottom-cta-box {
          background: linear-gradient(to right, #ffffff, #f8fafc);
          border-radius: 24px;
          padding: 50px 40px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
          border: 1px solid rgba(13, 148, 136, 0.15);
          text-align: center;
        }

        @media (max-width: 991px) {
          .cr-details-box {
            position: relative;
            top: 0;
            max-height: none;
            overflow-y: visible;
            margin-top: 20px;
          }
          .cr-modern-wrap { padding: 40px 0; }
        }
        @media (max-width: 768px) {
          .outcome-card { flex-direction: column; text-align: center; padding: 25px 20px; }
          .outcome-card .outcome-icon { margin-right: 0; margin-bottom: 15px; }
          .program-detail-card { padding: 20px 15px; margin-bottom: 15px; }
          .program-detail-card .icon-wrapper { width: 60px; height: 60px; margin-bottom: 15px; }
          .program-detail-card .detail-icon { font-size: 1.6rem; }
          .program-detail-card p { font-size: 1rem; }
          .bottom-cta-box { padding: 30px 20px; border-radius: 20px; }
          .cr-title { font-size: 2.2rem; }
        }
      
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .program-detail-horizontal {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }
        .program-detail-horizontal .program-detail-card {
          flex: 1 1 250px;
          max-width: 300px;
          margin-bottom: 0;
        }

        .faq-item {
          border-left: 4px solid transparent !important;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
          background: #fff;
        }
        .faq-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        .faq-item.active {
          border-left-color: var(--color-primary) !important;
          background-color: #fff !important;
        }
        @media (max-width: 768px) {
          .faq-question h4 {
            font-size: 1rem !important;
            line-height: 1.4;
          }
          .faq-toggle-icon {
            width: 32px !important;
            height: 32px !important;
          }
          .faq-answer p {
            font-size: 0.95rem !important;
          }
        }
  
      `}</style>
      <div className="cr-modern-wrap pt-5">
        <div className="container">
          {/* Header */}
          <div className="row mb-5 text-center fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="col-12 col-xl-10 offset-xl-1">
              <h2 className="cr-title gradient-text">{courseTitle}</h2>
              <p className="cr-desc">{courseDescription}</p>
            </div>
          </div>

          {/* Centered Single Column Layout */}
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10 text-center">

              {/* Why Choose Us & Key Highlights */}
              {(whyChooseUs || keyHighlights) && (
                <div className="mb-5 fade-in-up text-center premium-glass-panel" style={{ animationDelay: '0.2s', padding: 'clamp(30px, 5vw, 50px)' }}>
                  
                  {whyChooseUs && (
                    <div className="mb-4">
                      <h3 className="gradient-text mb-3" style={{ fontWeight: 900, fontSize: '2.2rem' }}>{whyChooseUs.title || 'Why Choose Us?'}</h3>
                      {whyChooseUs.description && (
                        <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.1rem', fontWeight: 500, maxWidth: '900px', margin: '0 auto' }}>
                          {whyChooseUs.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Highlights Grid */}
                  {keyHighlights && keyHighlights.length > 0 && (
                    <div className="row justify-content-center mt-4">
                      {keyHighlights.map((hl, idx) => (
                        <div key={idx} className="col-12 col-sm-6 col-lg-4 mb-3">
                          <div className="glass-highlight-card h-100 text-start">
                            <span className="glass-highlight-icon">✨</span>
                            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.4 }}>{hl}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fallback for whyChooseUs points if keyHighlights doesn't exist */}
                  {whyChooseUs && whyChooseUs.points && whyChooseUs.points.length > 0 && (!keyHighlights || keyHighlights.length === 0) && (
                     <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px', textAlign: 'left' }}>
                        {whyChooseUs.points.map((pt, idx) => (
                          <li key={idx} style={{ marginBottom: '15px', color: '#1e293b', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
                            <div style={{ background: 'rgba(72, 187, 120, 0.15)', color: '#48bb78', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '14px', flexShrink: 0 }}>✓</div>
                            {pt}
                          </li>
                        ))}
                     </ul>
                  )}
                </div>
              )}

              {/* Training Approach / Workflow Based Learning */}
              {trainingApproach && (
                <div className="mb-5 fade-in-up premium-glass-panel" style={{ animationDelay: '0.3s', padding: 'clamp(30px, 5vw, 50px)', textAlign: 'center' }}>
                   <div className="mb-5">
                     <span className="cr-header-badge" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--color-accent)', marginBottom: '15px' }}>Our Methodology</span>
                     <h3 className="gradient-text-alt mb-3" style={{ fontWeight: 900, fontSize: '2.2rem' }}>{trainingApproach.title}</h3>
                     <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.1rem', fontWeight: 500, maxWidth: '800px', margin: '0 auto' }}>{trainingApproach.description}</p>
                   </div>
                   
                   <div className="row text-start justify-content-center">
                     {trainingApproach.points.map((pt, idx) => {
                       const isObject = typeof pt === 'object' && pt !== null;
                       const title = isObject ? pt.title : pt;
                       const desc = isObject ? pt.desc : 'Master the essential practical aspects required by top industry recruiters.';
                       const icon = isObject ? pt.icon : '✦';
                       
                       return (
                         <div key={idx} className="col-12 col-md-6 col-lg-4 mb-4">
                           <div className="training-card" style={{
                             background: 'rgba(255, 255, 255, 0.6)',
                             border: '1px solid rgba(66, 153, 225, 0.2)',
                             borderRadius: '16px',
                             padding: '25px',
                             display: 'flex',
                             alignItems: 'center',
                             textAlign: 'center',
                             flexDirection: 'column',
                             height: '100%',
                             transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                             boxShadow: '0 5px 15px rgba(0,0,0,0.02)'
                           }}
                           onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(66, 153, 225, 0.15)'; e.currentTarget.style.borderColor = 'rgba(66, 153, 225, 0.4)'; }}
                           onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = 'rgba(66, 153, 225, 0.2)'; }}
                           >
                             <div style={{
                               width: '55px', height: '55px', borderRadius: '12px',
                               background: 'linear-gradient(135deg, rgba(66, 153, 225, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
                               color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                               fontSize: '26px', marginBottom: '20px', flexShrink: 0
                             }}>
                               {icon}
                             </div>
                             <div>
                               <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', marginBottom: '8px', lineHeight: 1.4, textAlign: 'center' }}>{title}</h4>
                               <p style={{ color: '#475569', fontSize: '0.95rem', margin: 0, fontWeight: 500, lineHeight: 1.5, textAlign: 'center' }}>
                                 {desc}
                               </p>
                             </div>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                </div>
              )}

              {/* Curriculum / Modules */}
              <div className="mb-5 fade-in-up" style={{ animationDelay: '0.4s' }}>
                <h3 className="mb-5" style={{ fontWeight: 800, color: 'var(--color-text-dark)', fontSize: '2rem', textAlign: 'center' }}>Course Curriculum & Modules</h3>
                <div className="row justify-content-center">
                  {modules && modules.map((mod, idx) => {
                    let iconObj = { icon: '🔬' };
                    const titleLower = mod.title.toLowerCase();
                    if (titleLower.includes('pharmacovigilance')) iconObj = { icon: '💊' };
                    else if (titleLower.includes('data management')) iconObj = { icon: '📊' };
                    else if (titleLower.includes('regulatory')) iconObj = { icon: '⚖️' };
                    else if (titleLower.includes('writing')) iconObj = { icon: '📝' };
                    else if (titleLower.includes('coding')) iconObj = { icon: '⚕️' };

                    return (
                      <div key={idx} className="col-12 col-md-6 mb-3 d-flex align-items-stretch text-start">
                        <div className="cr-module-card w-100">
                          <div style={{
                            width: '70px', height: '70px', borderRadius: '50%', 
                            background: 'linear-gradient(135deg, var(--color-secondary) 0%, #0369a1 100%)', 
                            color: 'white', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', fontSize: '30px',
                            margin: '0 0 20px 0',
                            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)'
                          }}>
                            {iconObj.icon}
                          </div>
                          <h3 className="cr-module-title" style={{ textAlign: 'left' }}>{mod.title}</h3>
                          <ul className="cr-list">
                            {mod.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Career Outcomes (Placement, Certifications, Lifetime Access) */}
              <div className="mb-5 fade-in-up" style={{animationDelay: '0.4s'}}>
                <h3 className="mb-5" style={{ fontWeight: 800, color: "var(--color-text-dark)", fontSize: '2rem', textAlign: 'center' }}>Career Outcomes & Benefits</h3>
                <div className="row justify-content-center">
                  {(outcomes || [
                    { icon: '📜', title: 'Industry Certification', desc: 'Valid across global CROs & Pharma companies.' },
                    { icon: '🎯', title: 'Diverse Opportunities', desc: 'Roles like CRA, CDM Executive, PV Associate.' },
                    { icon: '💼', title: 'Placement Assistance', desc: 'Resume building, mock interviews & referrals.' },
                    { icon: '💻', title: 'Live Interactive Sessions', desc: 'Learn directly from seasoned experts.' }
                  ]).map((out, i) => (
                    <div key={i} className="col-12 col-sm-6 col-lg-4 mb-3">
                      <div className="cr-module-card p-4 h-100 d-flex flex-column align-items-center text-center">
                        <span className="outcome-icon" style={{ fontSize: '40px', marginBottom: '20px' }}>{out.icon}</span>
                        <div>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--color-primary)' }}>{out.title}</h4>
                          <p style={{ fontSize: '0.95rem', color: '#475569', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{out.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Program Details */}
              <div className="mb-5 fade-in-up" style={{animationDelay: '0.5s'}}>
                <h3 className="mb-5" style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '2rem', textAlign: 'center' }}>Program Details</h3>
                <div className="row justify-content-center">
                  <div className="col-12 col-md-6 col-lg-4 mb-3">
                    <div className="program-detail-card h-100">
                      <div className="icon-wrapper">
                        <span className="detail-icon">⏳</span>
                      </div>
                      <div>
                        <h4>Duration</h4>
                        <p>{details.duration || '6 Months'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-4 mb-3">
                    <div className="program-detail-card h-100">
                      <div className="icon-wrapper">
                        <span className="detail-icon">💻</span>
                      </div>
                      <div>
                        <h4>Mode</h4>
                        <p>{details.mode || 'Online (Live Interactive)'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                    <div className="program-detail-card h-100">
                      <div className="icon-wrapper">
                        <span className="detail-icon">🎓</span>
                      </div>
                      <div>
                        <h4>Eligibility</h4>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                          {details.eligibility || 'B.Pharm, M.Pharm, PharmD, BSc, MSc, BTech/MTech (Biotech), BDS, MDS, BHMS, BAMS, MBBS & Life Science Aspirants.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Audience / Who Should Join */}
              {targetAudience && (
                <div className="mb-5 fade-in-up text-center premium-glass-panel" style={{ animationDelay: '0.6s', padding: 'clamp(20px, 4vw, 40px)' }}>
                   <h3 style={{ fontWeight: 900, color: 'var(--color-primary)', fontSize: '2rem', marginBottom: '25px' }}>Who Should Join This Program?</h3>
                   <div className="d-flex flex-wrap justify-content-center gap-3">
                     {targetAudience.map((audience, idx) => (
                       <span key={idx} style={{ 
                         background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)', 
                         color: 'var(--color-secondary)', 
                         padding: '12px 24px', 
                         borderRadius: '50px', 
                         fontSize: '1rem', 
                         fontWeight: 700, 
                         border: '1px solid rgba(79, 70, 229, 0.15)',
                         boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
                         margin: '5px' 
                       }}>
                         {audience}
                       </span>
                     ))}
                   </div>
                </div>
              )}

              {/* FAQs Section for AEO */}
              {faqs && faqs.length > 0 && (
                <div className="mb-5 fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <h3 className="mb-4" style={{ fontWeight: 800, color: "var(--color-text-dark)", fontSize: '2rem', textAlign: 'center' }}>Frequently Asked Questions</h3>
                  <div className="faq-accordion text-start mx-auto" style={{ maxWidth: '900px' }}>
                    {faqs.map((faq, index) => (
                      <div 
                        key={index} 
                        className={`faq-item card border-0 mb-3 shadow-sm rounded-4 overflow-hidden ${activeFaq === index ? 'active' : ''}`}
                        onClick={() => toggleFAQ(index)}
                        style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                      >
                        <div className="faq-question card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                          <h4 className="mb-0 fw-bold" style={{ fontSize: '1.1rem', color: activeFaq === index ? 'var(--color-primary)' : '#334155', transition: 'color 0.3s ease' }}>
                            {faq.question}
                          </h4>
                          <span 
                            className="faq-toggle-icon rounded-circle bg-light d-flex justify-content-center align-items-center shrink-0 ms-3" 
                            style={{ width: '40px', height: '40px', transition: 'transform 0.4s ease', transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)', backgroundColor: activeFaq === index ? 'var(--color-primary)' : '#f8fafc', color: activeFaq === index ? 'white' : 'var(--color-primary)' }}
                          >
                            <i className={`fa ${activeFaq === index ? 'fa-minus' : 'fa-plus'}`}></i>
                          </span>
                        </div>
                        
                        <div 
                          className="faq-answer-wrapper" 
                          style={{ 
                            maxHeight: activeFaq === index ? '250px' : '0', 
                            opacity: activeFaq === index ? '1' : '0',
                            overflow: 'hidden', 
                            transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                            backgroundColor: '#f8fafc'
                          }}
                        >
                          <div className="faq-answer card-body p-4 pt-2 border-top-0">
                            <p className="mb-0 text-muted" style={{ fontSize: '1rem', lineHeight: '1.6' }}>{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Width Video Section */}
          {embedUrl && (
            <div className="fade-in-up" style={{ animationDelay: "0.5s" }}>
              <div className="row justify-content-center mb-4 text-center">
                <div className="col-12">
                  <h3 style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '2rem' }}>
                    Recorded Demo Session
                  </h3>
                </div>
              </div>
              <div className="row justify-content-center mb-5">
                <div className="col-12 col-lg-10">
                  <div className="video-container" style={{ background: '#fff', borderRadius: '24px', padding: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="video-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '16px', background: '#000' }}>
                      <iframe
                        src={embedUrl}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        title="Recorded Demo Session">
                      </iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Width Bottom CTA Section */}
          <div className="row mt-4 mb-5 fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="col-12">
              <div className="bottom-cta-box">
                <CourseCTAs courseData={courseData} courseName={ctaCourseName} variant="bottom" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Global Footer */}

    </>
  );
};

export default CoursePageLayout;
