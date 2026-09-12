import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

const CourseCTAs = ({ courseData, courseName, variant = 'default' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const isHero = variant === 'hero';
  const isBottom = variant === 'bottom';

  const handleDownloadBrochure = async () => {
    setLoading(true);
    try {
      const dbBrochure = courseData?.brochureUrl;
      const brochureUrl = dbBrochure 
        ? (dbBrochure.startsWith('/') ? `${BASE_URL}${dbBrochure}` : `${BASE_URL}/${dbBrochure}`) 
        : (courseData?.pdf ? `${BASE_URL}/${courseData.pdf}` : `${BASE_URL}/images/IB.pdf`);
      
      if (!brochureUrl) {
        alert("Brochure not available at the moment.");
        setLoading(false);
        return;
      }
      
      const response = await fetch(brochureUrl);
      if(!response.ok) throw new Error("Brochure file not found");
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const fileName = courseName ? `${courseName.replace(/\s+/g, '_')}_Brochure.pdf` : 'Clinidea_Brochure.pdf';
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch(err) {
      alert("Brochure not available: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate(courseName ? `/register?course=${encodeURIComponent(courseName)}` : '/register');
  };

  const handleEnroll = () => {
    const courseQuery = courseName ? `?course=${encodeURIComponent(courseName)}` : '';
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent('/enroll' + courseQuery)}`);
    } else {
      navigate(`/enroll${courseQuery}`);
    }
  };

  return (
    <>
      <style>{`
        .cr-cta-wrap {
          text-align: left;
          padding: 5px 0;
        }
        .cr-cta-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--color-primary);
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .cr-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
          margin-bottom: 12px;
          letter-spacing: 0.3px;
        }
        .cr-btn-secondary {
          background: transparent;
          color: var(--color-text-dark);
          border: 1.5px solid var(--color-border);
        }
        .cr-btn-secondary:hover {
          border-color: var(--color-secondary);
          color: var(--color-secondary);
          background: rgba(2, 132, 199, 0.04);
          transform: translateY(-2px);
        }
        .cr-btn-primary {
          background: rgba(2, 132, 199, 0.08);
          color: var(--color-secondary);
          border: 1.5px solid transparent;
        }
        .cr-btn-primary:hover {
          background: rgba(2, 132, 199, 0.15);
          transform: translateY(-2px);
        }
        .cr-btn-accent {
          background: linear-gradient(135deg, var(--color-secondary) 0%, #0369a1 100%);
          color: white;
          border: none;
          box-shadow: 0 4px 15px rgba(2, 132, 199, 0.3);
        }
        .cr-btn-accent:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(2, 132, 199, 0.4);
        }
        .cr-btn-icon {
          margin-right: 12px;
          font-size: 1.2rem;
        }
        @media (max-width: 576px) {
          .cr-cta-wrap .cr-btn {
            width: 100% !important;
            min-width: 100% !important;
            margin-bottom: 10px;
          }
          .cr-cta-title {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
      <div className={isHero ? "glass-cta-container" : "cr-cta-wrap"}>
        {!isHero && <h3 className="cr-cta-title" style={isBottom ? { fontSize: '2rem', textAlign: 'center', marginBottom: '50px' } : {}}>Ready to Accelerate Your Career?</h3>}
        <div className={(isHero || isBottom) ? "d-flex flex-wrap justify-content-center" : "d-flex flex-column"} style={{gap: '15px'}}>
          <button onClick={handleDownloadBrochure} disabled={loading} className={isHero ? "glass-btn" : "cr-btn cr-btn-accent"} style={(isHero || isBottom) ? {width: 'auto', minWidth: '220px'} : {}}>
            <span className="cr-btn-icon">📄</span> {loading ? 'Downloading...' : 'Download Brochure'}
          </button>
          <button onClick={handleRegister} className={isHero ? "glass-btn" : "cr-btn cr-btn-accent"} style={(isHero || isBottom) ? {width: 'auto', minWidth: '220px'} : {}}>
            <span className="cr-btn-icon">📝</span> Register Now
          </button>
          <button onClick={handleEnroll} className={isHero ? "glass-btn" : "cr-btn cr-btn-accent"} style={(isHero || isBottom) ? {width: 'auto', minWidth: '220px'} : {}}>
            <span className="cr-btn-icon">🚀</span> Enroll Now
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-enquiry-modal', { detail: { course: courseName } }))} className={isHero ? "glass-btn" : "cr-btn cr-btn-accent"} style={(isHero || isBottom) ? {width: 'auto', minWidth: '220px'} : {}}>
            <span className="cr-btn-icon">❓</span> Enquiry Now
          </button>
        </div>
      </div>
    </>
  );
};

export default CourseCTAs;
