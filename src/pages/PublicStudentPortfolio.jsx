import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';

const getInitials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || '?';

const PublicStudentPortfolio = () => {
  const { studentId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/public/student-portfolio/${studentId}`)
      .then(async res => {
        if (!res.ok) throw new Error((await res.json()).error || 'Portfolio not found');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}><div className="spinner-border text-primary"></div></div>;
  }

  if (error || !data) {
    return (
      <div className="container text-center py-5" style={{ minHeight: '70vh' }}>
        <div className="alert alert-danger d-inline-block mt-5 shadow-sm rounded-3">
          <i className="fa fa-exclamation-triangle me-2"></i>{error || 'Portfolio not found'}
        </div>
      </div>
    );
  }

  const p = data.portfolio || {};
  const isEmpty = !p.headline && !p.bio && !p.skills?.length && !p.education?.length && !p.experience?.length && !p.projects?.length && !p.achievements?.length;
  const hasSocialLinks = !!(p.linkedinUrl || p.naukriUrl);
  const heroStyle = p.bgImageUrl
    ? { backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.82), rgba(15,23,42,0.94)), url(${p.bgImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined;

  return (
    <div className="spf-page">
      <Helmet>
        <title>{data.fullName} | Student Portfolio | Clinidea Education</title>
        <meta name="description" content={p.headline || `${data.fullName}'s student portfolio at Clinidea Education`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />
      </Helmet>

      <style>{`
        .spf-page { min-height: 100vh; background: var(--color-bg-light); }

        /* ---- Masthead ---- */
        .spf-hero { background: #0F172A; padding: clamp(2.5rem, 6vw, 3.25rem) clamp(1.25rem, 5vw, 4rem) clamp(3.75rem, 8vw, 5rem); color: #fff; position: relative; border-bottom: 3px solid #06B6D4; }
        .spf-hero-inner { max-width: 1120px; margin: 0 auto; display: flex; align-items: flex-end; gap: 1.75rem; flex-wrap: wrap; }
        .spf-eyebrow { font-size: 0.72rem; letter-spacing: 0.18em; text-transform: uppercase; color: #67E8F9; font-weight: 700; margin-bottom: 0.7rem; }
        .spf-avatar { width: 92px; height: 92px; border-radius: 14px; border: 2px solid rgba(255,255,255,0.22); overflow: hidden; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 1.9rem; flex-shrink: 0; }
        .spf-avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .spf-hero-name-block { flex: 1; min-width: 240px; }
        .spf-hero h1 { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: clamp(1.9rem, 4vw, 2.7rem); margin: 0 0 3px; color: #fff !important; letter-spacing: -0.01em; line-height: 1.15; }
        .spf-hero .headline { font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 500; font-size: 1.05rem; color: #CBD5E1; margin: 0 0 0.85rem; }
        .spf-meta-row { display: flex; flex-wrap: wrap; gap: 0.4rem 0.9rem; align-items: center; font-size: 0.85rem; color: #94A3B8; margin: 0; }
        .spf-meta-row .spf-dot { opacity: 0.5; }
        .spf-meta-row strong { color: #E2E8F0; font-weight: 600; }

        .spf-social-row { display: flex; gap: 1.4rem; margin-top: 1.15rem; flex-wrap: wrap; }
        .spf-social-link { display: inline-flex; align-items: center; gap: 8px; color: #fff; text-decoration: none; font-size: 0.85rem; font-weight: 600; padding-bottom: 3px; border-bottom: 1px solid rgba(255,255,255,0.28); transition: border-color 0.2s ease, color 0.2s ease; }
        .spf-social-link:hover { border-color: #06B6D4; color: #67E8F9; }
        .spf-social-icon { width: 20px; height: 20px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 0.62rem; font-weight: 800; color: #fff; flex-shrink: 0; }
        .spf-social-icon-linkedin { background: #0a66c2; }
        .spf-social-icon-naukri { background: #4a5cc5; }

        /* ---- Body ---- */
        .spf-body { max-width: 1120px; margin: -2rem auto 0; padding: 0 clamp(1.25rem, 5vw, 4rem) 4.5rem; position: relative; z-index: 2; }
        .spf-grid { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; align-items: start; }
        @media (max-width: 860px) { .spf-grid { grid-template-columns: 1fr; } }
        .spf-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
        @media (min-width: 861px) { .spf-sidebar { position: sticky; top: 100px; } }

        .spf-card { background: #fff; border: 1px solid var(--color-border); border-radius: 10px; padding: clamp(1.4rem, 3vw, 2rem); box-shadow: 0 1px 3px rgba(15,23,42,0.05); }
        .spf-card + .spf-card { margin-top: 1.5rem; }
        .spf-card-title { font-family: 'Playfair Display', Georgia, serif; font-weight: 700; font-size: 1.15rem; color: #0F172A; margin: 0 0 1.25rem; padding-bottom: 0.6rem; border-bottom: 2px solid #06B6D4; display: inline-block; }

        .spf-bio { font-size: 1.02rem; line-height: 1.85; color: var(--color-text-dark); }
        .spf-skill { display: inline-block; border: 1.5px solid #0F172A; color: #0F172A; border-radius: 6px; padding: 0.35rem 0.85rem; font-weight: 600; font-size: 0.82rem; }

        .spf-connect-link { display: flex; align-items: center; gap: 12px; padding: 0.7rem 0; text-decoration: none; color: #0F172A; font-weight: 600; font-size: 0.9rem; border-bottom: 1px solid var(--color-border); transition: color 0.2s ease; }
        .spf-connect-link:last-child { border-bottom: none; padding-bottom: 0; }
        .spf-connect-link:first-child { padding-top: 0; }
        .spf-connect-link:hover { color: #06B6D4; }
        .spf-connect-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 0.95rem; font-weight: 800; color: #fff; flex-shrink: 0; }
        .spf-connect-icon-linkedin { background: #0a66c2; }
        .spf-connect-icon-naukri { background: #4a5cc5; font-size: 1rem; }
        .spf-connect-arrow { margin-left: auto; color: var(--color-text-muted); font-size: 0.78rem; }

        .spf-timeline-item { position: relative; padding-left: 24px; padding-bottom: 1.5rem; border-left: 2px solid var(--color-gray-light); }
        .spf-timeline-item:last-child { border-left-color: transparent; padding-bottom: 0; }
        .spf-timeline-item::before { content: ''; position: absolute; left: -5px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #06B6D4; border: 2px solid #fff; box-shadow: 0 0 0 2px rgba(6,182,212,0.25); }
        .spf-item-title { font-weight: 700; color: #0F172A; font-size: 1.02rem; }
        .spf-item-sub { color: var(--color-text-muted); font-size: 0.87rem; margin-top: 2px; }
        .spf-item-desc { margin-top: 6px; color: var(--color-text-dark); line-height: 1.6; }

        .spf-project-card { border: 1.5px solid var(--color-border); border-radius: 10px; padding: 1.1rem 1.3rem; margin-bottom: 1rem; transition: var(--transition-smooth); }
        .spf-project-card:hover { border-color: #06B6D4; box-shadow: 0 4px 14px -6px rgba(6,182,212,0.3); }
        .spf-project-card:last-child { margin-bottom: 0; }
        .spf-project-title { font-weight: 700; color: #0F172A; }
        .spf-project-link { font-size: 0.82rem; font-weight: 700; color: #0891B2; text-decoration: none; white-space: nowrap; }
        .spf-project-link:hover { text-decoration: underline; }

        .spf-achievement { display: flex; align-items: flex-start; gap: 10px; padding: 0.5rem 0; font-size: 0.92rem; }
        .spf-achievement i { color: #D97706; margin-top: 3px; }

        .spf-empty { text-align: center; color: var(--color-text-muted); padding: 3rem 1rem; }
      `}</style>

      <div className="spf-hero" style={heroStyle}>
        <div className="spf-hero-inner">
          <div className="spf-avatar">
            {p.profileImageUrl
              ? <img src={p.profileImageUrl} alt={data.fullName} className="spf-avatar-img" />
              : getInitials(data.fullName)}
          </div>
          <div className="spf-hero-name-block">
            <div className="spf-eyebrow">Student Portfolio</div>
            <h1>{data.fullName}</h1>
            {p.headline && <p className="headline">{p.headline}</p>}
            <p className="spf-meta-row">
              {data.studentId && <strong>{data.studentId}</strong>}
              {data.studentId && data.course && <span className="spf-dot">·</span>}
              {data.course && <span>{data.course}</span>}
            </p>
            {hasSocialLinks && (
              <div className="spf-social-row">
                {p.linkedinUrl && (
                  <a href={p.linkedinUrl} target="_blank" rel="noreferrer" className="spf-social-link">
                    <span className="spf-social-icon spf-social-icon-linkedin"><i className="fab fa-linkedin-in"></i></span>
                    LinkedIn
                  </a>
                )}
                {p.naukriUrl && (
                  <a href={p.naukriUrl} target="_blank" rel="noreferrer" className="spf-social-link">
                    <span className="spf-social-icon spf-social-icon-naukri">N</span>
                    Naukri.com
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="spf-body">
        {isEmpty ? (
          <div className="spf-card spf-empty">
            <i className="fa fa-file-alt fa-2x mb-3 d-block" style={{ opacity: 0.3 }}></i>
            This student hasn't added portfolio details yet.
          </div>
        ) : (
          <div className="spf-grid">
            <div className="spf-sidebar">
              {p.skills?.length > 0 && (
                <div className="spf-card">
                  <h5 className="spf-card-title">Skills</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {p.skills.map(skill => <span key={skill} className="spf-skill">{skill}</span>)}
                  </div>
                </div>
              )}

              {hasSocialLinks && (
                <div className="spf-card">
                  <h5 className="spf-card-title">Connect</h5>
                  {p.linkedinUrl && (
                    <a href={p.linkedinUrl} target="_blank" rel="noreferrer" className="spf-connect-link">
                      <span className="spf-connect-icon spf-connect-icon-linkedin"><i className="fab fa-linkedin-in"></i></span>
                      LinkedIn Profile
                      <i className="fa fa-arrow-up-right-from-square spf-connect-arrow"></i>
                    </a>
                  )}
                  {p.naukriUrl && (
                    <a href={p.naukriUrl} target="_blank" rel="noreferrer" className="spf-connect-link">
                      <span className="spf-connect-icon spf-connect-icon-naukri">N</span>
                      Naukri.com Profile
                      <i className="fa fa-arrow-up-right-from-square spf-connect-arrow"></i>
                    </a>
                  )}
                </div>
              )}

              {p.achievements?.length > 0 && (
                <div className="spf-card">
                  <h5 className="spf-card-title">Achievements</h5>
                  {p.achievements.map((a, i) => (
                    <div key={i} className="spf-achievement">
                      <i className="fa fa-star"></i>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="spf-main">
              {p.bio && (
                <div className="spf-card">
                  <h5 className="spf-card-title">About</h5>
                  <p className="spf-bio mb-0">{p.bio}</p>
                </div>
              )}

              {p.education?.length > 0 && (
                <div className="spf-card">
                  <h5 className="spf-card-title">Education</h5>
                  {p.education.map((edu, i) => (
                    <div key={i} className="spf-timeline-item">
                      <div className="spf-item-title">{edu.degree}{edu.institution ? ` — ${edu.institution}` : ''}</div>
                      <div className="spf-item-sub">{[edu.year, edu.grade].filter(Boolean).join(' · ')}</div>
                    </div>
                  ))}
                </div>
              )}

              {p.experience?.length > 0 && (
                <div className="spf-card">
                  <h5 className="spf-card-title">Experience</h5>
                  {p.experience.map((exp, i) => (
                    <div key={i} className="spf-timeline-item">
                      <div className="spf-item-title">{exp.role}{exp.company ? ` at ${exp.company}` : ''}</div>
                      {exp.duration && <div className="spf-item-sub">{exp.duration}</div>}
                      {exp.description && <p className="spf-item-desc mb-0">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {p.projects?.length > 0 && (
                <div className="spf-card">
                  <h5 className="spf-card-title">Projects</h5>
                  {p.projects.map((proj, i) => (
                    <div key={i} className="spf-project-card">
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <span className="spf-project-title">{proj.title}</span>
                        {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="spf-project-link">View Project <i className="fa fa-arrow-up-right-from-square ms-1"></i></a>}
                      </div>
                      {proj.description && <p className="mb-0 mt-1 text-muted small">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicStudentPortfolio;
