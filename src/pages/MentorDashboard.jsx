import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';
import MentorExams from '../components/mentor/MentorExams';
import MentorAssignments from '../components/mentor/MentorAssignments';
import MentorSchedule from '../components/mentor/MentorSchedule';
import '../admin.css';

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [activeTab, setActiveTab] = useState('batches'); 
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadsOpen, setIsUploadsOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Create Batch State
  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);
  const [newBatchForm, setNewBatchForm] = useState({
    batchName: '',
    courseName: 'Advanced Clinical Research & Pharmacovigilance (CR-PV)',
    startDate: '',
    classTime: '10:00 AM - 11:30 AM'
  });

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    if (!newBatchForm.batchName.trim()) return showMessage('Please enter a batch name', 'warning');

    const createdBatch = {
      id: Date.now(),
      name: newBatchForm.batchName,
      batchName: newBatchForm.batchName,
      course: { title: newBatchForm.courseName },
      startDate: newBatchForm.startDate || new Date().toISOString().split('T')[0],
      classTime: newBatchForm.classTime
    };

    setBatches(prev => [createdBatch, ...prev]);
    setShowCreateBatchModal(false);
    setNewBatchForm({
      batchName: '',
      courseName: 'Advanced Clinical Research & Pharmacovigilance (CR-PV)',
      startDate: '',
      classTime: '10:00 AM - 11:30 AM'
    });
    showMessage(`Batch "${createdBatch.name}" created successfully! You can now schedule classes and upload materials.`);
  };

  // Upload State
  const [uploadData, setUploadData] = useState({ title: '', description: '', moduleName: 'General' });
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedBatch) return showMessage('Please select a batch first', 'warning');
    if (!uploadFile) return showMessage('Please select a file to upload', 'warning');

    let category = 'Study Material';
    if (activeTab === 'upload_recording') category = 'Recorded sessions';
    if (activeTab === 'upload_study_material') category = 'Additional study material';
    if (activeTab === 'upload_question_bank') category = 'Question Bank';

    const formData = new FormData();
    formData.append('batchId', selectedBatch.id);
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('category', category);
    formData.append('moduleName', uploadData.moduleName);
    formData.append('file', uploadFile);

    setIsUploading(true);
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/lms-upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        showMessage('File uploaded successfully!');
        setUploadData({ title: '', description: '', moduleName: 'General' });
        setUploadFile(null);
        if (document.getElementById('fileInput')) {
           document.getElementById('fileInput').value = '';
        }
        fetchMaterials(selectedBatch.id);
      } else {
        const data = await res.json();
        showMessage(data.error || 'Upload failed', 'danger');
      }
    } catch (error) {
      showMessage('Upload error', 'danger');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchMentorData = async () => {
    const token = localStorage.getItem('mentorToken');
    if (!token) {
      navigate('/mentor/login');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/mentor/batches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBatches(Array.isArray(data) ? data : (data.batches || []));
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('mentorToken');
    navigate('/mentor/login');
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  const fetchMaterials = async (batchId) => {
    if (!batchId) return;
    setMaterialsLoading(true);
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/batches/${batchId}/content`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMaterials(data || []);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setMaterialsLoading(false);
    }
  };

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const fetchStudents = async (batchId) => {
    if (!batchId) return;
    setStudentsLoading(true);
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/batches/${batchId}/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBatch) {
      fetchMaterials(selectedBatch.id);
      fetchStudents(selectedBatch.id);
    }
  }, [selectedBatch, activeTab]);

  const handleDeleteContent = async (contentId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/content/${contentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showMessage('Item deleted successfully!');
        fetchMaterials(selectedBatch.id);
      } else {
        const data = await res.json();
        showMessage(data.error || 'Failed to delete item', 'danger');
      }
    } catch (error) {
      showMessage('Error deleting item', 'danger');
    }
  };

  const renderMaterialsList = (currentCategory) => {
    const filtered = materials.filter(m => {
      if (currentCategory === 'Recorded sessions') {
        return m.contentType === 'video' || m.category === 'Recorded sessions';
      } else if (currentCategory === 'Question Bank') {
        return m.category === 'Question Bank';
      } else {
        return m.category !== 'Recorded sessions' && m.category !== 'Question Bank';
      }
    });

    if (materialsLoading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="text-center py-5 border rounded-4 bg-light text-muted m-4" style={{ borderStyle: 'dashed' }}>
          <i className="fas fa-folder-open fs-2 mb-2 opacity-50"></i>
          <p className="mb-0 small">No uploaded materials in this category yet.</p>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-4 py-3" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Title / Module</th>
              <th className="py-3" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Type</th>
              <th className="py-3" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Date Uploaded</th>
              <th className="text-end pe-4 py-3" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              let icon = 'fa-file-alt';
              let color = 'text-secondary';
              if (m.contentType === 'video') { icon = 'fa-video'; color = 'text-danger'; }
              else if (m.contentType === 'pdf') { icon = 'fa-file-pdf'; color = 'text-danger'; }
              else if (m.contentType === 'ppt') { icon = 'fa-file-powerpoint'; color = 'text-warning'; }
              else if (m.contentType === 'doc') { icon = 'fa-file-word'; color = 'text-primary'; }

              const viewUrl = m.driveWebViewLink || m.localFileUrl;

              return (
                <tr key={m.id}>
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className={`fas ${icon} ${color} fs-5`}></i>
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{m.title}</div>
                        <small className="text-muted">{m.moduleName || 'General'}</small>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="badge bg-light text-dark text-capitalize px-3 py-2 rounded-pill border">
                      {m.contentType}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-muted small">
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="text-end pe-4 py-3">
                    <div className="d-flex align-items-center justify-content-end gap-2">
                      {viewUrl ? (
                        <a href={viewUrl.startsWith('http') ? viewUrl : `${BASE_URL}${viewUrl}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary rounded-pill px-3 py-2 fw-bold">
                          <i className="fas fa-external-link-alt me-1"></i> View
                        </a>
                      ) : (
                        <span className="text-muted small">N/A</span>
                      )}
                      <button onClick={() => handleDeleteContent(m.id)} className="btn btn-sm btn-outline-danger rounded-circle p-2" title="Delete Content" style={{ width: '36px', height: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const navItems = [
    { id: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
    { id: 'students', icon: 'fa-users', label: 'Students List' },
    { id: 'schedule', icon: 'fa-calendar-alt', label: 'Session schedule' },
    {
      id: 'resources',
      icon: 'fa-cloud-upload-alt',
      label: 'Upload & Resources',
      isDropdown: true,
      subItems: [
        { id: 'upload_recording', icon: 'fa-video', label: 'Upload recordings' },
        { id: 'upload_study_material', icon: 'fa-book', label: 'Upload Study Material' },
        { id: 'upload_question_bank', icon: 'fa-question-circle', label: 'Upload Question Bank' }
      ]
    },
    { id: 'exams', icon: 'fa-file-alt', label: 'Tests And Exams' },
    { id: 'assignments', icon: 'fa-tasks', label: 'Assignment' },
    { id: 'attendance', icon: 'fa-user-check', label: 'Attendance' },
    { id: 'tools', icon: 'fa-laptop-code', label: 'Tools' }
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    );
  }

  // If no batch is selected, show the "My Assigned Batches" Selection Page first!
  if (!selectedBatch) {
    return (
      <div className="min-vh-100 d-flex flex-column" style={{ background: '#f8fafc', color: '#1e293b' }}>
        <Helmet>
          <title>My Assigned Batches | Clinidea Mentor</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        {/* Top Navbar */}
        <header className="bg-white border-bottom py-3 px-4 shadow-sm">
          <div className="container-fluid d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white rounded-3 p-1 d-flex align-items-center justify-content-center border shadow-sm" style={{ width: '48px', height: '48px', borderColor: '#e2e8f0' }}>
                <img src="/clinidea-removebg-preview.webp" alt="Clinidea Education Logo" className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://clinidea.in/favicon.png'; }} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold text-dark fs-5" style={{ letterSpacing: '-0.3px' }}>Clinidea</h4>
                <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-2 py-0" style={{ fontSize: '11px' }}>Mentor Portal</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="d-none d-sm-block text-end">
                <p className="mb-0 fw-bold text-dark" style={{ lineHeight: '1.2' }}>Mentor</p>
                <small className="text-muted">Clinidea Team</small>
              </div>
              <button onClick={handleLogout} className="btn btn-sm rounded-4 px-3 py-2 fw-bold" style={{ background: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6' }}>
                <i className="fas fa-sign-out-alt me-1"></i> Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow-1 container py-4">
          <div className="text-center mb-4 max-w-2xl mx-auto">
            <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 fw-bold mb-3 fs-6">
              <i className="fas fa-users me-2"></i>My Assigned Batches
            </span>
            <h2 className="display-6 fw-bold text-dark mb-3">Select a Batch to Manage</h2>
            <p className="text-muted fs-5">
              Choose an assigned batch below to manage live class schedules, upload study materials, publish exams, and grade assignments.
            </p>
          </div>

          {message.text && (
            <div className="alert alert-success alert-dismissible fade show rounded-4 border-0 shadow-sm mb-4" role="alert">
              <i className="fas fa-check-circle me-2"></i> {message.text}
            </div>
          )}

          <div className="row g-4 justify-content-center">
            {batches.map(b => (
              <div key={b.id} className="col-md-6 col-lg-4">
                <div className="card border-0 rounded-4 h-100 bg-white batch-selection-card" 
                     style={{ 
                       boxShadow: '0 4px 25px rgba(0, 0, 0, 0.05)', 
                       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                       border: '1px solid #e2e8f0' 
                     }}>
                  <div className="card-body p-4 p-md-4 d-flex flex-column text-center position-relative">
                    {/* Top Accent Strip */}
                    <div className="position-absolute top-0 start-0 w-100 rounded-top-4" style={{ height: '5px', background: 'linear-gradient(90deg, #4f46e5 0%, #6366f1 100%)' }}></div>

                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4 mt-2 mx-auto border" 
                         style={{ width: '80px', height: '80px', borderColor: '#e0e7ff' }}>
                      <i className="fas fa-graduation-cap fs-1"></i>
                    </div>

                    <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill mx-auto mb-3" style={{ width: 'fit-content' }}>
                      <i className="fas fa-circle me-1" style={{ fontSize: '8px' }}></i> Active Assigned Batch
                    </span>

                    <h4 className="fw-bold text-dark mb-2">{b.name}</h4>
                    <p className="text-muted small mb-4 flex-grow-1">{b.course?.title || 'Clinical Research Program'}</p>

                    <button 
                      className="btn w-100 rounded-pill py-3 fw-bold shadow-sm text-white border-0 fs-6 d-flex align-items-center justify-content-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', transition: 'all 0.2s' }}
                      onClick={() => {
                        setSelectedBatch(b);
                        setActiveTab('schedule');
                        showMessage(`Entered batch: ${b.name}`);
                      }}
                    >
                      <span>Manage & Assign Content</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {batches.length === 0 && (
              <div className="col-md-8">
                <div className="card border-0 rounded-4 p-5 text-center bg-white shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
                  <div className="bg-light text-muted rounded-circle d-inline-flex align-items-center justify-content-center mb-4 mx-auto" style={{ width: '90px', height: '90px' }}>
                    <i className="fas fa-users-slash fs-1"></i>
                  </div>
                  <h3 className="fw-bold text-dark mb-2">No Batches Assigned Yet</h3>
                  <p className="text-muted fs-5 mb-0">
                    You do not have any active batches assigned to your mentor account. Once the administrator assigns a batch to you, it will appear here for you to manage.
                  </p>
                </div>
              </div>
            )}
          </div>

        </main>

        <style dangerouslySetInnerHTML={{__html: `
          .batch-selection-card:hover { 
            transform: translateY(-6px); 
            box-shadow: 0 15px 35px rgba(79, 70, 229, 0.12) !important; 
            border-color: #cbd5e1 !important; 
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column flex-md-row" style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <Helmet>
        <title>{selectedBatch ? `${selectedBatch.name} | Mentor Dashboard` : 'Mentor Dashboard'}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark"
             style={{ opacity: 0.5, zIndex: 1040 }}
             onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar - Clinidea Executive Midnight Slate Theme */}
      <div className={`d-flex flex-column transition-all duration-300 ${isSidebarOpen ? 'position-fixed h-100 w-75' : 'd-none d-md-flex'}`}
           style={{ 
             width: '280px', 
             zIndex: 1045, 
             background: '#0f172a', 
             borderRight: '1px solid rgba(255, 255, 255, 0.05)',
             boxShadow: '4px 0 24px rgba(0, 0, 0, 0.06)',
             color: '#94a3b8' 
           }}>
        <div className="p-4 d-flex align-items-center justify-content-between" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="d-flex align-items-center gap-3">
             <div className="bg-white rounded-3 p-1 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px' }}>
                <img src="/clinidea-removebg-preview.webp" alt="Clinidea Education Logo" className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://clinidea.in/favicon.png'; }} />
             </div>
             <div>
               <h4 className="mb-0 fw-bold text-white fs-5" style={{ letterSpacing: '-0.3px' }}>Clinidea</h4>
               <span className="badge bg-indigo bg-opacity-25 text-white fw-semibold px-2 py-0" style={{ fontSize: '11px', background: 'rgba(79, 70, 229, 0.3)' }}>Mentor Portal</span>
             </div>
          </div>
          <button className="btn d-md-none border-0 p-0 text-white-50" onClick={() => setIsSidebarOpen(false)}>
            <i className="fas fa-times fs-5"></i>
          </button>
        </div>
        
        {/* Selected Batch Card inside Sidebar Header */}
        <div className="p-3 mx-3 mt-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
           <small className="text-white-50 text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Active Batch</small>
           <h6 className="fw-bold text-white mb-2 text-truncate" title={selectedBatch.name}>{selectedBatch.name}</h6>
           <button onClick={() => setSelectedBatch(null)} className="btn btn-sm btn-light w-100 rounded-pill fw-bold" style={{ fontSize: '12px', background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: 'none' }}>
             <i className="fas fa-exchange-alt me-1"></i> Switch Batch
           </button>
        </div>

        <div className="p-3 flex-grow-1 overflow-auto custom-scrollbar">
          <p className="text-white-50 small fw-bold text-uppercase px-3 mt-2 mb-3" style={{ letterSpacing: '0.8px', fontSize: '11px', opacity: 0.6 }}>Batch Management</p>
          {navItems.map(item => {
            if (item.isDropdown) {
              const hasActiveChild = item.subItems.some(sub => activeTab === sub.id);
              return (
                <div key={item.id} className="mb-2">
                  <button
                    className="btn w-100 text-start py-3 px-3 rounded-4 d-flex align-items-center justify-content-between border-0 mentor-nav-btn"
                    onClick={() => setIsUploadsOpen(!isUploadsOpen)}
                    style={{ 
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
                      background: hasActiveChild ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      color: hasActiveChild ? '#ffffff' : '#94a3b8',
                      fontWeight: hasActiveChild ? '600' : '500',
                    }}
                    onMouseEnter={(e) => { 
                      if (!hasActiveChild) { 
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; 
                        e.currentTarget.style.color = '#ffffff';
                      } 
                    }}
                    onMouseLeave={(e) => { 
                      if (!hasActiveChild) { 
                        e.currentTarget.style.background = 'transparent'; 
                        e.currentTarget.style.color = '#94a3b8';
                      } 
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <i className={`fas ${item.icon} me-3 fs-5`} style={{ width: '24px', color: hasActiveChild ? '#ffffff' : '#64748b' }}></i>
                      <span>{item.label}</span>
                    </div>
                    <i className={`fas fa-chevron-${isUploadsOpen || hasActiveChild ? 'down' : 'right'} ms-2`} style={{ fontSize: '12px' }}></i>
                  </button>
                  
                  {(isUploadsOpen || hasActiveChild) && (
                    <div className="ps-3 mt-1 d-flex flex-column gap-1" style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', marginLeft: '24px' }}>
                      {item.subItems.map(sub => {
                        const isSubActive = activeTab === sub.id;
                        return (
                          <button
                            key={sub.id}
                            className="btn btn-sm text-start py-2 px-3 rounded-3 d-flex align-items-center border-0 mentor-sub-btn"
                            onClick={() => {
                              setActiveTab(sub.id);
                              setIsSidebarOpen(false);
                            }}
                            style={{
                              transition: 'all 0.2s',
                              background: isSubActive ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                              color: isSubActive ? '#ffffff' : '#94a3b8',
                              fontWeight: isSubActive ? '600' : '400',
                              fontSize: '13px'
                            }}
                            onMouseEnter={(e) => { 
                              if (!isSubActive) { 
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; 
                                e.currentTarget.style.color = '#ffffff';
                              } 
                            }}
                            onMouseLeave={(e) => { 
                              if (!isSubActive) { 
                                e.currentTarget.style.background = 'transparent'; 
                                e.currentTarget.style.color = '#94a3b8';
                              } 
                            }}
                          >
                            <i className={`fas ${sub.icon} me-2`} style={{ width: '16px', color: isSubActive ? '#ffffff' : '#64748b' }}></i>
                            <span>{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className="btn w-100 text-start mb-2 py-3 px-3 rounded-4 d-flex align-items-center border-0 mentor-nav-btn"
                onClick={() => { 
                  if (item.id === 'dashboard') {
                    setSelectedBatch(null);
                  } else {
                    setActiveTab(item.id); 
                  }
                  setIsSidebarOpen(false); 
                }}
                style={{ 
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
                  background: isActive ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: isActive ? '600' : '500',
                  boxShadow: isActive ? '0 4px 15px rgba(79, 70, 229, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => { 
                  if (!isActive) { 
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; 
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  } 
                }}
                onMouseLeave={(e) => { 
                  if (!isActive) { 
                    e.currentTarget.style.background = 'transparent'; 
                    e.currentTarget.style.color = '#94a3b8';
                    e.currentTarget.style.transform = 'translateX(0)';
                  } 
                }}
              >
                <i className={`fas ${item.icon} me-3 fs-5`} style={{ width: '24px', color: isActive ? '#ffffff' : '#64748b' }}></i>
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
        
        <div className="p-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button onClick={handleLogout} className="btn w-100 rounded-4 py-3 fw-bold d-flex align-items-center justify-content-center border-0" 
                  style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#f87171', transition: 'all 0.2s' }}
             onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'; e.currentTarget.style.color = '#ffffff'; }}
             onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'; e.currentTarget.style.color = '#f87171'; }}>
            <i className="fas fa-sign-out-alt me-2"></i> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column position-relative overflow-hidden">
        
        {/* Crisp White Floating Header */}
        <div className="m-3 m-md-3 mb-2 p-2.5 px-3 rounded-4 d-flex align-items-center justify-content-between sticky-top" 
             style={{ 
               background: 'rgba(255, 255, 255, 0.95)', 
               backdropFilter: 'blur(12px)', 
               zIndex: 1030, 
               border: '1px solid #e2e8f0',
               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
             }}>
          <div className="d-flex align-items-center gap-3">
            <button className="btn d-md-none border-0 me-1 p-0" onClick={() => setIsSidebarOpen(true)}>
              <div className="bg-light shadow-sm rounded-circle d-flex align-items-center justify-content-center text-dark border" style={{ width: '40px', height: '40px', borderColor: '#e2e8f0' }}>
                <i className="fas fa-bars"></i>
              </div>
            </button>
            <div>
              <h5 className="mb-0 fw-bold text-dark fs-5">
                {navItems.find(n => n.id === activeTab)?.label || 'Dashboard'}
              </h5>
              <small className="text-muted">Batch: <strong className="text-primary">{selectedBatch.name}</strong></small>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
             <button onClick={() => setSelectedBatch(null)} className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 fw-bold d-none d-sm-flex align-items-center gap-2">
                <i className="fas fa-exchange-alt"></i>
                <span>Switch Batch</span>
             </button>
             <div className="d-none d-sm-block text-end me-2">
                <p className="mb-0 fw-bold text-dark" style={{ lineHeight: '1.2' }}>Mentor</p>
                <small className="text-muted">Clinidea Team</small>
             </div>
             <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm border" style={{ width: '42px', height: '42px', background: '#eef2ff', color: '#4f46e5', borderColor: '#e0e7ff' }}>
                <i className="fas fa-user-tie fs-5"></i>
             </div>
          </div>
        </div>

        {message.text && (
          <div className="container-fluid px-4 pt-2">
             <div className={`alert alert-${message.type} alert-dismissible fade show rounded-4 border-0 shadow-sm`} role="alert">
                <i className={`fas ${message.type === 'danger' ? 'fa-exclamation-circle' : 'fa-check-circle'} me-2`}></i> {message.text}
             </div>
          </div>
        )}

        {/* Dynamic Content */}
        <div className="container-fluid px-3 px-md-4 py-3 overflow-auto flex-grow-1 custom-scrollbar">

          {activeTab === 'students' && (
            <div className="card border border-0 rounded-4 shadow-sm bg-white overflow-hidden" style={{ borderColor: '#e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div className="card-header bg-light border-bottom p-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                      <i className="fas fa-users fs-4"></i>
                    </div>
                    <div>
                      <h4 className="fw-bold mb-0 text-dark">Enrolled Students</h4>
                      <p className="text-muted small mb-0">Total active students in <span className="fw-bold text-dark">{selectedBatch.name}</span></p>
                    </div>
                  </div>
                  <span className="badge bg-primary px-3 py-2 rounded-pill fw-bold fs-6">
                    {students.length} Students
                  </span>
                </div>
              </div>
              <div className="card-body p-0">
                {studentsLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="fas fa-user-slash fs-1 mb-3 opacity-25"></i>
                    <p className="mb-0 fw-bold">No students are currently enrolled in this batch.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 text-dark">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-4 py-3">Student Name</th>
                          <th className="py-3">Email Address</th>
                          <th className="py-3">Phone Number</th>
                          <th className="py-3">Status</th>
                          <th className="text-end pe-4 py-3">Enrolled Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.id}>
                            <td className="ps-4 py-3 fw-bold text-dark">
                              <div className="d-flex align-items-center gap-3">
                                <div className="rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px', background: '#f1f5f9' }}>
                                  <i className="fas fa-user text-muted" style={{ fontSize: '14px' }}></i>
                                </div>
                                <span>{student.fullName}</span>
                              </div>
                            </td>
                            <td className="py-3">
                              <a href={`mailto:${student.email}`} className="text-primary fw-semibold">{student.email}</a>
                            </td>
                            <td className="py-3">
                              <a href={`tel:${student.phone}`} className="text-muted small">{student.phone || 'N/A'}</a>
                            </td>
                            <td className="py-3">
                              <span className={`badge ${student.enrollmentStatus === 'completed' ? 'bg-success' : 'bg-primary'} px-3 py-2 rounded-pill border`}>
                                {student.enrollmentStatus.toUpperCase()}
                              </span>
                            </td>
                            <td className="text-end pe-4 py-3 text-muted small">
                              {student.enrolledAt ? new Date(student.enrolledAt).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="card border rounded-4 p-4 bg-white" style={{ borderColor: '#e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
               <MentorSchedule selectedBatch={selectedBatch} showMessage={showMessage} />
            </div>
          )}

          {activeTab.startsWith('upload_') && (
            <div className="d-flex flex-column gap-4">
              <div className="card border rounded-4 overflow-hidden bg-white" style={{ borderColor: '#e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div className="p-3 px-4 border-bottom bg-light" style={{ borderColor: '#f1f5f9' }}>
                   <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                         <i className={`${navItems.find(n => n.id === activeTab)?.icon} fs-4`}></i>
                      </div>
                      <div>
                         <h4 className="fw-bold mb-0 text-dark">{navItems.find(n => n.id === activeTab)?.label}</h4>
                         <p className="text-muted small mb-0">Upload content for <span className="fw-bold text-dark">{selectedBatch.name}</span></p>
                      </div>
                   </div>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleUpload}>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-dark">Title</label>
                        <input type="text" className="form-control form-control-lg bg-white border" required 
                               style={{ borderColor: '#cbd5e1' }}
                               placeholder="Enter material title"
                               value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-dark">Module Name</label>
                        <input type="text" className="form-control form-control-lg bg-white border" required
                               style={{ borderColor: '#cbd5e1' }}
                               placeholder="e.g. Module 1"
                               value={uploadData.moduleName} onChange={e => setUploadData({...uploadData, moduleName: e.target.value})} />
                      </div>
                      <div className="col-md-12">
                        <label className="form-label fw-bold text-dark">Select File</label>
                        <div className="border border-2 border-dashed rounded-4 p-4 text-center" style={{ cursor: 'pointer', background: '#f8fafc', borderColor: '#cbd5e1' }} onClick={() => document.getElementById('fileInput').click()}>
                           <i className="fas fa-cloud-upload-alt fs-1 text-primary opacity-50 mb-3"></i>
                           <p className="fw-bold text-dark mb-1">Click to browse or drag and drop</p>
                           <small className="text-muted">Videos, PDFs, PPTs allowed (Max 500MB)</small>
                           <input type="file" id="fileInput" className="d-none" required onChange={e => {
                              setUploadFile(e.target.files[0]);
                              if(e.target.files[0]) showMessage(`File selected: ${e.target.files[0].name}`, 'success');
                           }} />
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold text-dark">Description (Optional)</label>
                        <textarea className="form-control bg-white border" style={{ borderColor: '#cbd5e1' }} rows="4" placeholder="Add any details about this material..."
                                  value={uploadData.description} onChange={e => setUploadData({...uploadData, description: e.target.value})}></textarea>
                      </div>
                      <div className="col-12 mt-4 pt-3 border-top" style={{ borderColor: '#f1f5f9' }}>
                        <button type="submit" className="btn text-white fw-bold fs-5 rounded-4 px-5 py-3 shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' }} disabled={isUploading}>
                          {isUploading ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Uploading...</> : <><i className="fas fa-upload me-2"></i> Publish Material</>}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Uploaded Materials List Card */}
              <div className="card border rounded-4 overflow-hidden bg-white" style={{ borderColor: '#e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div className="card-header bg-white border-bottom py-3 px-4">
                  <h5 className="fw-bold mb-0 text-dark">
                    <i className="fas fa-list-ul me-2 text-primary"></i> Uploaded {activeTab === 'upload_recording' ? 'Videos & Recordings' : activeTab === 'upload_question_bank' ? 'Question Banks' : 'PDFs & Study Materials'}
                  </h5>
                </div>
                <div className="card-body p-0">
                  {renderMaterialsList(
                    activeTab === 'upload_recording' ? 'Recorded sessions' :
                    activeTab === 'upload_question_bank' ? 'Question Bank' : 'Study Material'
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exams' && (
            <div className="card border rounded-4 p-4 bg-white" style={{ borderColor: '#e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
               <MentorExams selectedBatch={selectedBatch} showMessage={showMessage} />
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="card border rounded-4 p-4 bg-white" style={{ borderColor: '#e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
               <MentorAssignments selectedBatch={selectedBatch} showMessage={showMessage} />
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="card border rounded-4 p-4 bg-white" style={{ borderColor: '#e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
               <h4 className="fw-bold text-dark mb-3"><i className="fas fa-user-check text-success me-2"></i> Student Daily Attendance & Attendance Report Generator</h4>
               <MentorSchedule selectedBatch={selectedBatch} showMessage={showMessage} />
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="card border rounded-4 overflow-hidden position-relative bg-white" style={{ borderColor: '#e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
               <div className="card-body p-4 p-md-5">
                  <h3 className="fw-bold text-dark mb-4"><i className="fas fa-laptop-code text-primary me-2"></i> Vigithink Clinical Software Tools</h3>
                  <div className="row g-4">
                     <div className="col-md-4">
                        <div className="p-4 rounded-4 border bg-light text-center h-100">
                           <i className="fas fa-shield-alt text-success fs-1 mb-3"></i>
                           <h5 className="fw-bold text-dark">Vigithink Safety</h5>
                           <p className="text-muted small">Pharmacovigilance & ICSR Safety Database</p>
                           <a href="https://clinidea.in/vigithink/login" target="_blank" rel="noreferrer" className="btn btn-success rounded-pill px-4 fw-bold">Open Tool</a>
                        </div>
                     </div>
                     <div className="col-md-4">
                        <div className="p-4 rounded-4 border bg-light text-center h-100">
                           <i className="fas fa-folder-open text-warning fs-1 mb-3"></i>
                           <h5 className="fw-bold text-dark">Vigithink eTMF</h5>
                           <p className="text-muted small">electronic Trial Master File System</p>
                           <a href="https://clinidea.in/vigithinketmf/login" target="_blank" rel="noreferrer" className="btn btn-warning text-dark rounded-pill px-4 fw-bold">Open Tool</a>
                        </div>
                     </div>
                     <div className="col-md-4">
                        <div className="p-4 rounded-4 border bg-light text-center h-100">
                           <i className="fas fa-database text-primary fs-1 mb-3"></i>
                           <h5 className="fw-bold text-dark">Vigithink CDMS</h5>
                           <p className="text-muted small">Clinical Data Management System</p>
                           <a href="https://clinidea.in/vigithinkcdms/login" target="_blank" rel="noreferrer" className="btn btn-primary rounded-pill px-4 fw-bold">Open Tool</a>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Global CSS injected for nice scrollbar & hover effects */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        .batch-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.06) !important; border-color: #cbd5e1 !important; }
        .border-dashed { border-style: dashed !important; border-color: #cbd5e1 !important; transition: all 0.2s; }
        .border-dashed:hover { border-color: #4f46e5 !important; background-color: #eef2ff !important; }
        .cursor-pointer { cursor: pointer; }
        .mentor-nav-btn {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          border: none;
          letter-spacing: 0.1px;
        }
        .mentor-sub-btn {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          border: none;
          padding-left: 12px !important;
          margin-top: 2px;
          opacity: 0.85;
        }
        .mentor-sub-btn:hover {
          opacity: 1;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}} />
    </div>
  );
};

export default MentorDashboard;
