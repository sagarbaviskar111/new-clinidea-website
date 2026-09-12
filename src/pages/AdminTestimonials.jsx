import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminTestimonials = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    studentName: '',
    reviewText: '',
    rating: 5,
    imageUrl: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, [navigate]);

  const fetchTestimonials = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetch(`${BASE_URL}/api/admin/testimonials`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setTestimonials(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message !== 'Unauthorized') console.error(err);
        setLoading(false);
      });
  };

  const handleOpenForm = (t = null) => {
    if (t) {
      setIsEditing(true);
      setFormData({
        id: t.id,
        studentName: t.studentName,
        reviewText: t.reviewText,
        rating: t.rating,
        imageUrl: t.imageUrl || '',
        isActive: t.isActive
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: null,
        studentName: '',
        reviewText: '',
        rating: 5,
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
    const url = isEditing ? `${BASE_URL}/api/admin/testimonials/${formData.id}` : `${BASE_URL}/api/admin/testimonials`;
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
        fetchTestimonials();
        setShowForm(false);
      } else {
        alert("Failed to save testimonial.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (t) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/testimonials/${t.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !t.isActive })
      });
      if (res.ok) fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTestimonials = testimonials.filter(t => 
    t.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.reviewText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center mt-5">Loading Testimonials...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>Testimonials Manager</h2>
          </div>
          <button className="btn btn-success fw-bold px-4 shadow-sm" onClick={() => handleOpenForm()}>
            <i className="fa fa-plus me-2"></i> Add Review
          </button>
        </div>

        <div className="row">
          <div className={showForm ? "col-lg-8" : "col-lg-12"}>
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Student Reviews</h5>
                <input 
                  type="text" 
                  className="form-control bg-light" 
                  style={{ width: '250px' }}
                  placeholder="Search reviews..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4">Student</th>
                        <th>Rating</th>
                        <th>Review Snippet</th>
                        <th>Status</th>
                        <th className="text-end px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTestimonials.map(t => (
                        <tr key={t.id}>
                          <td className="px-4 fw-bold">
                            {t.imageUrl && <img loading="lazy" src={t.imageUrl.startsWith('http') ? t.imageUrl : `${BASE_URL}/${t.imageUrl.replace(/^\/+/, '')}`} alt="avatar" className="rounded-circle me-2" style={{width:'32px', height:'32px', objectFit:'cover'}}/>}
                            {t.studentName}
                          </td>
                          <td>
                            {[...Array(5)].map((star, i) => (
                              <i key={i} className={`fa fa-star ${i < t.rating ? 'text-warning' : 'text-muted'}`}></i>
                            ))}
                          </td>
                          <td className="text-muted text-truncate" style={{ maxWidth: '250px' }}>
                            {t.reviewText}
                          </td>
                          <td>
                            <button 
                              className={`btn btn-sm fw-bold ${t.isActive ? 'btn-success' : 'btn-secondary'}`}
                              onClick={() => handleToggleStatus(t)}
                            >
                              {t.isActive ? 'Live' : 'Hidden'}
                            </button>
                          </td>
                          <td className="text-end px-4">
                            <button className="btn btn-sm btn-outline-primary me-2 fw-bold" onClick={() => handleOpenForm(t)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleDelete(t.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                      {filteredTestimonials.length === 0 && (
                        <tr><td colSpan="5" className="text-center py-4 text-muted">No testimonials found.</td></tr>
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
                  <h5 className="mb-0 fw-bold border-bottom pb-2">{isEditing ? 'Edit Review' : 'Add Review'}</h5>
                  <button className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>
                <div className="card-body px-4 pb-4">
                  <form onSubmit={handleSave}>
                    <div className="mb-3">
                      <label className="form-label fw-bold small">Student Name</label>
                      <input 
                        type="text" 
                        className="form-control bg-light" 
                        required 
                        value={formData.studentName}
                        onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold small">Rating (1-5)</label>
                      <input 
                        type="number" 
                        min="1" max="5"
                        className="form-control bg-light" 
                        required 
                        value={formData.rating}
                        onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold small">Review Content</label>
                      <textarea 
                        className="form-control bg-light" 
                        rows="4" 
                        required
                        value={formData.reviewText}
                        onChange={(e) => setFormData({...formData, reviewText: e.target.value})}
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-bold small">Avatar Image (Optional)</label>
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

                    <div className="form-check mb-4">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        id="isActiveCheck"
                      />
                      <label className="form-check-label fw-bold small" htmlFor="isActiveCheck">
                        Publish on Website (Live)
                      </label>
                    </div>

                    <button 
                      type="submit"
                      className="btn btn-success w-100 py-3 fw-bold rounded-pill shadow-sm" 
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : (isEditing ? 'Update Review' : 'Add Review')}
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

export default AdminTestimonials;
