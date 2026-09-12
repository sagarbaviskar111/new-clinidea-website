import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

function AdminLMS() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [contents, setContents] = useState([]);
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Tabs
  const [activeTab, setActiveTab] = useState('content'); // content, live-sessions

  // Live Sessions State
  const [liveSessions, setLiveSessions] = useState([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    title: '', sessionTime: '', startDate: '', endDate: '', isRecurring: false, recurrenceType: 'daily'
  });
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [folderType, setFolderType] = useState('Additional Study Material');
  const [file, setFile] = useState(null);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editModule, setEditModule] = useState('');
  
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminRole = localStorage.getItem('adminRole') || 'superadmin';

  const fetchInitialData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      
      const batchesRes = await fetch(`${BASE_URL}/api/mentor/batches`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const batchData = await batchesRes.json();
      setBatches(Array.isArray(batchData) ? batchData : []);
      
      if (adminRole !== 'mentor') {
        const delRes = await fetch(`${BASE_URL}/api/admin/lms/delete-requests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (delRes.ok) {
          const delData = await delRes.json();
          setDeleteRequests(Array.isArray(delData) ? delData : []);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch initial data', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchContent = async (batchId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/batches/${batchId}/content`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch content');
    }
  };

  const fetchLiveSessions = async (batchId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/batches/${batchId}/live-sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLiveSessions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch live sessions');
    }
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setModuleName(batch.moduleName || ''); // Auto-fill for mentors
    fetchContent(batch.id);
    fetchLiveSessions(batch.id);
  };

  // --- Live Session & Recording Logic ---
  
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (isEditingSession) {
        const res = await fetch(`${BASE_URL}/api/admin/sessions/${editingSessionId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({
            batch_id: selectedBatch.id,
            session_date: scheduleData.startDate,
            session_time: scheduleData.sessionTime,
            meeting_link: `/live/${selectedBatch.id}`,
            recurrence: scheduleData.isRecurring ? scheduleData.recurrenceType : 'none',
            title: scheduleData.title
          })
        });
        if (res.ok) {
          alert('Session updated successfully');
          setShowScheduleForm(false);
          setIsEditingSession(false);
          setEditingSessionId(null);
          setScheduleData({
            title: '', sessionTime: '', startDate: '', endDate: '', isRecurring: false, recurrenceType: 'daily'
          });
          fetchLiveSessions(selectedBatch.id);
        } else {
          alert('Failed to update session');
        }
        return;
      }

      const res = await fetch(`${BASE_URL}/api/mentor/schedule-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ ...scheduleData, batchId: selectedBatch.id })
      });
      if (res.ok) {
        alert('Sessions scheduled successfully');
        setShowScheduleForm(false);
        setScheduleData({
          title: '', sessionTime: '', startDate: '', endDate: '', isRecurring: false, recurrenceType: 'daily'
        });
        fetchLiveSessions(selectedBatch.id);
      } else {
        alert('Failed to schedule sessions');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving session');
    }
  };

  const handleGoLive = async (sessionId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/session/${sessionId}/live`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Session is now LIVE! Notifications sent to students.');
        // Instantly launch the Jitsi classroom tab for the instructor with exact Course Name & Mentor role!
        window.open(`https://jitsi.belnet.be/Clinidea_LiveClass_Batch_${selectedBatch.id}_${sessionId}#userInfo.displayName="${encodeURIComponent('Mentor / Instructor')}"&config.prejoinPageEnabled=false`, '_blank');
        fetchLiveSessions(selectedBatch.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this scheduled session?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Session deleted successfully.');
        fetchLiveSessions(selectedBatch.id);
      } else {
        alert('Failed to delete session.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting session.');
    }
  };

  const handleEditSessionStart = (session) => {
    setIsEditingSession(true);
    setEditingSessionId(session.id);
    setScheduleData({
      title: session.title || '',
      sessionTime: session.sessionTime || '',
      startDate: session.sessionDate ? session.sessionDate.split('T')[0] : '',
      isRecurring: session.recurrence && session.recurrence !== 'none',
      recurrenceType: session.recurrence === 'daily' || session.recurrence === 'weekly' ? session.recurrence : 'daily',
      endDate: session.endDate ? session.endDate.split('T')[0] : ''
    });
    setShowScheduleForm(true);
  };


  const handleApproveDelete = async (id, action) => {
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = action === 'approve' ? 'approve' : 'reject';
      const res = await fetch(`${BASE_URL}/api/admin/lms/delete-requests/${id}/${endpoint}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert(`Delete request ${action}d successfully`);
        setDeleteRequests(deleteRequests.filter(req => req.id !== id));
        if (selectedBatch) fetchContent(selectedBatch.id);
      }
    } catch (err) {
      console.error('Failed to process delete request');
    }
  };

  // --- Content Actions ---
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedBatch) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('moduleName', moduleName || 'General');
    formData.append('folderType', folderType);
    formData.append('file', file);

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/batches/${selectedBatch.id}/content`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        alert('File uploaded to Google Drive successfully!');
        setTitle('');
        setDescription('');
        setModuleName('');
        setFolderType('Additional Study Material');
        setFile(null);
        e.target.reset();
        fetchContent(selectedBatch.id);
        document.getElementById('uploadFormSection').style.display = 'none';
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to upload');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
    setUploading(false);
  };

  const handleDelete = async (contentId) => {
    if (!window.confirm("Are you sure you want to delete this LMS file/material completely? It will be permanently removed from Google Drive and LMS database.")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/content/${contentId}`, {
        method: 'DELETE',
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      if (res.ok) {
        alert("LMS content deleted completely.");
        fetchContent(selectedBatch.id);
      } else {
        alert("Failed to delete LMS content.");
      }
    } catch (err) {
      console.error("Failed to delete content", err);
      alert("Error deleting LMS content.");
    }
  };

  const handleEditSave = async (contentId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/mentor/content/${contentId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ title: editTitle, moduleName: editModule })
      });
      if (res.ok) {
        setEditingId(null);
        fetchContent(selectedBatch.id);
      } else {
        alert("Failed to update content");
      }
    } catch (err) {
      console.error("Error updating content", err);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'video': return 'fa-video text-danger';
      case 'pdf': return 'fa-file-pdf text-danger';
      case 'ppt': return 'fa-file-powerpoint text-warning';
      default: return 'fa-file-alt text-primary';
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
            <h2 className="heading-premium mb-0">LMS & Drive Management</h2>
          </div>
        </div>

          <div className="row">
            {/* Batches Sidebar */}
            <div className="col-lg-4 mb-4">
              <div className="card-premium">
                <div className="card-header bg-white border-0 pt-4 pb-2" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                  <h5 className="heading-premium mb-0">{adminRole === 'mentor' ? 'My Assigned Batches' : 'All Batches'}</h5>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary"></div></div>
                  ) : batches.length === 0 ? (
                    <p className="text-muted text-center py-3">No batches found.</p>
                  ) : (
                    <div className="list-group list-group-flush" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                      {batches.map(batch => (
                        <button 
                          key={batch.id} 
                          className={`list-group-item list-group-item-action border-0 rounded-3 mb-2 p-3 ${selectedBatch?.id === batch.id ? 'bg-primary text-white shadow-sm' : 'bg-light'}`}
                          onClick={() => handleBatchSelect(batch)}
                        >
                          <h6 className="fw-bold mb-1">{batch.batchName}</h6>
                          <small className={selectedBatch?.id === batch.id ? 'text-white-50' : 'text-muted'}>
                            {batch.course?.name}
                          </small>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="col-lg-8">
              {!selectedBatch ? (
                <div className="card-premium text-center py-5" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="card-body">
                    <div className="mb-4"><i className="fa fa-chalkboard-teacher text-muted opacity-25" style={{ fontSize: '4rem' }}></i></div>
                    <h3 className="heading-premium text-dark mb-3">Welcome to LMS Control Center</h3>
                    <p className="text-muted fs-5">Please select a batch from the left menu to start.</p>
                  </div>
                </div>
              ) : (
                <>

                  {/* Tabs */}
                  <div className="nav nav-pills mb-4 gap-3">
                    <button className={`btn-premium px-4 py-2 ${activeTab === 'content' ? 'btn-primary-theme' : 'bg-white text-muted border'}`} onClick={() => setActiveTab('content')}>
                      <i className="fa fa-folder-open me-2"></i> Content Library
                    </button>
                    <button className={`btn-premium px-4 py-2 ${activeTab === 'live-sessions' ? 'btn-primary-theme' : 'bg-white text-muted border'}`} onClick={() => setActiveTab('live-sessions')}>
                      <i className="fa fa-video me-2"></i> Live Sessions
                    </button>
                  </div>

                  {activeTab === 'content' ? (
                    <>
                      {/* Main Action Buttons */}
                      <div className="card-premium mb-4 bg-light">
                        <div className="card-body p-4 text-center">
                          <h4 className="heading-premium mb-4">LMS Control Center: {selectedBatch.batchName}</h4>
                          <div className="d-flex flex-column flex-sm-row flex-wrap justify-content-center gap-3">
                            <button 
                              className="btn-premium px-4 py-3" style={{ backgroundColor: '#ef4444', color: 'white' }}
                              onClick={() => {
                                setFolderType('Recorded Sessions');
                                document.getElementById('uploadFormSection').style.display = 'block';
                              }}
                            >
                              <i className="fa fa-upload me-2 fs-5"></i> <span className="fs-6">Upload Recorded Session</span>
                            </button>
                            <button 
                              className="btn-premium btn-primary-theme px-4 py-3"
                              onClick={() => {
                                setFolderType('Presentations');
                                document.getElementById('uploadFormSection').style.display = 'block';
                              }}
                            >
                              <i className="fa fa-file-powerpoint me-2 fs-5"></i> <span className="fs-6">Upload Presentation</span>
                            </button>
                            <button 
                              className="btn-premium btn-accent-theme px-4 py-3"
                              onClick={() => {
                                setFolderType('Additional Study Material');
                                document.getElementById('uploadFormSection').style.display = 'block';
                              }}
                            >
                              <i className="fa fa-book me-2 fs-5"></i> <span className="fs-6">Upload Study Material</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Upload Form (Hidden by default) */}
                      <div id="uploadFormSection" className="card-premium mb-4" style={{ display: 'none' }}>
                        <div className="card-header bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                          <h5 className="heading-premium mb-0 text-primary"><i className="fa fa-upload me-2"></i>Upload File to {selectedBatch.batchName}</h5>
                          <button className="btn-close" onClick={() => document.getElementById('uploadFormSection').style.display = 'none'}></button>
                        </div>
                        <div className="card-body p-4">
                          <form onSubmit={handleUpload}>
                            <div className="row g-4 align-items-end">
                              <div className="col-md-3">
                                <label className="form-label fw-bold text-muted" style={{ fontSize: '0.9rem' }}>Content Title <span className="text-danger">*</span></label>
                                <input type="text" className="input-premium bg-light" required value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g. Session 1" />
                              </div>
                              <div className="col-md-3">
                                <label className="form-label fw-bold text-muted" style={{ fontSize: '0.9rem' }}>Module Name</label>
                                <input type="text" className="input-premium bg-white shadow-none text-muted" value={moduleName || 'General'} readOnly style={{ border: '1px solid #e2e8f0' }} />
                              </div>
                              <div className="col-md-3">
                                <label className="form-label fw-bold text-muted" style={{ fontSize: '0.9rem' }}>Content Type</label>
                                <input type="text" className="input-premium bg-white shadow-none text-primary" value={folderType} readOnly style={{ border: '1px solid #e2e8f0' }} />
                              </div>
                              <div className="col-md-3">
                                <label className="form-label fw-bold text-muted" style={{ fontSize: '0.9rem' }}>Select File <span className="text-danger">*</span></label>
                                <input type="file" className="input-premium" style={{ padding: '10px 14px' }} required onChange={(e)=>setFile(e.target.files[0])} accept={folderType === 'Recorded Sessions' ? 'video/*' : folderType === 'Presentations' ? '.pdf,.ppt,.pptx' : '*/*'} />
                              </div>
                              <div className="col-md-12 mt-4 text-end border-top pt-4">
                                <button type="submit" className="btn-premium btn-primary-theme px-5" disabled={uploading}>
                                  {uploading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span> Uploading...</>
                                  ) : (
                                    <><i className="fa fa-upload me-2"></i> Upload to LMS</>
                                  )}
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>

                      {/* Uploaded Content List */}
                      <div className="card-premium">
                        <div className="card-header bg-white border-0 pt-4 pb-3" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                          <h5 className="heading-premium mb-0"><i className="fa fa-folder-open text-warning me-2"></i>Batch Materials & Recordings</h5>
                        </div>
                        <div className="card-body p-0">
                          {contents.length === 0 ? (
                            <div className="text-center py-5">
                              <i className="fa fa-box-open fs-1 text-muted opacity-25 mb-3"></i>
                              <p className="text-muted fs-5 mb-0">No materials have been uploaded for this batch yet.</p>
                            </div>
                          ) : (
                            <div className="table-responsive">
                              <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th className="ps-4 py-3">Module</th>
                                    <th className="py-3">Title</th>
                                    <th className="py-3">Type</th>
                                    <th className="py-3">Date Added</th>
                                    <th className="text-end pe-4 py-3">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {contents.map(content => (
                                    <tr key={content.id}>
                                      <td className="ps-4">
                                        {editingId === content.id ? (
                                          <input type="text" className="form-control form-control-sm" value={editModule} onChange={e => setEditModule(e.target.value)} />
                                        ) : (
                                          <span className="badge bg-secondary rounded-pill px-3 py-2">{content.moduleName}</span>
                                        )}
                                      </td>
                                      <td className="fw-bold">
                                        {editingId === content.id ? (
                                          <input type="text" className="form-control form-control-sm" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                                        ) : (
                                          content.driveWebViewLink ? (
                                            <a href={content.driveWebViewLink} target="_blank" rel="noreferrer" className="text-decoration-none text-primary">
                                              {content.title}
                                            </a>
                                          ) : content.title
                                        )}
                                      </td>
                                      <td><i className={`fa ${getIcon(content.contentType)} fs-4`}></i></td>
                                      <td className="text-muted">{new Date(content.createdAt).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}</td>
                                      <td className="text-end pe-4">
                                        {editingId === content.id ? (
                                          <div className="d-flex justify-content-end gap-1">
                                            <button className="btn btn-sm btn-success rounded-circle" style={{ width: '35px', height: '35px' }} onClick={() => handleEditSave(content.id)} title="Save">
                                              <i className="fa fa-check"></i>
                                            </button>
                                            <button className="btn btn-sm btn-secondary rounded-circle" style={{ width: '35px', height: '35px' }} onClick={() => setEditingId(null)} title="Cancel">
                                              <i className="fa fa-times"></i>
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="d-flex justify-content-end gap-1">
                                            <button className="btn btn-sm btn-outline-primary rounded-circle" style={{ width: '35px', height: '35px' }} onClick={() => { setEditingId(content.id); setEditTitle(content.title); setEditModule(content.moduleName); }} title="Edit Name">
                                              <i className="fa fa-pen"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger rounded-circle" style={{ width: '35px', height: '35px' }} onClick={() => handleDelete(content.id)} title="Delete File">
                                              <i className="fa fa-trash"></i>
                                            </button>
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Live Sessions Manager */}
                      <div className="card-premium mb-4 bg-light">
                        <div className="card-body p-4 text-center">
                          <h4 className="heading-premium mb-4">Live Session Management</h4>
                          <div className="d-flex flex-column flex-sm-row flex-wrap justify-content-center gap-3">
                             <button className="btn-premium btn-primary-theme px-4 py-3" onClick={() => setShowScheduleForm(!showScheduleForm)}>
                              <i className="fa fa-calendar-plus me-2 fs-5"></i> <span className="fs-6">Schedule Session(s)</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Form */}
                      {showScheduleForm && (
                        <div className="card-premium mb-4">
                          <div className="card-header bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                            <h5 className="heading-premium mb-0 text-primary">
                              {isEditingSession ? 'Edit Scheduled Session' : 'Schedule New Session(s)'}
                            </h5>
                            <button className="btn-close" onClick={() => {
                              setShowScheduleForm(false);
                              setIsEditingSession(false);
                              setEditingSessionId(null);
                              setScheduleData({
                                title: '', sessionTime: '', startDate: '', endDate: '', isRecurring: false, recurrenceType: 'daily'
                              });
                            }}></button>
                          </div>
                          <div className="card-body p-4">
                            <form onSubmit={handleScheduleSubmit}>
                              <div className="row g-3">
                                <div className="col-md-6">
                                  <label className="form-label">Meeting Name/Title (Optional)</label>
                                  <input type="text" className="input-premium" value={scheduleData.title} onChange={e=>setScheduleData({...scheduleData, title: e.target.value})} placeholder="e.g. Clinical Research Live Daily Class" />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">Start Date *</label>
                                  <input type="date" className="input-premium" required value={scheduleData.startDate} onChange={e=>setScheduleData({...scheduleData, startDate: e.target.value})} />
                                </div>
                                <div className="col-md-3">
                                  <label className="form-label">Time *</label>
                                  <input type="time" className="input-premium" required value={scheduleData.sessionTime} onChange={e=>setScheduleData({...scheduleData, sessionTime: e.target.value})} />
                                </div>
                                <div className="col-12 mt-3">
                                  <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" checked={scheduleData.isRecurring} onChange={e=>setScheduleData({...scheduleData, isRecurring: e.target.checked})} id="recurrenceSwitch" />
                                    <label className="form-check-label fw-bold" htmlFor="recurrenceSwitch">Make this a recurring session</label>
                                  </div>
                                </div>
                                {scheduleData.isRecurring && (
                                  <>
                                    <div className="col-md-6 mt-3">
                                      <label className="form-label">Recurrence Pattern</label>
                                      <select className="input-premium" value={scheduleData.recurrenceType} onChange={e=>setScheduleData({...scheduleData, recurrenceType: e.target.value})}>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                      </select>
                                    </div>
                                    <div className="col-md-6 mt-3">
                                      <label className="form-label">End Date *</label>
                                      <input type="date" className="input-premium" required={scheduleData.isRecurring} value={scheduleData.endDate} onChange={e=>setScheduleData({...scheduleData, endDate: e.target.value})} />
                                    </div>
                                  </>
                                )}
                                <div className="col-12 mt-4 text-end">
                                  <button type="submit" className="btn-premium btn-primary-theme px-5">
                                    {isEditingSession ? 'Update Session' : 'Schedule Now'}
                                  </button>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}

                      {/* Sessions List */}
                      <div className="card-premium">
                        <div className="card-header bg-white border-0 pt-4 pb-3" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                          <h5 className="heading-premium mb-0"><i className="fa fa-calendar-check text-warning me-2"></i>Upcoming & Live Sessions</h5>
                        </div>
                        <div className="card-body p-0">
                          {liveSessions.length === 0 ? (
                            <div className="text-center py-5">
                              <i className="fa fa-calendar-times fs-1 text-muted opacity-25 mb-3"></i>
                              <p className="text-muted fs-5 mb-0">No upcoming sessions scheduled.</p>
                            </div>
                          ) : (
                            <div className="table-responsive">
                              <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th className="ps-4 py-3">Date</th>
                                    <th className="py-3">Time</th>
                                    <th className="py-3">Title</th>
                                    <th className="py-3">Status</th>
                                    <th className="text-end pe-4 py-3">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {liveSessions.map(session => (
                                    <tr key={session.id}>
                                      <td className="ps-4 text-muted fw-bold">{new Date(session.sessionDate).toLocaleDateString()}</td>
                                      <td className="fw-bold">{session.sessionTime}</td>
                                      <td>{session.title}</td>
                                      <td>
                                        {session.status === 'live' ? (
                                          <span className="badge bg-danger rounded-pill px-3 py-2 heartbeat">Live Now</span>
                                        ) : session.status === 'completed' ? (
                                          <span className="badge bg-secondary rounded-pill px-3 py-2">Completed</span>
                                        ) : (
                                          <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 border border-primary border-opacity-25">Upcoming</span>
                                        )}
                                      </td>
                                      <td className="text-end pe-4">
                                        {session.status === 'upcoming' && (
                                          <button onClick={() => handleGoLive(session.id)} className="btn btn-sm btn-danger rounded-pill px-3 shadow-sm" title="Notify Students & Go Live">
                                            Go Live <i className="fa fa-broadcast-tower ms-1"></i>
                                          </button>
                                        )}
                                        {session.status === 'live' && (
                                          <a href={`https://jitsi.belnet.be/Clinidea_LiveClass_Batch_${selectedBatch.id}_${session.id}#userInfo.displayName="${encodeURIComponent('Mentor / Instructor')}"&config.prejoinPageEnabled=false`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-success rounded-pill px-3 shadow-sm" title="Re-join Jitsi Room">
                                            Enter Jitsi <i className="fa fa-external-link-alt ms-1"></i>
                                          </a>
                                        )}
                                        <button 
                                          onClick={() => handleEditSessionStart(session)} 
                                          className="btn btn-sm btn-outline-primary rounded-pill px-3 ms-2 shadow-sm" 
                                          title="Edit Session"
                                        >
                                          Edit <i className="fa fa-edit"></i>
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteSession(session.id)} 
                                          className="btn btn-sm btn-outline-danger rounded-pill px-3 ms-2 shadow-sm" 
                                          title="Delete Session"
                                        >
                                          <i className="fa fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      </div>

                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default AdminLMS;
