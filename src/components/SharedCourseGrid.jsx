import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';

const SharedCourseGrid = () => {
  const [dbCourses, setDbCourses] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbCourses(data);
        }
      })
      .catch(err => console.error("Failed to fetch courses:", err));
  }, []);

  const getFee = (courseName, defaultFee) => {
    const course = dbCourses.find(c => c.name === courseName);
    if (course && course.fees) {
      return course.fees.toLocaleString('en-IN') + '/-';
    }
    return defaultFee;
  };

  return (
    <div className="modern-course-grid">
      <div className="sleek-card" onClick={() => window.location.href = '/clinical-research-pharmacovigilance-course'}>
        <div className="sleek-card-img" style={{ backgroundImage: `url('/course-images/cr-pharmacovigilance.webp')` }}></div>
        <div className="sleek-card-body">
          <h3>Clinical Research & Pharmacovigilance</h3>
          <p>Learn drug safety, AE reporting, MedDRA coding, and global PV regulations.</p>
          <ul className="course-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Duration: 6 Months</li>
            <li><span style={{ fontSize: '1.2em', fontWeight: '700', marginRight: '6px', color: 'var(--color-accent)' }}>₹</span> <span style={{ fontSize: '1.1em', color: 'var(--color-primary)' }}>{getFee('Clinical Research & Pharmacovigilance', '50,000/-')}</span></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> 100% Placement Support</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> Mode: Online (Live Interactive)</li>
          </ul>
          <a href="/clinical-research-pharmacovigilance-course" className="sleek-btn" onClick={(e) => e.stopPropagation()}>View Details</a>
        </div>
      </div>

      <div className="sleek-card" onClick={() => window.location.href = '/clinical-research-data-management-course'}>
        <div className="sleek-card-img" style={{ backgroundImage: `url('/course-images/cr-data-management.avif')` }}></div>
        <div className="sleek-card-body">
          <h3>Clinical Research & Data Management</h3>
          <p>Get expertise in Clinical Research and Data Management, perfect for multidisciplinary career growth.</p>
          <ul className="course-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Duration: 6 Months</li>
            <li><span style={{ fontSize: '1.2em', fontWeight: '700', marginRight: '6px', color: 'var(--color-accent)' }}>₹</span> <span style={{ fontSize: '1.1em', color: 'var(--color-primary)' }}>{getFee('Clinical Research & Data Management', '50,000/-')}</span></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> 100% Placement Support</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> Mode: Online (Live Interactive)</li>
          </ul>
          <a href="/clinical-research-data-management-course" className="sleek-btn" onClick={(e) => e.stopPropagation()}>View Details</a>
        </div>
      </div>

      <div className="sleek-card" onClick={() => window.location.href = '/clinical-research-cr-pv-dm-course'}>
        <div className="sleek-card-img" style={{ backgroundImage: `url('/course-images/cr-pv-dm.webp')` }}></div>
        <div className="sleek-card-body">
          <h3>Clinical Research, Pharmacovigilance & Data Management</h3>
          <p>A comprehensive program covering Clinical Research, Pharmacovigilance and Data Management.</p>
          <ul className="course-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Duration: 6 Months</li>
            <li><span style={{ fontSize: '1.2em', fontWeight: '700', marginRight: '6px', color: 'var(--color-accent)' }}>₹</span> <span style={{ fontSize: '1.1em', color: 'var(--color-primary)' }}>{getFee('Clinical Research, Pharmacovigilance & Data Management', '60,000/-')}</span></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> 100% Placement Support</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> Mode: Online (Live Interactive)</li>
          </ul>
          <a href="/clinical-research-cr-pv-dm-course" className="sleek-btn" onClick={(e) => e.stopPropagation()}>View Details</a>
        </div>
      </div>

      <div className="sleek-card" onClick={() => window.location.href = '/clinical-research-regulatory-affairs-course'}>
        <div className="sleek-card-img" style={{ backgroundImage: `url('/course-images/cr-regulatory-affairs.webp')` }}></div>
        <div className="sleek-card-body">
          <h3>Clinical Research & Regulatory Affairs</h3>
          <p>Explore regulatory pathways, global guidelines, NDA submissions, and compliance strategies.</p>
          <ul className="course-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Duration: 6 Months</li>
            <li><span style={{ fontSize: '1.2em', fontWeight: '700', marginRight: '6px', color: 'var(--color-accent)' }}>₹</span> <span style={{ fontSize: '1.1em', color: 'var(--color-primary)' }}>{getFee('Clinical Research & Regulatory Affairs', '50,000/-')}</span></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> 100% Placement Support</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> Mode: Online (Live Interactive)</li>
          </ul>
          <a href="/clinical-research-regulatory-affairs-course" className="sleek-btn" onClick={(e) => e.stopPropagation()}>View Details</a>
        </div>
      </div>

      <div className="sleek-card" onClick={() => window.location.href = '/clinical-research-medical-writing-course'}>
        <div className="sleek-card-img" style={{ backgroundImage: `url('/course-images/cr-medical-writing.webp')` }}></div>
        <div className="sleek-card-body">
          <h3>Clinical Research & Medical Writing</h3>
          <p>Master protocol writing, CSR creation, scientific manuscripts, and regulatory documents.</p>
          <ul className="course-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Duration: 6 Months</li>
            <li><span style={{ fontSize: '1.2em', fontWeight: '700', marginRight: '6px', color: 'var(--color-accent)' }}>₹</span> <span style={{ fontSize: '1.1em', color: 'var(--color-primary)' }}>{getFee('Clinical Research & Medical Writing', '50,000/-')}</span></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> 100% Placement Support</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> Mode: Online (Live Interactive)</li>
          </ul>
          <a href="/clinical-research-medical-writing-course" className="sleek-btn" onClick={(e) => e.stopPropagation()}>View Details</a>
        </div>
      </div>

      <div className="sleek-card" onClick={() => window.location.href = '/clinical-research-medical-coding-course'}>
        <div className="sleek-card-img" style={{ backgroundImage: `url('/course-images/cr-medical-coding.webp')` }}></div>
        <div className="sleek-card-body">
          <h3>Clinical Research & Medical Coding</h3>
          <p>A specialized program covering both clinical research fundamentals and professional medical coding.</p>
          <ul className="course-features">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Duration: 6 Months</li>
            <li><span style={{ fontSize: '1.2em', fontWeight: '700', marginRight: '6px', color: 'var(--color-accent)' }}>₹</span> <span style={{ fontSize: '1.1em', color: 'var(--color-primary)' }}>{getFee('Clinical Research & Medical Coding', '50,000/-')}</span></li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> 100% Placement Support</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> Mode: Online (Live Interactive)</li>
          </ul>
          <a href="/clinical-research-medical-coding-course" className="sleek-btn" onClick={(e) => e.stopPropagation()}>View Details</a>
        </div>
      </div>
    </div>
  );
};

export default SharedCourseGrid;
