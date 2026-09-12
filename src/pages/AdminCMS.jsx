import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminCMS = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    page: 'home',
    sectionKey: '',
    title: '',
    content: '',
    order: 0,
    imageUrl: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchContent();
  }, [navigate]);

  const fetchContent = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetch(`${BASE_URL}/api/admin/content`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setContentList(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message !== 'Unauthorized') console.error(err);
        setLoading(false);
      });
  };

  const handleOpenForm = (c = null) => {
    if (c) {
      setIsEditing(true);
      setFormData({
        id: c.id,
        page: c.page,
        sectionKey: c.sectionKey,
        title: c.title || '',
        content: c.content,
        order: c.order,
        imageUrl: c.imageUrl || '',
        isActive: c.isActive
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: null,
        page: 'home',
        sectionKey: '',
        title: '',
        content: '',
        order: 0,
        imageUrl: '',
        isActive: true
      });
    }
    setImageFile(null);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    
    let uploadedImageUrl = formData.imageUrl;
    
    // Upload image if selected
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
        }
      } catch (err) {
        console.error("Upload error", err);
      }
    }

    const payload = { ...formData, imageUrl: uploadedImageUrl };
    const url = isEditing ? `${BASE_URL}/api/admin/content/${formData.id}` : `${BASE_URL}/api/admin/content`;
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
        fetchContent();
        setShowForm(false);
      } else {
        alert("Failed to save content block.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this content block?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/content/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchContent();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredContent = contentList.filter(c => 
    c.page.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.sectionKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.title && c.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div className="text-center mt-5">Loading Content Database...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>Content Management System (CMS)</h2>
          </div>
          <button className="btn btn-success fw-bold px-4 shadow-sm" onClick={() => handleOpenForm()}>
            <i className="fa fa-plus me-2"></i> Add Content Block
          </button>
        </div>

        <div className="row">
          <div className={showForm ? "col-lg-8" : "col-lg-12"}>
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Dynamic Web Blocks</h5>
                <input 
                  type="text" 
                  className="form-control bg-light" 
                  style={{ width: '250px' }}
                  placeholder="Search by page or section..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4">Target Page</th>
                        <th>Section ID</th>
                        <th>Title Snippet</th>
                        <th>Status</th>
                        <th className="text-end px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContent.map(c => (
                        <tr key={c.id}>
                          <td className="px-4 fw-bold text-uppercase text-primary">{c.page}</td>
                          <td className="font-monospace small bg-light rounded px-2">{c.sectionKey}</td>
                          <td className="text-truncate" style={{ maxWidth: '200px' }}>
                            {c.title || <span className="text-muted fst-italic">No Title</span>}
                          </td>
                          <td>
                            {c.isActive ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-secondary">Draft</span>
                            )}
                          </td>
                          <td className="text-end px-4">
                            <button className="btn btn-sm btn-outline-primary me-2 fw-bold" onClick={() => handleOpenForm(c)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleDelete(c.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                      {filteredContent.length === 0 && (
                        <tr><td colSpan="5" className="text-center py-4 text-muted">No content blocks found.</td></tr>
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
                  <h5 className="mb-0 fw-bold border-bottom pb-2">{isEditing ? 'Edit Block' : 'New Block'}</h5>
                  <button className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <div className="card-body px-4 pb-4">
                  <form onSubmit={handleSave}>
                    <div className="row mb-3">
                      <div className="col-6">
                        <label className="form-label fw-bold small">Target Page</label>
                        <input 
                          type="text" 
                          className="form-control bg-light" 
                          placeholder="e.g., home"
                          required 
                          disabled={isEditing}
                          value={formData.page}
                          onChange={(e) => setFormData({...formData, page: e.target.value.toLowerCase()})}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-bold small">Section Key</label>
                        <input 
                          type="text" 
                          className="form-control bg-light" 
                          placeholder="e.g., hero_text"
                          required 
                          disabled={isEditing}
                          value={formData.sectionKey}
                          onChange={(e) => setFormData({...formData, sectionKey: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold small">Display Title (Optional)</label>
                      <input 
                        type="text" 
                        className="form-control bg-light" 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold small">Block Content (Supports HTML)</label>
                      <textarea 
                        className="form-control bg-light" 
                        rows="6" 
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold small">Associated Image (Optional)</label>
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

                    <div className="row mb-4">
                      <div className="col-6">
                        <label className="form-label fw-bold small">Display Order</label>
                        <input 
                          type="number" 
                          className="form-control bg-light" 
                          value={formData.order}
                          onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="col-6 d-flex align-items-end">
                        <div className="form-check mb-2">
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            checked={formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                            id="isActiveBlock"
                          />
                          <label className="form-check-label fw-bold small" htmlFor="isActiveBlock">
                            Active
                          </label>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-sm" 
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : (isEditing ? 'Update Block' : 'Create Block')}
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

export default AdminCMS;
