import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminCertificates = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Issue Single Modal states
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    user_id: '',
    course_id: '',
    certificate_type: 'gcp'
  });
  const [generating, setGenerating] = useState(false);

  // Bulk Generation Modal states
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkBatchId, setBulkBatchId] = useState('');
  const [bulkGenerating, setBulkGenerating] = useState(false);

  // Upload Custom Certificate states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    user_id: '',
    course_id: '',
    certificate_type: 'custom'
  });
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [certRes, userRes, courseRes, batchRes] = await Promise.all([
        fetch(`${BASE_URL}/api/admin/certificates`, { headers }),
        fetch(`${BASE_URL}/api/admin/users`, { headers }),
        fetch(`${BASE_URL}/api/courses`),
        fetch(`${BASE_URL}/api/admin/batches`, { headers })
      ]);

      if (certRes.ok) setCertificates(await certRes.json());
      if (userRes.ok) setUsers(await userRes.json());
      if (courseRes.ok) setCourses(await courseRes.json());
      if (batchRes.ok) setBatches(await batchRes.json());
      
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/certificates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updatedCert = await res.json();
        setCertificates(prev => prev.map(c => c.id === id ? updatedCert : c));
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/generate-certificate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setShowModal(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to generate certificate');
      }
    } catch (err) {
      alert('Error generating certificate.');
    }
    setGenerating(false);
  };

  const handleBulkGenerate = async (e) => {
    e.preventDefault();
    setBulkGenerating(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/generate-certificate/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ batchId: bulkBatchId })
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        setShowBulkModal(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to bulk generate');
      }
    } catch (err) {
      alert('Error bulk generating.');
    }
    setBulkGenerating(false);
  };

  const handleUploadCustom = async (e) => {
    e.preventDefault();
    if (!uploadFile) return alert("Please select a file to upload.");
    setUploading(true);
    const token = localStorage.getItem('adminToken');
    
    const formData = new FormData();
    formData.append('user_id', uploadData.user_id);
    formData.append('course_id', uploadData.course_id);
    formData.append('certificate_type', uploadData.certificate_type);
    formData.append('file', uploadFile);

    try {
      const res = await fetch(`${BASE_URL}/api/admin/upload-certificate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        alert('Custom certificate uploaded successfully.');
        setShowUploadModal(false);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to upload certificate');
      }
    } catch (err) {
      alert('Error uploading certificate.');
    }
    setUploading(false);
  };

  const filteredCertificates = certificates.filter(c => 
    c.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center mt-5">Loading Admin Matrix...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
            <h2 className="fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>Certificate Control</h2>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-warning fw-bold shadow-sm text-dark" onClick={() => setShowBulkModal(true)}>
              <i className="fa fa-layer-group me-2"></i> Bulk Generate
            </button>
            <button className="btn btn-success fw-bold shadow-sm" onClick={() => setShowModal(true)}>
              <i className="fa fa-magic me-2"></i> Generate Single
            </button>
            <button className="btn btn-primary fw-bold shadow-sm" onClick={() => setShowUploadModal(true)}>
              <i className="fa fa-upload me-2"></i> Upload Custom
            </button>
          </div>
        </div>

        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-white border-0 pt-4 pb-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0">Master Registry</h5>
            <div className="input-group" style={{ width: '300px', maxWidth: '100%' }}>
              <span className="input-group-text bg-light border-end-0"><i className="fa fa-search text-muted"></i></span>
              <input 
                type="text" 
                className="form-control border-start-0 bg-light" 
                placeholder="Search by ID or Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="px-4">Certificate ID</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th className="text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map(cert => (
                    <tr key={cert.id}>
                      <td className="px-4 fw-bold font-monospace text-primary">{cert.certificateId}</td>
                      <td className="fw-bold text-dark">{cert.user?.fullName}</td>
                      <td>{cert.course?.name}</td>
                      <td>
                        <span className="badge bg-info text-uppercase">{cert.certificateType}</span>
                      </td>
                      <td>
                        {cert.status === 'revoked' ? (
                          <span className="badge bg-danger">Revoked</span>
                        ) : (
                          <span className="badge bg-success">Valid</span>
                        )}
                      </td>
                      <td className="text-end px-4">
                        <a 
                          href={`${BASE_URL}${cert.fileUrl}`}
                          target="_blank" 
                          rel="noreferrer" 
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          <i className="fa fa-download"></i>
                        </a>
                        {cert.status === 'revoked' ? (
                          <button onClick={() => handleStatusChange(cert.id, 'generated')} className="btn btn-sm btn-success">Restore</button>
                        ) : (
                          <button onClick={() => handleStatusChange(cert.id, 'revoked')} className="btn btn-sm btn-danger">Revoke</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredCertificates.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">No records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Issue Certificate Modal (Generate from Template) */}
        {showModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow">
                <div className="modal-header bg-light border-0">
                  <h5 className="modal-title fw-bold">Generate Template Certificate</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleGenerate}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-muted">Select Student</label>
                      <select 
                        className="form-select bg-light" 
                        required
                        value={formData.user_id}
                        onChange={e => setFormData({...formData, user_id: e.target.value})}
                      >
                        <option value="">-- Choose Target Student --</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-muted">Select Course Program</label>
                      <select 
                        className="form-select bg-light" 
                        required
                        value={formData.course_id}
                        onChange={e => setFormData({...formData, course_id: e.target.value})}
                      >
                        <option value="">-- Choose Course Vector --</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold small text-muted">Certificate Template</label>
                      <select 
                        className="form-select bg-light" 
                        required
                        value={formData.certificate_type}
                        onChange={e => setFormData({...formData, certificate_type: e.target.value})}
                      >
                        <option value="gcp">GCP Certification</option>
                        <option value="advanced">Advanced Certification</option>
                        <option value="internship">Internship Recognition</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer border-0 bg-light">
                    <button type="button" className="btn btn-secondary fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-success fw-bold px-4 shadow-sm" disabled={generating}>
                      {generating ? 'Processing PDF...' : 'Execute & Issue'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Upload Custom Certificate Modal */}
        {showUploadModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow">
                <div className="modal-header bg-primary text-white border-0">
                  <h5 className="modal-title fw-bold">Upload Custom Certificate</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowUploadModal(false)}></button>
                </div>
                <form onSubmit={handleUploadCustom}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-muted">Select Student</label>
                      <select 
                        className="form-select bg-light" 
                        required
                        value={uploadData.user_id}
                        onChange={e => setUploadData({...uploadData, user_id: e.target.value})}
                      >
                        <option value="">-- Choose Target Student --</option>
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-muted">Select Course Program</label>
                      <select 
                        className="form-select bg-light" 
                        required
                        value={uploadData.course_id}
                        onChange={e => setUploadData({...uploadData, course_id: e.target.value})}
                      >
                        <option value="">-- Choose Course Vector --</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold small text-muted">Certificate Label / Title</label>
                      <input 
                        type="text"
                        className="form-control bg-light" 
                        required
                        placeholder="e.g. Custom Participation"
                        value={uploadData.certificate_type}
                        onChange={e => setUploadData({...uploadData, certificate_type: e.target.value})}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold small text-muted">Certificate File (PDF or Image)</label>
                      <input 
                        type="file" 
                        className="form-control bg-light" 
                        required
                        onChange={e => setUploadFile(e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className="modal-footer border-0 bg-light">
                    <button type="button" className="btn btn-secondary fw-bold" onClick={() => setShowUploadModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary fw-bold px-4 shadow-sm" disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Upload & Assign to Student'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Generation Modal */}
        {showBulkModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow">
                <div className="modal-header bg-warning border-0">
                  <h5 className="modal-title fw-bold text-dark">Bulk Generate & Email Certificates</h5>
                  <button type="button" className="btn-close" onClick={() => setShowBulkModal(false)}></button>
                </div>
                <form onSubmit={handleBulkGenerate}>
                  <div className="modal-body p-4">
                    <p className="text-muted small">Select a Batch to automatically generate certificates for all enrolled students. The system will email them their PDFs automatically.</p>
                    <div className="mb-4">
                      <label className="form-label fw-bold small text-muted">Select Batch *</label>
                      <select 
                        className="form-select bg-light" 
                        required
                        value={bulkBatchId}
                        onChange={e => setBulkBatchId(e.target.value)}
                      >
                        <option value="">-- Choose Target Batch --</option>
                        {batches.map(b => (
                          <option key={b.id} value={b.id}>{b.batchName} ({b.course?.name})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer border-0 bg-light">
                    <button type="button" className="btn btn-secondary fw-bold" onClick={() => setShowBulkModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-warning text-dark fw-bold px-4 shadow-sm" disabled={bulkGenerating}>
                      {bulkGenerating ? 'Processing...' : 'Generate & Send All'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminCertificates;
