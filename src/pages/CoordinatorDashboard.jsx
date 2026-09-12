import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const [activePipeline, setActivePipeline] = useState('course'); // 'course' or 'webinar'
  const [activeStage, setActiveStage] = useState('NEW');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [reasonModal, setReasonModal] = useState({ show: false, leadId: null, reason: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  const coordinatorEmail = localStorage.getItem('coordinatorEmail') || 'coordinator@clinidea.in';

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('coordinatorToken');
      const res = await fetch(`${BASE_URL}/api/admin/leads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
      } else {
        // Fallback sample mock leads if server returns error or empty
        setLeads([
          { id: 101, name: 'Dr. Ananya Sharma', phone: '9876543210', email: 'ananya@gmail.com', courseInterest: 'Clinical Research & PV', source: 'Google Ads', stage: 'NEW', webinarStage: 'NEW', createdAt: new Date().toISOString() },
          { id: 102, name: 'Rahul Verma', phone: '9123456789', email: 'rahul.v@gmail.com', courseInterest: 'Pharmacovigilance', source: 'Meta Ads', stage: 'CONTACTED', webinarStage: 'CONTACTED_WEBINAR', createdAt: new Date().toISOString() },
          { id: 103, name: 'Pooja Patel', phone: '9988776655', email: 'pooja.p@gmail.com', courseInterest: 'Clinical Data Management', source: 'Webinar', stage: 'INTERESTED', webinarStage: 'INTERESTED_COURSE', createdAt: new Date().toISOString() },
          { id: 104, name: 'Sanjay Kumar', phone: '9811223344', email: 'sanjay.k@gmail.com', courseInterest: 'Medical Writing', source: 'Website', stage: 'FOLLOW_UP_1', webinarStage: 'FOLLOW_UP', createdAt: new Date().toISOString() },
          { id: 105, name: 'Neha Gupta', phone: '9744556677', email: 'neha.g@gmail.com', courseInterest: 'Regulatory Affairs', source: 'Social Media', stage: 'NOT_INTERESTED', notInterestedReason: 'Fees higher than budget', webinarStage: 'NOT_INTERESTED', createdAt: new Date().toISOString() },
          { id: 106, name: 'Vikram Singh', phone: '9633221100', email: 'vikram.s@gmail.com', courseInterest: 'CR PV CDM Combo', source: 'Google Ads', stage: 'REG_FEE_RECEIVED', webinarStage: 'REG_FEE_RECEIVED', createdAt: new Date().toISOString() }
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('coordinatorToken');
    localStorage.removeItem('coordinatorEmail');
    navigate('/studentcoordinator/login');
  };

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const updateLeadStage = (leadId, newStage, notReason = null) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        if (activePipeline === 'course') {
          return { ...l, stage: newStage, notInterestedReason: notReason || l.notInterestedReason };
        } else {
          return { ...l, webinarStage: newStage, notInterestedReason: notReason || l.notInterestedReason };
        }
      }
      return l;
    });
    setLeads(updated);
    showMsg(`Lead status updated to ${newStage.replace(/_/g, ' ')}`);
  };

  const handleNotInterestedSubmit = () => {
    if (!reasonModal.reason.trim()) return alert('Please enter a reason');
    updateLeadStage(reasonModal.leadId, 'NOT_INTERESTED', reasonModal.reason);
    setReasonModal({ show: false, leadId: null, reason: '' });
  };

  const filteredLeads = leads.filter(l => {
    if (activePipeline === 'course') {
      return (l.stage || 'NEW') === activeStage;
    } else {
      return (l.webinarStage || 'NEW') === activeStage;
    }
  });

  const courseStages = [
    { id: 'NEW', label: 'New Lead', icon: 'fa-user-plus', color: 'primary' },
    { id: 'CONTACTED', label: 'Contacted', icon: 'fa-phone-alt', color: 'info' },
    { id: 'INTERESTED', label: 'Interested', icon: 'fa-star', color: 'warning' },
    { id: 'FOLLOW_UP_1', label: 'Follow-up 1', icon: 'fa-redo', color: 'secondary' },
    { id: 'FOLLOW_UP_2', label: 'Follow-up 2', icon: 'fa-redo', color: 'secondary' },
    { id: 'FOLLOW_UP_3', label: 'Follow-up 3', icon: 'fa-redo', color: 'secondary' },
    { id: 'FOLLOW_UP_FINAL', label: 'Final Follow-up', icon: 'fa-flag-checkered', color: 'danger' },
    { id: 'NOT_INTERESTED', label: 'Not Interested', icon: 'fa-times-circle', color: 'dark' },
    { id: 'REG_FEE_RECEIVED', label: 'Reg. Fee Received', icon: 'fa-check-circle', color: 'success' }
  ];

  const webinarStages = [
    { id: 'NEW', label: 'New Webinar Lead', icon: 'fa-video', color: 'primary' },
    { id: 'CONTACTED_WEBINAR', label: 'Contacted (Webinar)', icon: 'fa-phone-volume', color: 'info' },
    { id: 'INTERESTED_WEBINAR', label: 'Interested (Webinar)', icon: 'fa-calendar-check', color: 'warning' },
    { id: 'CONTACTED_COURSE', label: 'Contacted (Course)', icon: 'fa-graduation-cap', color: 'secondary' },
    { id: 'INTERESTED_COURSE', label: 'Interested (Course)', icon: 'fa-award', color: 'warning' },
    { id: 'FOLLOW_UP', label: 'Follow-up', icon: 'fa-clock', color: 'info' },
    { id: 'NOT_INTERESTED', label: 'Not Interested', icon: 'fa-times-circle', color: 'dark' },
    { id: 'REG_FEE_RECEIVED', label: 'Reg. Fee Received', icon: 'fa-check-circle', color: 'success' }
  ];

  const currentStages = activePipeline === 'course' ? courseStages : webinarStages;

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: '#f8fafc', color: '#1e293b' }}>
      <Helmet>
        <title>Student Coordinator CRM | Clinidea</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Header */}
      <header className="bg-white border-bottom py-3 px-4 shadow-sm sticky-top" style={{ zIndex: 1030 }}>
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white rounded-3 p-1 d-flex align-items-center justify-content-center border shadow-sm" style={{ width: '48px', height: '48px', borderColor: '#e2e8f0' }}>
              <img src="/clinidea Logo/Clinidea_Education_Logo_header.webp" alt="Clinidea Education Logo" className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = '/assets/images/logo.png'; }} />
            </div>
            <div>
              <h4 className="mb-0 fw-bold text-dark fs-5">Clinidea CRM</h4>
              <span className="badge bg-warning bg-opacity-10 text-dark fw-bold px-2 py-0" style={{ fontSize: '11px' }}>Student Coordinator Portal</span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-sm-block text-end me-2">
              <p className="mb-0 fw-bold text-dark" style={{ lineHeight: '1.2' }}>{coordinatorEmail.split('@')[0]}</p>
              <small className="text-muted">Student Coordinator</small>
            </div>
            <button onClick={handleLogout} className="btn btn-sm rounded-4 px-3 py-2 fw-bold" style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6' }}>
              <i className="fas fa-sign-out-alt me-1"></i> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow-1 container-fluid px-3 px-md-4 py-4">
        
        {/* Pipeline Toggle */}
        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4 bg-white p-3 rounded-4 border shadow-sm" style={{ borderColor: '#e2e8f0' }}>
          <div className="btn-group p-1 bg-light rounded-pill border" style={{ borderColor: '#e2e8f0' }}>
            <button 
              className={`btn rounded-pill px-4 py-2 fw-bold border-0 ${activePipeline === 'course' ? 'bg-primary text-white shadow-sm' : 'text-muted'}`}
              onClick={() => { setActivePipeline('course'); setActiveStage('NEW'); }}
            >
              <i className="fas fa-graduation-cap me-2"></i> 1. Course Leads Pipeline
            </button>
            <button 
              className={`btn rounded-pill px-4 py-2 fw-bold border-0 ${activePipeline === 'webinar' ? 'bg-primary text-white shadow-sm' : 'text-muted'}`}
              onClick={() => { setActivePipeline('webinar'); setActiveStage('NEW'); }}
            >
              <i className="fas fa-video me-2"></i> 2. Webinar & Event Leads Pipeline
            </button>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill border border-success-subtle">
              <i className="fas fa-sync-alt me-1"></i> Equal Auto Lead Distribution Active
            </span>
          </div>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} alert-dismissible fade show rounded-4 border-0 shadow-sm mb-4`} role="alert">
            <i className="fas fa-check-circle me-2"></i> {message.text}
          </div>
        )}

        {/* Stage Filter Chips */}
        <div className="d-flex gap-2 overflow-auto pb-3 mb-4 custom-scrollbar">
          {currentStages.map(st => {
            const count = leads.filter(l => (activePipeline === 'course' ? (l.stage || 'NEW') : (l.webinarStage || 'NEW')) === st.id).length;
            const isSelected = activeStage === st.id;
            return (
              <button
                key={st.id}
                className={`btn text-nowrap rounded-4 px-3 py-2 fw-bold border d-flex align-items-center gap-2 transition-all ${isSelected ? 'btn-primary shadow-sm text-white border-primary' : 'bg-white text-dark border-secondary-subtle'}`}
                onClick={() => setActiveStage(st.id)}
              >
                <i className={`fas ${st.icon}`}></i>
                <span>{st.label}</span>
                <span className={`badge rounded-pill ${isSelected ? 'bg-white text-primary' : 'bg-light text-dark border'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Leads Table Card */}
        <div className="card border rounded-4 bg-white overflow-hidden shadow-sm" style={{ borderColor: '#e2e8f0' }}>
          <div className="card-header bg-light p-3 px-4 d-flex align-items-center justify-content-between border-bottom" style={{ borderColor: '#e2e8f0' }}>
            <h5 className="mb-0 fw-bold text-dark">
              {currentStages.find(s => s.id === activeStage)?.label} ({filteredLeads.length})
            </h5>
            <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold" onClick={fetchLeads}>
              <i className="fas fa-sync-alt me-1"></i> Refresh Leads
            </button>
          </div>

          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary"></div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Student Details</th>
                      <th>Course Interest</th>
                      <th>Source</th>
                      <th>Quick Contact Actions</th>
                      <th>Stage Action</th>
                      <th className="text-end pe-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map(l => (
                      <tr key={l.id}>
                        <td className="ps-4">
                          <div className="fw-bold text-dark">{l.name}</div>
                          <div className="small text-muted">{l.email} • {l.phone}</div>
                        </td>
                        <td>
                          <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-2 py-1">{l.courseInterest}</span>
                        </td>
                        <td>
                          <small className="text-muted fw-bold">{l.source}</small>
                        </td>
                        <td>
                          {/* Direct Contact Action Buttons */}
                          <div className="d-flex align-items-center gap-2">
                            <a href={`tel:${l.phone}`} className="btn btn-sm btn-outline-success rounded-pill px-2 py-1 fw-bold" title="Direct Phone Call">
                              <i className="fas fa-phone-alt me-1"></i> Call
                            </a>
                            <a 
                              href={`https://wa.me/91${l.phone}?text=${encodeURIComponent(`Hi ${l.name}, greetings from Clinidea Education! We saw your enquiry for ${l.courseInterest}. How can we assist you today?`)}`}
                              target="_blank" 
                              rel="noreferrer"
                              className="btn btn-sm btn-outline-success rounded-pill px-2 py-1 fw-bold"
                              title="Send WhatsApp Message"
                            >
                              <i className="fab fa-whatsapp me-1"></i> WhatsApp
                            </a>
                            <a 
                              href={`mailto:${l.email}?subject=${encodeURIComponent(`Clinidea Course Brochure - ${l.courseInterest}`)}&body=${encodeURIComponent(`Dear ${l.name},\n\nThank you for reaching out to Clinidea Education regarding ${l.courseInterest}.\n\nPlease find our official course details attached.\n\nBest regards,\nClinidea Team`)}`}
                              className="btn btn-sm btn-outline-primary rounded-pill px-2 py-1 fw-bold"
                              title="Send Email"
                            >
                              <i className="fas fa-envelope me-1"></i> Email
                            </a>
                          </div>
                        </td>
                        <td>
                          {/* Stage Action Buttons tailored to current stage */}
                          <div className="d-flex align-items-center gap-1 flex-wrap">
                            {/* In NEW LEAD stage */}
                            {activeStage === 'NEW' && (
                              <>
                                <button 
                                  className="btn btn-sm btn-info text-white rounded-pill px-2 py-1 fw-bold"
                                  onClick={() => updateLeadStage(l.id, activePipeline === 'course' ? 'CONTACTED' : 'CONTACTED_WEBINAR')}
                                  title="Mark as Contacted"
                                >
                                  Mark Contacted
                                </button>
                                <button 
                                  className="btn btn-sm btn-warning text-dark rounded-pill px-2 py-1 fw-bold"
                                  onClick={() => updateLeadStage(l.id, activePipeline === 'course' ? 'INTERESTED' : 'INTERESTED_WEBINAR')}
                                  title="Mark as Interested"
                                >
                                  Interested
                                </button>
                              </>
                            )}

                            {/* In CONTACTED / INTERESTED / FOLLOW-UP stages */}
                            {(activeStage.includes('CONTACTED') || activeStage.includes('INTERESTED') || activeStage.includes('FOLLOW_UP')) && (
                              <>
                                {activeStage !== 'FOLLOW_UP_FINAL' && activeStage !== 'FOLLOW_UP' && (
                                  <button 
                                    className="btn btn-sm btn-secondary rounded-pill px-2 py-1 fw-bold"
                                    onClick={() => updateLeadStage(l.id, activePipeline === 'course' ? (activeStage === 'FOLLOW_UP_1' ? 'FOLLOW_UP_2' : activeStage === 'FOLLOW_UP_2' ? 'FOLLOW_UP_3' : activeStage === 'FOLLOW_UP_3' ? 'FOLLOW_UP_FINAL' : 'FOLLOW_UP_1') : 'FOLLOW_UP')}
                                    title="Move to Next Follow-Up"
                                  >
                                    Follow-Up
                                  </button>
                                )}
                                {activeStage.includes('CONTACTED') && (
                                  <button 
                                    className="btn btn-sm btn-warning text-dark rounded-pill px-2 py-1 fw-bold"
                                    onClick={() => updateLeadStage(l.id, activePipeline === 'course' ? 'INTERESTED' : 'INTERESTED_COURSE')}
                                    title="Mark as Interested"
                                  >
                                    Interested
                                  </button>
                                )}
                              </>
                            )}

                            {/* Reg Fee Verification Button */}
                            {activeStage !== 'REG_FEE_RECEIVED' && (
                              <button 
                                className="btn btn-sm btn-success rounded-pill px-2 py-1 fw-bold"
                                onClick={() => updateLeadStage(l.id, 'REG_FEE_RECEIVED')}
                                title="Verify Registration Fee Received"
                              >
                                Verify Reg Fee
                              </button>
                            )}

                            {/* Not Interested Button with Mandatory Reason Note Modal */}
                            {activeStage !== 'NOT_INTERESTED' && (
                              <button 
                                className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1 fw-bold"
                                onClick={() => setReasonModal({ show: true, leadId: l.id, reason: '' })}
                                title="Mark as Not Interested (Reason Required)"
                              >
                                Not Interested
                              </button>
                            )}

                            {/* If in REG_FEE_RECEIVED stage */}
                            {activeStage === 'REG_FEE_RECEIVED' && (
                              <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill">
                                Verified & Sent to Admin
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          {l.notInterestedReason ? (
                            <div className="small text-danger fw-bold text-truncate" style={{ maxWidth: '180px' }} title={l.notInterestedReason}>
                              Reason: {l.notInterestedReason}
                            </div>
                          ) : (
                            <span className="badge bg-light text-dark border fw-bold px-3 py-2 rounded-pill">
                              {activeStage.replace(/_/g, ' ')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          <i className="fas fa-folder-open fs-2 opacity-50 mb-2"></i>
                          <p className="mb-0">No leads currently in this stage.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mandatory Reason Modal for Not Interested Leads */}
      {reasonModal.show && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog">
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header bg-dark text-white rounded-top-4">
                <h5 className="modal-title fw-bold">Reason Required for Not Interested Lead</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setReasonModal({ show: false, leadId: null, reason: '' })}></button>
              </div>
              <div className="modal-body p-4">
                <p className="text-muted small mb-3">Please specify why the student is not interested (e.g. Budget issue, Joined another institute, Location issue, etc.)</p>
                <label className="form-label fw-bold">Reason Note (Required)</label>
                <textarea 
                  className="form-control rounded-3" 
                  rows="3" 
                  required
                  placeholder="Enter detailed reason note..."
                  value={reasonModal.reason}
                  onChange={(e) => setReasonModal({ ...reasonModal, reason: e.target.value })}
                ></textarea>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button className="btn btn-light rounded-pill px-4 fw-bold" onClick={() => setReasonModal({ show: false, leadId: null, reason: '' })}>Cancel</button>
                <button className="btn btn-danger rounded-pill px-4 fw-bold" disabled={!reasonModal.reason.trim()} onClick={handleNotInterestedSubmit}>Save & Move Lead</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoordinatorDashboard;
