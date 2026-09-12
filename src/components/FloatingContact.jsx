import React from 'react';
import { useLocation } from 'react-router-dom';

const FloatingContact = () => {
  const location = useLocation();

  // Contact Config
  const PHONE_NUMBER = '918999213129';
  const EMAIL_ADDRESS = 'info@clinidea.in';

  // Dynamic WhatsApp Message Logic
  let autoMessage = "Hello Clinidea Education, I am interested in your courses. Kindly share more details.";

  if (location.pathname.includes('/clinical-research-data-management-course')) {
    autoMessage = "Hello Clinidea Education, I am interested in the Clinical Research, Pharmacovigilance & Clinical Data Management (CDM) course. Kindly share more details.";
  } else if (location.pathname.includes('/clinical-research-pharmacovigilance-course')) {
    autoMessage = "Hello Clinidea Education, I am interested in the Clinical Research & Pharmacovigilance course. Kindly share more details.";
  } else if (location.pathname.includes('/clinical-research-medical-coding-course')) {
    autoMessage = "Hello Clinidea Education, I am interested in the Medical Coding course. Kindly share more details.";
  } else if (location.pathname.includes('/clinical-research-')) {
    autoMessage = "Hello Clinidea Education, I am interested in your specialized Clinical Research programs. Kindly share more details.";
  } else if (location.pathname.includes('/contact')) {
    autoMessage = "Hello Clinidea Education, I would like to get in touch with your team.";
  } else if (location.pathname.includes('/register') || location.pathname.includes('/enroll')) {
    autoMessage = "Hello Clinidea Education, I am facing an issue or have a query regarding the enrollment/registration process. Please assist me.";
  }

  const encodedMessage = encodeURIComponent(autoMessage);
  
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const whatsappUrl = isMobile 
    ? `whatsapp://send?phone=${PHONE_NUMBER}&text=${encodedMessage}`
    : `https://web.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodedMessage}`;

  return (
    <>
      <style>{`
        .contact-dock {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          z-index: 9999;
          align-items: flex-end;
        }

        .dock-btn {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          color: #4a5568;
          background-color: #ffffff;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }

        .dock-btn:hover {
          transform: scale(1.1) translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          color: var(--color-primary);
        }

        .dock-btn.whatsapp {
          background-color: #25D366;
          color: white;
          font-size: 28px;
          animation: pulse-wa 2.5s infinite;
        }

        .dock-btn.whatsapp:hover {
          color: white;
          animation: none;
        }

        @keyframes pulse-wa {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
          70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }

        /* Tooltip Setup for Desktop */
        .dock-btn::before {
          content: attr(data-tooltip);
          position: absolute;
          right: 70px;
          top: 50%;
          transform: translateY(-50%) translateX(10px);
          background-color: #333;
          color: white;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          pointer-events: none;
        }

        .dock-btn::after {
          content: '';
          position: absolute;
          right: 64px;
          top: 50%;
          transform: translateY(-50%) translateX(10px);
          border-width: 6px;
          border-style: solid;
          border-color: transparent transparent transparent #333;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          pointer-events: none;
        }

        .dock-btn:hover::before,
        .dock-btn:hover::after {
          opacity: 1;
          visibility: visible;
          transform: translateY(-50%) translateX(0);
        }

        /* Mobile Optimization */
        @media (max-width: 768px) {
          .contact-dock {
            bottom: 15px;
            right: 15px;
            gap: 10px;
            opacity: 0.75;
          }
          .contact-dock:active, .contact-dock:focus-within {
            opacity: 1;
          }
          .dock-btn {
            width: 44px;
            height: 44px;
            font-size: 18px;
          }
          .dock-btn.whatsapp {
            font-size: 24px;
          }
          /* Hide tooltips entirely on mobile screens */
          .dock-btn::before, .dock-btn::after {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="contact-dock">
        {/* Call Button */}
        <a 
          href={`tel:+${PHONE_NUMBER}`} 
          className="dock-btn" 
          data-tooltip="Call Us"
        >
          <i className="fa fa-phone"></i>
        </a>

        {/* WhatsApp Button */}
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="dock-btn whatsapp" 
          data-tooltip="WhatsApp Us"
        >
          <i className="fa fa-whatsapp"></i>
        </a>
      </div>
    </>
  );
};

export default FloatingContact;
