import React from 'react';
import { Link } from 'react-router-dom';

const portalCopy = {
  student: { eyebrow: 'Student learning portal', label: 'Your clinical career starts here', icon: 'fa-graduation-cap' },
  mentor: { eyebrow: 'Mentor workspace', label: 'Guide the next generation of professionals', icon: 'fa-user-tie' },
  admin: { eyebrow: 'Administration console', label: 'Operate your learning ecosystem with clarity', icon: 'fa-shield-alt' }
};

const AuthLayout = ({ title, subtitle, children, role = 'student' }) => {
  const copy = portalCopy[role] || portalCopy.student;
  return (
    <div className={`clinidea-auth clinidea-auth--${role}`}>
      <section className="clinidea-auth__brand" aria-label="Clinidea Education">
        <Link to="/" className="clinidea-auth__logo" aria-label="Go to Clinidea home page"><img src="/clinidea Logo/Clinidea_Education_Logo_header.webp" alt="Clinidea Education" onError={(event) => { event.currentTarget.src = '/assets/images/logo.png'; }} /></Link>
        <div className="clinidea-auth__brand-content"><span className="clinidea-auth__eyebrow">{copy.eyebrow}</span><h1>{copy.label}</h1><p>Practical clinical education, dedicated support, and the tools to make every learning milestone count.</p><div className="clinidea-auth__proofs"><span><i className="fa fa-check-circle" /> Expert-led learning</span><span><i className="fa fa-check-circle" /> Industry-aligned</span></div></div>
        <div className="clinidea-auth__illustration" aria-hidden="true"><div className="clinidea-auth__orb clinidea-auth__orb--one" /><div className="clinidea-auth__orb clinidea-auth__orb--two" /><div className="clinidea-auth__symbol"><i className={`fa ${copy.icon}`} /></div></div>
      </section>
      <main className="clinidea-auth__main"><Link to="/" className="clinidea-auth__back"><i className="fa fa-arrow-left" /> Back to website</Link><div className="clinidea-auth__form-card"><div className="clinidea-auth__form-heading"><span className="clinidea-auth__mobile-mark"><i className={`fa ${copy.icon}`} /></span><span className="clinidea-auth__eyebrow">Secure access</span><h2>{title}</h2><p>{subtitle}</p></div><div className="login-form-wrapper">{children}</div></div><p className="clinidea-auth__help"><i className="fa fa-lock" /> Your sign-in details are protected.</p></main>
    </div>
  );
};

export default AuthLayout;
