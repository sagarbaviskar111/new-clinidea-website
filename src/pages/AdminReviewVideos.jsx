import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminReviewVideos = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    studentName: '',
    youtubeUrl: '',
    isActive: true
  });

  useEffect(() => {
    fetchVideos();
  }, [navigate]);

  const fetchVideos = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetch(`${BASE_URL}/api/admin/review-videos`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setVideos(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message !== 'Unauthorized') console.error(err);
        setLoading(false);
      });
  };

  const handleOpenForm = (v = null) => {
    if (v) {
      setIsEditing(true);
      setFormData({
        id: v.id,
        studentName: v.studentName,
        youtubeUrl: v.youtubeUrl || '',
        isActive: v.isActive
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: null,
        studentName: '',
        youtubeUrl: '',
        isActive: true
      });
    }
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    
    const url = isEditing ? `${BASE_URL}/api/admin/review-videos/${formData.id}` : `${BASE_URL}/api/admin/review-videos`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchVideos();
        setShowForm(false);
      } else {
        alert("Failed to save review video record.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video record?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/review-videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchVideos();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (v) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/review-videos/${v.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...v, isActive: !v.isActive })
      });
      if (res.ok) fetchVideos();
    } catch (err) {
      console.error(err);
    }
  };

  const getYoutubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const filteredVideos = videos.filter(v => 
    v.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center mt-5">Loading Review Videos...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
            <h2 className="fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>Student Review Videos</h2>
          </div>
          <button className="btn btn-success fw-bold px-4 shadow-sm" onClick={() => handleOpenForm()}>
            <i className="fa fa-plus me-2"></i> Add New Video
          </button>
        </div>

        <div className="row">
          <div className={showForm ? "col-lg-8" : "col-lg-12"}>
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Video Records</h5>
                <input 
                  type="text" 
                  className="form-control bg-light" 
                  style={{ width: '250px' }}
                  placeholder="Search by student name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4">Student Name</th>
                        <th>Video Preview</th>
                        <th>Upload Date</th>
                        <th>Visibility</th>
                        <th className="text-end px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVideos.map(v => {
                        const videoId = getYoutubeVideoId(v.youtubeUrl);
                        return (
                          <tr key={v.id}>
                            <td className="px-4 fw-bold text-dark">{v.studentName}</td>
                            <td>
                              {videoId ? (
                                <a href={v.youtubeUrl} target="_blank" rel="noreferrer">
                                  <img 
                                    loading="lazy" 
                                    src={`https://img.youtube.com/vi/${videoId}/default.jpg`} 
                                    alt="video thumbnail" 
                                    className="rounded shadow-sm" 
                                    style={{width:'80px', height:'60px', objectFit:'cover', border: '1px solid #ddd'}}
                                  />
                                </a>
                              ) : (
                                <span className="text-muted small">Invalid URL</span>
                              )}
                            </td>
                            <td className="text-muted small">
                              {new Date(v.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <button 
                                className={`btn btn-sm fw-bold ${v.isActive ? 'btn-success' : 'btn-secondary'}`}
                                onClick={() => handleToggleStatus(v)}
                              >
                                {v.isActive ? 'Live' : 'Hidden'}
                              </button>
                            </td>
                            <td className="text-end px-4">
                              <button className="btn btn-sm btn-outline-primary me-2 fw-bold" onClick={() => handleOpenForm(v)}>Edit</button>
                              <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleDelete(v.id)}>Delete</button>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredVideos.length === 0 && (
                        <tr><td colSpan="5" className="text-center py-4 text-muted">No review videos found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="col-lg-4">
              <div className="card border-0 shadow rounded-4 sticky-top" style={{ top: '20px' }}>
                <div className="card-header bg-white border-0 py-4 px-4 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold border-bottom pb-2">{isEditing ? 'Edit Video' : 'Add Video'}</h5>
                  <button className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <div className="card-body px-4 pb-4">
                  <form onSubmit={handleSave}>
                    <div className="mb-4">
                      <label className="form-label fw-bold small">Student Full Name</label>
                      <input 
                        type="text" 
                        className="form-control bg-light py-2" 
                        placeholder="e.g. Rahul Sharma"
                        required 
                        value={formData.studentName}
                        onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label fw-bold small">YouTube Video URL <span className="text-danger">*</span></label>
                      <input 
                        type="url" 
                        className="form-control bg-light py-2" 
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                        value={formData.youtubeUrl}
                        onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                      />
                      <small className="text-muted mt-2 d-block">Paste the full YouTube video link here.</small>
                    </div>

                    <div className="form-check mb-4">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        id="isActiveCheck"
                      />
                      <label className="form-check-label fw-bold small" htmlFor="isActiveCheck">
                        Publish on Website (Live immediately)
                      </label>
                    </div>

                    <button 
                      type="submit"
                      className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-sm" 
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : (isEditing ? 'Update Video' : 'Publish Video')}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewVideos;
