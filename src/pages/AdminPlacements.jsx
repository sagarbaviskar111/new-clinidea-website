import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminPlacements = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    studentName: '',
    imageUrl: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchPlacements();
  }, [navigate]);

  const fetchPlacements = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetch(`${BASE_URL}/api/admin/placements`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setPlacements(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message !== 'Unauthorized') console.error(err);
        setLoading(false);
      });
  };

  const handleOpenForm = (p = null) => {
    if (p) {
      setIsEditing(true);
      setFormData({
        id: p.id,
        studentName: p.studentName,
        imageUrl: p.imageUrl || '',
        isActive: p.isActive
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: null,
        studentName: '',
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
        } else {
          alert('Image upload failed!');
          setSubmitting(false);
          return;
        }
      } catch (err) {
        console.error("Upload error", err);
        setSubmitting(false);
        return;
      }
    } else if (!uploadedImageUrl) {
      alert("Please upload a placement poster image.");
      setSubmitting(false);
      return;
    }

    const payload = { ...formData, imageUrl: uploadedImageUrl };
    const url = isEditing ? `${BASE_URL}/api/admin/placements/${formData.id}` : `${BASE_URL}/api/admin/placements`;
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
        fetchPlacements();
        setShowForm(false);
      } else {
        alert("Failed to save placement record.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this placement record?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/placements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchPlacements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (p) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/placements/${p.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !p.isActive })
      });
      if (res.ok) fetchPlacements();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPlacements = placements.filter(p => 
    p.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-center mt-5">Loading Placement Records...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
          <h2 className="fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>Placements Hub</h2>
          </div>
          <button className="btn btn-success fw-bold px-4 shadow-sm" onClick={() => handleOpenForm()}>
            <i className="fa fa-plus me-2"></i> Upload New Placement
          </button>
        </div>

        <div className="row">
          <div className={showForm ? "col-lg-8" : "col-lg-12"}>
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Recent Placements</h5>
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
                        <th>Poster Preview</th>
                        <th>Upload Date</th>
                        <th>Visibility</th>
                        <th className="text-end px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlacements.map(p => (
                        <tr key={p.id}>
                          <td className="px-4 fw-bold text-dark">{p.studentName}</td>
                          <td>
                            {p.imageUrl ? (
                              <a href={p.imageUrl.startsWith('http') ? p.imageUrl : `${BASE_URL}/${p.imageUrl.replace(/^\/+/, '')}`} target="_blank" rel="noreferrer">
                                <img loading="lazy" src={p.imageUrl.startsWith('http') ? p.imageUrl : `${BASE_URL}/${p.imageUrl.replace(/^\/+/, '')}`} alt="poster" className="rounded shadow-sm" style={{width:'80px', height:'50px', objectFit:'cover', border: '1px solid #ddd'}}/>
                              </a>
                            ) : (
                              <span className="text-muted small">No Image</span>
                            )}
                          </td>
                          <td className="text-muted small">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button 
                              className={`btn btn-sm fw-bold ${p.isActive ? 'btn-success' : 'btn-secondary'}`}
                              onClick={() => handleToggleStatus(p)}
                            >
                              {p.isActive ? 'Live' : 'Hidden'}
                            </button>
                          </td>
                          <td className="text-end px-4">
                            <button className="btn btn-sm btn-outline-primary me-2 fw-bold" onClick={() => handleOpenForm(p)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => handleDelete(p.id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                      {filteredPlacements.length === 0 && (
                        <tr><td colSpan="5" className="text-center py-4 text-muted">No placement records found.</td></tr>
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
                  <h5 className="mb-0 fw-bold border-bottom pb-2">{isEditing ? 'Edit Placement' : 'Upload Placement'}</h5>
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
                      <label className="form-label fw-bold small">Placement Poster (High Res Image) <span className="text-danger">*</span></label>
                      <input 
                        type="file" 
                        className="form-control bg-light py-2" 
                        accept="image/*"
                        required={!isEditing && !formData.imageUrl}
                        onChange={(e) => setImageFile(e.target.files[0])}
                      />
                      {formData.imageUrl && !imageFile && (
                        <div className="mt-2 small text-success fw-bold"><i className="fa fa-check-circle me-1"></i> Current poster is securely attached.</div>
                      )}
                      <small className="text-muted mt-2 d-block">Upload the flyer showing the student and the company they got placed in.</small>
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
                      {submitting ? 'Uploading to Server...' : (isEditing ? 'Update Placement' : 'Publish Placement')}
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

export default AdminPlacements;
