import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminSessions = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States
  const [showForm, setShowForm] = useState(false);
  const [activeAttendance, setActiveAttendance] = useState(null);
  const [attendanceRoster, setAttendanceRoster] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    batch_id: '',
    session_date: '',
    session_time: '',
    meeting_link: '',
    recurrence: 'none'
  });

  useEffect(() => {
    fetchCoreData();
  }, [navigate]);

  const fetchCoreData = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return navigate('/admin/login');
    
    const sUrl = `${BASE_URL}/api/admin/sessions`;
    const bUrl = `${BASE_URL}/api/admin/batches`;

    Promise.all([
      fetch(sUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
      fetch(bUrl, { headers: { 'Authorization': `Bearer ${token}` } })
    ])
    .then(async ([sRes, bRes]) => {
      if(sRes.ok) setSessions(await sRes.json());
      if(bRes.ok) setBatches(await bRes.json());
      setLoading(false);
    })
    .catch(err => console.error("Fault loading active class grids."));
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openNewForm = () => {
    setEditingId(null);
    setFormData({ batch_id: '', session_date: '', session_time: '', meeting_link: '', recurrence: 'none' });
    setShowForm(true);
  };

  const openEditForm = (sessionObj) => {
    setEditingId(sessionObj.id);
    setFormData({
      batch_id: sessionObj.batchId,
      session_date: new Date(sessionObj.sessionDate).toISOString().split('T')[0],
      session_time: sessionObj.sessionTime || '',
      meeting_link: sessionObj.meetingLink || '',
      recurrence: sessionObj.recurrence || 'none'
    });
    setShowForm(true);
  };

  const deleteSession = async (id) => {
    if(!window.confirm("Purge class session? This action permanently removes it from the Student Schedule.")) return;
    const token = localStorage.getItem('adminToken');
    const url = `${BASE_URL}/api/admin/sessions/${id}`;
    
    try {
      const res = await fetch(url, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if(!res.ok) throw new Error("Purge Failed.");
      fetchCoreData();
    } catch(err) {
      alert(err.message);
    }
  };

  const submitSessionForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    
    const targetUrl = editingId 
      ? (`${BASE_URL}/api/admin/sessions/${editingId}`)
      : (`${BASE_URL}/api/admin/create-class`);

    try {
      const res = await fetch(targetUrl, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error("Server rejected scheduling frame.");
      
      setShowForm(false);
      fetchCoreData();
    } catch (err) {
      alert(`API Fault: ${err.message}`);
    }
    setSubmitting(false);
  };

  const openAttendance = async (sessionObj) => {
    setActiveAttendance(sessionObj);
    const token = localStorage.getItem('adminToken');
    const url = `${BASE_URL}/api/admin/attendance/${sessionObj.id}`;
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    if(res.ok) {
       setAttendanceRoster(await res.json());
    }
  };

  const saveAttendance = async () => {
    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    const url = `${BASE_URL}/api/admin/attendance`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ classSessionId: activeAttendance.id, records: attendanceRoster })
      });
      if(res.ok) {
        alert("Attendance matrix successfully locked.");
        setActiveAttendance(null);
      } else throw new Error("Fault updating arrays.");
    } catch(err) { alert(err.message); }
    setSubmitting(false);
  };

  const toggleStudentStatus = (userId) => {
    setAttendanceRoster(prev => prev.map(s => s.userId === userId ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s));
  };

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
          <div>
            <h2 className="fw-bold m-0" style={{ color: 'var(--color-primary)' }}>Global Live Classes</h2>
          </div>
            <p className="text-muted mb-0 mt-1">Bind temporal arrays and Jitsi portals securely to live batches.</p>
          </div>
          {!showForm && !activeAttendance && (
            <button className="btn btn-warning fw-bold px-4 shadow-sm" style={{ borderRadius: '8px' }} onClick={openNewForm}>
              <i className="fa fa-calendar-plus me-2"></i> Anchor New Class
            </button>
          )}
        </div>

        {activeAttendance ? (
          <div className="card shadow-lg border-0 rounded-4 slide-in border-info border-top border-4">
             <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                <div>
                   <h4 className="fw-bold text-dark mb-0"><i className="fa fa-users me-2 text-info"></i> Session Attendance Tracker</h4>
                   <p className="text-muted small mb-0 mt-1">{new Date(activeAttendance.sessionDate).toLocaleDateString()} | {activeAttendance.sessionTime}</p>
                </div>
                <div className="d-flex gap-2">
                   <button className="btn btn-sm btn-outline-secondary fw-bold" onClick={() => setActiveAttendance(null)}>Hide Roster</button>
                   <button className="btn btn-sm btn-info text-white fw-bold shadow-sm" onClick={saveAttendance} disabled={submitting}>Commit Log</button>
                </div>
             </div>
              <div className="card-body p-0">
                {attendanceRoster.length === 0 ? (
                  <div className="p-5 text-center text-muted fw-bold">No students linked to this parent batch.</div>
                ) : (
                  <>
                    {/* Desktop & Laptop View */}
                    <div className="d-none d-md-block">
                      <div className="table-responsive">
                         <table className="table table-hover align-middle mb-0">
                           <thead className="bg-light">
                             <tr>
                               <th className="px-4 py-3">Student Array</th>
                               <th>System Email</th>
                               <th className="text-end px-4">Audit Toggle</th>
                             </tr>
                           </thead>
                           <tbody>
                             {attendanceRoster.map(s => (
                               <tr key={s.userId}>
                                 <td className="px-4 fw-bold">{s.fullName}</td>
                                 <td>{s.email}</td>
                                 <td className="text-end px-4">
                                    <button 
                                       className={`btn btn-sm fw-bold px-3 rounded-pill shadow-sm ${s.status === 'present' ? 'btn-success' : 'btn-danger'}`}
                                       onClick={() => toggleStudentStatus(s.userId)}
                                    >
                                       {s.status === 'present' ? 'Present / Active' : 'Absent / Offline'}
                                    </button>
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div className="d-block d-md-none p-3 bg-light">
                      {attendanceRoster.map(s => (
                        <div key={s.userId} className="card shadow-sm border-0 rounded-4 mb-2 p-3 bg-white">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="fw-bold text-dark mb-0">{s.fullName}</h6>
                              <small className="text-muted text-break">{s.email}</small>
                            </div>
                            <button 
                               className={`btn btn-sm fw-bold px-3 py-2 rounded-pill shadow-sm ${s.status === 'present' ? 'btn-success' : 'btn-danger'}`}
                               onClick={() => toggleStudentStatus(s.userId)}
                               style={{ fontSize: '12px' }}
                            >
                               {s.status === 'present' ? 'Present' : 'Absent'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
          </div>
        ) : showForm ? (
          <div className="card shadow-sm border-0 rounded-4 mb-4 slide-in border-warning border-top border-4">
            <div className="card-body p-4 p-md-5">
              <h4 className="fw-bold mb-4 text-dark border-bottom pb-3">
                {editingId ? "Modify Class Mapping" : "Initialize Live Session"}
              </h4>
              <form onSubmit={submitSessionForm}>
                
                <div className="row g-4 mb-4">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">Select Active Batch <span className="text-danger">*</span></label>
                    <select className="form-select form-select-lg bg-light fw-bold" name="batch_id" value={formData.batch_id} onChange={handleInputChange} required>
                      <option value="">-- Associate Batch Layer --</option>
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.batchName} {b.course?.name ? `(${b.course.name})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row g-4 mb-5">
                  <div className="col-lg-3 col-md-6 col-12">
                     <label className="form-label fw-bold">Session Date <span className="text-danger">*</span></label>
                     <input type="date" className="form-control bg-light" name="session_date" value={formData.session_date} onChange={handleInputChange} required />
                  </div>
                  <div className="col-lg-3 col-md-6 col-12">
                     <label className="form-label fw-bold">Locked Time <span className="text-danger">*</span></label>
                     <input type="text" className="form-control bg-light" name="session_time" placeholder="e.g. 10:00 AM - 1:00 PM" value={formData.session_time} onChange={handleInputChange} required />
                  </div>
                  <div className="col-lg-3 col-md-6 col-12">
                     <label className="form-label fw-bold">Recurrence Option</label>
                     <select className="form-select bg-light fw-bold" name="recurrence" value={formData.recurrence || 'none'} onChange={handleInputChange}>
                       <option value="none">No Repeat (Single Class)</option>
                       <option value="daily">Daily Recurring Class</option>
                       <option value="weekly">Weekly Recurring Class</option>
                     </select>
                  </div>
                  <div className="col-lg-3 col-md-6 col-12">
                     <label className="form-label fw-bold">Meeting Portal Link (Jitsi/Zoom)</label>
                     <input type="url" className="form-control bg-light text-primary" name="meeting_link" placeholder="https://jitsi.belnet.be/..." value={formData.meeting_link} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="d-flex gap-3 justify-content-end border-top pt-4">
                   <button type="button" className="btn btn-outline-secondary px-5 fw-bold" onClick={() => setShowForm(false)} disabled={submitting}>Cancel Frame</button>
                   <button type="submit" className="btn btn-warning px-5 fw-bold shadow text-dark" disabled={submitting}>
                     {submitting ? 'Authenticating...' : (editingId ? 'Push Update' : 'Generate Class Session')}
                   </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-0">
              {loading ? (
                <div className="p-5 text-center fw-bold text-muted">Awaiting local network nodes...</div>
              ) : (
                <>
                  {/* Laptop & Desktop View (Grid/Table) */}
                  <div className="d-none d-lg-block">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="px-4 py-3">Assigned Batch Layer</th>
                            <th>Session Date String</th>
                            <th>Class Time Block</th>
                            <th>Portal Access Link</th>
                            <th className="text-end px-4">Architect Controls</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map(session => (
                            <tr key={session.id}>
                              <td className="px-4 fw-bold">
                                 <span className="text-dark d-block">{session.batch?.batchName || 'Orphaned'}</span>
                                 <small className="text-muted">{session.batch?.course?.name || 'Root Unknown'}</small>
                              </td>
                              <td className="fw-bold text-primary">
                                <i className="fa fa-calendar-day me-2"></i>
                                {new Date(session.sessionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                <div className="mt-1">
                                  {session.recurrence && session.recurrence !== 'none' ? (
                                    <span className="badge bg-info text-white text-uppercase" style={{ fontSize: '10px' }}>
                                      <i className="fa fa-sync-alt me-1 animate-spin-slow"></i> {session.recurrence}
                                    </span>
                                  ) : (
                                    <span className="badge bg-secondary text-white text-uppercase" style={{ fontSize: '10px' }}>Single</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                 <span className="badge bg-dark px-2 py-1"><i className="fa fa-clock me-1"></i> {session.sessionTime}</span>
                              </td>
                              <td>
                                 {session.meetingLink ? (
                                   <a href={session.meetingLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success fw-bold rounded-pill shadow-sm">
                                      Validate Node <i className="fa fa-external-link-alt ms-1"></i>
                                   </a>
                                 ) : (
                                   <span className="badge bg-danger">Offline</span>
                                 )}
                              </td>
                              <td className="text-end px-4">
                                <button className="btn btn-sm btn-outline-info fw-bold shadow-sm me-2" onClick={() => openAttendance(session)}><i className="fa fa-user-check"></i> Register Log</button>
                                <button className="btn btn-sm btn-outline-warning text-dark fw-bold me-2 shadow-sm" onClick={() => openEditForm(session)}>Re-Map</button>
                                <button className="btn btn-sm btn-outline-danger shadow-sm" onClick={() => deleteSession(session.id)}><i className="fa fa-trash"></i></button>
                              </td>
                            </tr>
                          ))}
                          {sessions.length === 0 && <tr><td colSpan="5" className="text-center py-5 fw-bold text-muted">No Live Access links deployed.</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile & Tablet View (Touch Card Deck) */}
                  <div className="d-block d-lg-none p-3 bg-light rounded-4">
                    {sessions.map(session => (
                      <div key={session.id} className="card shadow-sm border-0 rounded-4 mb-3 p-3 bg-white border-start border-warning border-4">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-bold text-dark mb-0">{session.batch?.batchName || 'Orphaned'}</h6>
                            <small className="text-muted">{session.batch?.course?.name || 'Root Unknown'}</small>
                          </div>
                          {session.meetingLink ? (
                            <a href={session.meetingLink} target="_blank" rel="noreferrer" className="btn btn-xs btn-outline-success fw-bold px-3 py-1 rounded-pill" style={{ fontSize: '11px' }}>
                               Join <i className="fa fa-external-link-alt ms-1"></i>
                            </a>
                          ) : (
                            <span className="badge bg-danger px-2 py-1" style={{ fontSize: '10px' }}>Offline</span>
                          )}
                        </div>

                        <div className="row g-2 mb-3 bg-light p-2 rounded-3 text-center mt-2">
                          <div className="col-6 text-start">
                            <small className="text-muted d-block" style={{ fontSize: '10px' }}>SESSION DATE</small>
                            <span className="fw-bold text-primary" style={{ fontSize: '12px' }}>
                              <i className="fa fa-calendar-day me-1"></i>
                              {new Date(session.sessionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            <div className="mt-1">
                              {session.recurrence && session.recurrence !== 'none' ? (
                                <span className="badge bg-info text-white text-uppercase" style={{ fontSize: '9px' }}>
                                  <i className="fa fa-sync-alt me-1"></i> {session.recurrence}
                                </span>
                              ) : (
                                <span className="badge bg-secondary text-white text-uppercase" style={{ fontSize: '9px' }}>Single</span>
                              )}
                            </div>
                          </div>
                          <div className="col-6 text-end border-start">
                            <small className="text-muted d-block" style={{ fontSize: '10px' }}>CLASS TIME</small>
                            <span className="badge bg-dark px-2 py-1 mt-1" style={{ fontSize: '11px' }}>
                              <i className="fa fa-clock me-1"></i> {session.sessionTime}
                            </span>
                          </div>
                        </div>

                        <div className="d-flex justify-content-between gap-2 pt-2 border-top">
                          <button className="btn btn-sm btn-outline-info fw-bold w-100 py-2" style={{ borderRadius: '8px' }} onClick={() => openAttendance(session)}>
                            <i className="fa fa-user-check me-1"></i> Attendance
                          </button>
                          <button className="btn btn-sm btn-outline-warning text-dark fw-bold w-100 py-2" style={{ borderRadius: '8px' }} onClick={() => openEditForm(session)}>
                            Re-Map
                          </button>
                          <button className="btn btn-sm btn-outline-danger px-3 py-2" style={{ borderRadius: '8px' }} onClick={() => deleteSession(session.id)}>
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                    {sessions.length === 0 && (
                      <div className="text-center py-5 fw-bold text-muted bg-white rounded-4 shadow-sm">
                        No Live Access links deployed.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminSessions;
