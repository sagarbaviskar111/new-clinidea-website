import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminEvents = () => {
  const adminRole = localStorage.getItem('adminRole') || 'superadmin';
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Participant Tracking State
  const [viewingParticipantsFor, setViewingParticipantsFor] = useState(null);
  const [participants, setParticipants] = useState([]);

  // Quiz Management State
  const [managingQuizFor, setManagingQuizFor] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkJson, setBulkJson] = useState('');
  const [questionData, setQuestionData] = useState({ id: null, questionText: '', options: ['', '', '', '', ''], correctOption: '', marks: 1 });
  
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    eventType: 'webinar',
    eventDate: '',
    eventTime: '',
    durationMinutes: '',
    meetingLink: '',
    youtubeUrl: '',
    imageUrl: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchEvents = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    const url = `${BASE_URL}/api/events`;
    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message !== 'Unauthorized') {
          console.error("Fetch error:", err);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchEvents();
  }, [navigate]);

  const handleOpenForm = (event = null, defaultType = 'webinar') => {
    if (event) {
      setIsEditing(true);
      setFormData({
        id: event.id,
        title: event.title || '',
        description: event.description || '',
        eventType: event.eventType || 'webinar',
        eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
        eventTime: event.eventTime || '',
        durationMinutes: event.durationMinutes || '',
        meetingLink: event.meetingLink || '',
        youtubeUrl: event.youtubeUrl || '',
        imageUrl: event.imageUrl || ''
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: null,
        title: '',
        description: '',
        eventType: defaultType,
        eventDate: '',
        eventTime: '',
        durationMinutes: '',
        meetingLink: '',
        youtubeUrl: '',
        imageUrl: ''
      });
    }
    setImageFile(null);
    setShowForm(true);
    // Scroll to the form section on mobile
    setTimeout(() => {
      const formEl = document.getElementById('event-form-section');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('adminToken');
    
    let uploadedImageUrl = formData.imageUrl;
    if (imageFile) {
      const uploadUrl = `${BASE_URL}/api/admin/upload-image`;
      const filePayload = new FormData();
      filePayload.append('image', imageFile);
      try {
        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: filePayload
        });
        if (uploadRes.ok) {
          const uData = await uploadRes.json();
          uploadedImageUrl = uData.url;
        } else {
          alert("Image upload failed. Proceeding without new image.");
        }
      } catch (err) {
        console.error("Upload error", err);
      }
    }
    
    const payload = {
      ...formData,
      imageUrl: uploadedImageUrl
    };
    
    const url = isEditing 
      ? `${BASE_URL}/api/admin/events/${formData.id}`
      : `${BASE_URL}/api/admin/events`;

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchEvents();
        setShowForm(false);
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (error) {
      console.error("Failed to save event", error);
      alert("Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event? All registrations will be deleted.")) return;
    
    const token = localStorage.getItem('adminToken');
    const url = `${BASE_URL}/api/admin/events/${id}`;

    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        fetchEvents();
      } else {
        alert("Failed to delete event.");
      }
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  };

  const handleViewParticipants = async (event) => {
    setViewingParticipantsFor(event);
    const token = localStorage.getItem('adminToken');
    const url = `${BASE_URL}/api/admin/events/${event.id}/participants`;
    
    try {
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setParticipants(data);
      }
    } catch (error) {
      console.error("Failed to fetch participants", error);
    }
  };

  const handleExportCSV = () => {
    if (participants.length === 0) return;
    
    const isQuiz = viewingParticipantsFor.eventType === 'quiz';
    const headers = isQuiz 
      ? ['Name', 'Phone', 'Email', 'Date', 'Score', 'Status']
      : ['Name', 'Phone', 'Email', 'Registration Date'];
    const csvRows = [headers.join(',')];
    
    participants.forEach(p => {
      const row = isQuiz
        ? [
            `"${p.name}"`,
            `"${p.phone}"`,
            `"${p.email}"`,
            `"${new Date(p.createdAt).toLocaleDateString()}"`,
            `"${p.score !== null ? p.score : '-'}"`,
            `"${p.status || 'in_progress'}"`
          ]
        : [
            `"${p.name}"`,
            `"${p.phone}"`,
            `"${p.email}"`,
            `"${new Date(p.createdAt).toLocaleDateString()}"`
          ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `event_${viewingParticipantsFor.id}_participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManageQuiz = async (event) => {
    setManagingQuizFor(event);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/events/${event.id}/questions`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        // Parse optionsJson because it is stored as a string
        const parsedData = data.map(q => ({
          ...q,
          optionsJson: JSON.parse(q.optionsJson || '[]')
        }));
        setQuizQuestions(parsedData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!questionData.correctOption) return alert('Please select a correct option.');
    const token = localStorage.getItem('adminToken');
    try {
      const payload = {
        questionText: questionData.questionText,
        optionsJson: questionData.options,
        correctOption: questionData.correctOption,
        marks: questionData.marks
      };
      
      const res = await fetch(`${BASE_URL}/api/admin/events/${managingQuizFor.id}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        handleManageQuiz(managingQuizFor); // reload
        setShowQuestionForm(false);
        setQuestionData({ id: null, questionText: '', options: ['', '', '', '', ''], correctOption: '', marks: 1 });
      } else {
        alert("Failed to save question");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkUpload = async () => {
    try {
      const parsed = JSON.parse(bulkJson);
      if (!Array.isArray(parsed)) return alert("JSON must be an array of questions.");
      
      const token = localStorage.getItem('adminToken');
      let successCount = 0;
      for (const q of parsed) {
        const options = q.options || q.answers || [];
        const payload = {
          questionText: q.question || q.questionText || "Untitled Question",
          optionsJson: options,
          correctOption: String(q.correctOption || q.correct_option || options[0] || ""),
          marks: parseInt(q.marks) || 1
        };
        const res = await fetch(`${BASE_URL}/api/admin/events/${managingQuizFor.id}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          successCount++;
        } else {
          console.error("Failed to upload question:", await res.text());
        }
      }
      
      handleManageQuiz(managingQuizFor);
      setBulkJson('');
      setShowBulkUpload(false);
      alert(`Bulk upload completed! Successfully added ${successCount} questions.`);
    } catch (err) {
      alert("Invalid JSON format or network error. Please ensure it's a valid JSON array.");
      console.error(err);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/questions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        handleManageQuiz(managingQuizFor);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;
    
    if (adminRole === 'lead_manager') {
      const regCount = event._count?.registrations || 0;
      const quizCount = event._count?.quizAttempts || 0;
      return (regCount + quizCount) > 0;
    }
    
    return true;
  });

  if (loading) return <div className="d-flex justify-content-center mt-5">Loading...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
          <h2 className="mb-0 fw-bold" style={{ color: 'var(--color-primary)' }}>Event Management</h2>
          </div>
        </div>

        {/* Landing Page Action Cards */}
        {adminRole !== 'lead_manager' && (
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div 
                className="card border-0 shadow-sm rounded-4 h-100 p-4 d-flex flex-column justify-content-center align-items-center" 
                style={{ backgroundColor: '#eef2ff', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #c7d2fe' }}
                onClick={() => handleOpenForm(null, 'webinar')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                  <i className="fa fa-video-camera"></i>
                </div>
                <h5 className="fw-bold mb-1 text-primary">Create Webinar</h5>
                <p className="text-muted small text-center mb-0">Host a live online seminar</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div 
                className="card border-0 shadow-sm rounded-4 h-100 p-4 d-flex flex-column justify-content-center align-items-center" 
                style={{ backgroundColor: '#fff5f5', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #fecdd3' }}
                onClick={() => handleOpenForm(null, 'demo')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                  <i className="fa fa-play-circle"></i>
                </div>
                <h5 className="fw-bold mb-1 text-danger">Create Demo</h5>
                <p className="text-muted small text-center mb-0">Add a course demonstration</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div 
                className="card border-0 shadow-sm rounded-4 h-100 p-4 d-flex flex-column justify-content-center align-items-center" 
                style={{ backgroundColor: '#f0fdf4', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid #bbf7d0' }}
                onClick={() => handleOpenForm(null, 'quiz')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mb-3 shadow" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                  <i className="fa fa-question-circle"></i>
                </div>
                <h5 className="fw-bold mb-1 text-success">Create Quiz</h5>
                <p className="text-muted small text-center mb-0">Build an automated test</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Top Controls */}
        <div className="row mb-4">
          <div className="col-md-8 mb-2">
            <input 
              type="text" 
              className="form-control p-3 shadow-sm border-0 rounded-3" 
              placeholder="Search by Title or Type..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="row flex-column-reverse flex-lg-row">
          <div className={showForm ? "col-lg-8" : "col-lg-12"}>
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: '70vh' }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light sticky-top">
                      <tr>
                        <th className="py-3 px-4">Date & Time</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Meeting Link</th>
                        <th className="text-center text-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.map(event => (
                        <tr key={event.id} className={formData.id === event.id ? 'table-primary' : ''}>
                          <td className="py-3 px-4 text-nowrap">
                            <div className="fw-bold">{new Date(event.eventDate).toLocaleDateString()}</div>
                            <div className="text-muted small">{event.eventTime}</div>
                          </td>
                          <td className="fw-bold">{event.title}</td>
                          <td><span className="badge bg-secondary text-uppercase">{event.eventType}</span></td>
                          <td>
                            {event.meetingLink ? (
                              <a href={event.meetingLink} target="_blank" rel="noreferrer" className="text-primary small">Join Link</a>
                            ) : (
                              <span className="text-muted small">None</span>
                            )}
                          </td>
                          <td className="text-center text-nowrap">
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              <button 
                                className="btn btn-sm btn-outline-info rounded-pill fw-bold"
                                onClick={() => handleViewParticipants(event)}
                              >
                                Participants
                              </button>
                              {adminRole !== 'lead_manager' && (
                                <>
                                  {event.eventType === 'quiz' && (
                                    <button 
                                      className="btn btn-sm btn-outline-warning rounded-pill fw-bold"
                                      onClick={() => handleManageQuiz(event)}
                                    >
                                      Manage Quiz
                                    </button>
                                  )}
                                  <button 
                                    className="btn btn-sm btn-outline-primary rounded-pill fw-bold"
                                    onClick={() => handleOpenForm(event)}
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-danger rounded-pill fw-bold"
                                    onClick={() => handleDeleteEvent(event.id)}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredEvents.length === 0 && (
                        <tr><td colSpan="5" className="text-center py-5 text-muted">No events found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="col-lg-4 mb-4 mb-lg-0" id="event-form-section">
              <div className="card border-0 shadow rounded-4 sticky-top" style={{ top: '20px', zIndex: 100 }}>
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 fw-bold border-bottom pb-2">{isEditing ? 'Edit Event' : 'Create Event'}</h4>
                  <button className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <div className="card-body px-4 pb-4">
                  <form onSubmit={handleSaveEvent}>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">Event Title</label>
                      <input 
                        type="text" 
                        className="form-control bg-light" 
                        required 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold small">Event Type</label>
                      <select 
                        className="form-select bg-light"
                        value={formData.eventType}
                        onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                      >
                        <option value="webinar">Webinar</option>
                        <option value="demo">Demo</option>
                        <option value="quiz">Quiz</option>
                        <option value="seminar">Seminar</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold small">Date</label>
                      <input 
                        type="date" 
                        className="form-control bg-light" 
                        required 
                        value={formData.eventDate}
                        onChange={(e) => setFormData({...formData, eventDate: e.target.value})}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold small">Time</label>
                      <input 
                        type="time" 
                        className="form-control bg-light" 
                        required 
                        value={formData.eventTime}
                        onChange={(e) => setFormData({...formData, eventTime: e.target.value})}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold small">Duration (Mins)</label>
                      <input 
                        type="number" 
                        className="form-control bg-light" 
                        placeholder="30"
                        value={formData.durationMinutes}
                        onChange={(e) => setFormData({...formData, durationMinutes: e.target.value})}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold small">Meeting Link</label>
                      <input 
                        type="url" 
                        className="form-control bg-light" 
                        placeholder="https://zoom.us/j/..."
                        value={formData.meetingLink}
                        onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold small">YouTube Video Link (Optional)</label>
                      <input 
                        type="url" 
                        className="form-control bg-light" 
                        placeholder="https://youtube.com/watch?v=..."
                        value={formData.youtubeUrl}
                        onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold small">Event Banner Image (Optional)</label>
                      <input 
                        type="file" 
                        className="form-control bg-light" 
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                      />
                      {formData.imageUrl && !imageFile && (
                        <div className="mt-2 small text-success">Current image is attached.</div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold small">Description</label>
                      <textarea 
                        className="form-control bg-light" 
                        rows="4" 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-sm" 
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Participants Modal */}
      {viewingParticipantsFor && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <div className="bg-white rounded-4 shadow p-4" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
              <h4 className="fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>Participants: {viewingParticipantsFor.title}</h4>
              <button className="btn-close" onClick={() => setViewingParticipantsFor(null)}></button>
            </div>
            
            <div className="mb-3 d-flex justify-content-end">
              <button className="btn btn-success fw-bold" onClick={handleExportCSV}>
                <span className="fa fa-download me-2"></span> Export to CSV
              </button>
            </div>
            
            <div className="table-responsive flex-grow-1" style={{ overflowY: 'auto' }}>
              <table className="table table-striped table-hover align-middle">
                <thead className="table-light sticky-top">
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Date</th>
                    {viewingParticipantsFor.eventType === 'quiz' && (
                      <>
                        <th>Score</th>
                        <th>Status</th>
                      </>
                    )}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map(p => (
                    <tr key={p.id}>
                      <td className="fw-bold">{p.name}</td>
                      <td>{p.phone}</td>
                      <td>{p.email}</td>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      {viewingParticipantsFor.eventType === 'quiz' && (
                        <>
                          <td className="fw-bold text-primary">{p.score !== null ? `${p.score}` : '-'}</td>
                          <td>
                            <span className={`badge ${p.status === 'submitted' ? 'bg-success' : 'bg-warning'} text-uppercase`}>
                              {p.status || 'in_progress'}
                            </span>
                          </td>
                        </>
                      )}
                      <td className="text-nowrap">
                        <div className="d-flex gap-2">
                          <a 
                            href={`tel:${p.phone}`}
                            className="btn btn-sm btn-success rounded-pill fw-bold px-3"
                            title="Call Participant"
                          >
                            <i className="fa fa-phone me-1"></i> Call
                          </a>
                          <a 
                            href={`https://wa.me/${p.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${p.name},\n\nThank you for registering for our upcoming event: ${viewingParticipantsFor.title}!\n\nDate: ${new Date(viewingParticipantsFor.eventDate).toLocaleDateString()}\nTime: ${viewingParticipantsFor.eventTime}\n\nWe look forward to seeing you there!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm text-white rounded-pill fw-bold px-3"
                            style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                            title="Message on WhatsApp"
                          >
                            <i className="fab fa-whatsapp me-1"></i> Msg
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {participants.length === 0 && (
                    <tr><td colSpan="5" className="text-center text-muted py-4">No participants registered yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Manager Modal */}
      {managingQuizFor && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }}>
          <div className="bg-white rounded-4 shadow p-3 p-md-4" style={{ width: '100%', maxWidth: '800px', maxHeight: '95vh', display: 'flex', flexDirection: 'column' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
              <h4 className="fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>Manage Quiz: {managingQuizFor.title}</h4>
              <button className="btn-close" onClick={() => setManagingQuizFor(null)}></button>
            </div>
            
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Questions ({quizQuestions.length})</h5>
              <div>
                <button className="btn btn-outline-primary fw-bold me-2" onClick={() => {setShowBulkUpload(!showBulkUpload); setShowQuestionForm(false);}}>
                  {showBulkUpload ? 'Cancel Bulk' : 'Bulk Import JSON'}
                </button>
                <button className="btn btn-success fw-bold" onClick={() => {setShowQuestionForm(!showQuestionForm); setShowBulkUpload(false);}}>
                  {showQuestionForm ? 'Cancel' : '+ Add Question'}
                </button>
              </div>
            </div>
            
            <div className="flex-grow-1" style={{ overflowY: 'auto' }}>
              {showBulkUpload && (
                <div className="card bg-light border-0 mb-4">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Paste JSON Array</h6>
                    <textarea 
                      className="form-control mb-3" 
                      rows="8" 
                      placeholder={'[\n  {\n    "question": "Sample Question?",\n    "options": ["A", "B", "C", "D", "E"],\n    "correctOption": "C",\n    "marks": 1\n  }\n]'}
                      value={bulkJson}
                      onChange={(e) => setBulkJson(e.target.value)}
                    ></textarea>
                    <button className="btn btn-primary fw-bold w-100" onClick={handleBulkUpload}>Import Questions</button>
                  </div>
                </div>
              )}

              {showQuestionForm && (
                <div className="card bg-light border-0 mb-4">
                  <div className="card-body">
                    <form onSubmit={handleSaveQuestion}>
                      <div className="mb-3">
                        <label className="fw-bold small">Question Text</label>
                        <input type="text" className="form-control" required value={questionData.questionText} onChange={e => setQuestionData({...questionData, questionText: e.target.value})} />
                      </div>
                      <div className="row mb-3">
                        {[0, 1, 2, 3, 4].map(i => (
                          <div className="col-md-6 mb-2" key={i}>
                            <label className="fw-bold small text-muted">Option {i + 1}</label>
                            <input type="text" className="form-control" value={questionData.options[i]} onChange={e => {
                              const newOptions = [...questionData.options];
                              newOptions[i] = e.target.value;
                              setQuestionData({...questionData, options: newOptions});
                            }} />
                          </div>
                        ))}
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="fw-bold small">Correct Option</label>
                          <select className="form-select" required value={questionData.correctOption} onChange={e => setQuestionData({...questionData, correctOption: e.target.value})}>
                            <option value="">Select Correct Option...</option>
                            {questionData.options.map((opt, i) => opt ? <option key={i} value={opt}>{opt}</option> : null)}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="fw-bold small">Marks</label>
                          <input type="number" className="form-control" required value={questionData.marks} onChange={e => setQuestionData({...questionData, marks: parseInt(e.target.value) || 1})} />
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary fw-bold w-100">Save Question</button>
                    </form>
                  </div>
                </div>
              )}

              {quizQuestions.map((q, idx) => (
                <div key={q.id} className="card border-0 shadow-sm mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h6 className="fw-bold mb-2">Q{idx + 1}. {q.questionText} <span className="badge bg-secondary ms-2">{q.marks} Marks</span></h6>
                      <button className="btn btn-sm text-danger" onClick={() => handleDeleteQuestion(q.id)}><i className="fa fa-trash"></i></button>
                    </div>
                    <ul className="list-unstyled mb-0 ms-3">
                      {q.optionsJson.map((opt, i) => (
                        <li key={i} className={opt === q.correctOption ? 'text-success fw-bold' : ''}>
                          {opt === q.correctOption ? '✓ ' : '• '} {opt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              {quizQuestions.length === 0 && !showQuestionForm && (
                <div className="text-center text-muted py-4">No questions added yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminEvents;
