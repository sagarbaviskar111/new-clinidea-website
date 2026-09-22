import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const emptyCreateForm = { fullName: '', email: '', phone: '', password: '', registeredCourse: '', studentId: '' };
const emptyEditForm = { fullName: '', phone: '', registeredCourse: '', status: 'active', city: '', headline: '', bio: '', skills: '' };
const emptyCredForm = { email: '', studentId: '', newPassword: '' };

const AdminStudentPortfolios = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [banner, setBanner] = useState(null); // { type: 'success'|'danger', text }

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [createSaving, setCreateSaving] = useState(false);
  const [createError, setCreateError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editPortfolioRest, setEditPortfolioRest] = useState({});

  const [credId, setCredId] = useState(null);
  const [credForm, setCredForm] = useState(emptyCredForm);
  const [credSaving, setCredSaving] = useState(false);
  const [credError, setCredError] = useState(null);

  const [deletingId, setDeletingId] = useState(null);
  const [courseOptions, setCourseOptions] = useState([]);

  const token = () => localStorage.getItem('adminToken');

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.json())
      .then(list => setCourseOptions(Array.isArray(list) ? list : []))
      .catch(() => setCourseOptions([]));
  }, []);

  const fetchStudents = () => {
    const t = token();
    if (!t) { navigate('/admin/login'); return; }
    setLoading(true);
    fetch(`${BASE_URL}/api/admin/student-portfolios`, { headers: { Authorization: `Bearer ${t}` } })
      .then(res => { if (!res.ok) throw new Error('Failed to load students'); return res.json(); })
      .then(setStudents)
      .catch(() => setBanner({ type: 'danger', text: 'Failed to load student list.' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showBanner = (type, text) => {
    setBanner({ type, text });
    setTimeout(() => setBanner(null), 4000);
  };

  // ---------- Create ----------
  const openCreate = () => { setCreateForm(emptyCreateForm); setCreateError(null); setShowCreate(true); };
  const submitCreate = async (e) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/student-portfolios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(createForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create student.');
      setShowCreate(false);
      showBanner('success', `Student account created — ID: ${data.student.studentId}`);
      fetchStudents();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreateSaving(false);
    }
  };

  // ---------- Edit ----------
  const openEdit = async (student) => {
    setEditingId(student.id);
    setEditError(null);
    setEditLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/student-portfolios/${student.id}`, { headers: { Authorization: `Bearer ${token()}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load student details.');
      const portfolio = data.profile?.portfolio || {};
      setEditPortfolioRest(portfolio);
      setEditForm({
        fullName: data.fullName || '',
        phone: data.phone || '',
        registeredCourse: data.registeredCourse || '',
        status: data.status || 'active',
        city: data.profile?.city || '',
        headline: portfolio.headline || '',
        bio: portfolio.bio || '',
        skills: (portfolio.skills || []).join(', ')
      });
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };
  const closeEdit = () => { setEditingId(null); setEditForm(emptyEditForm); setEditPortfolioRest({}); };

  const submitEdit = async (e) => {
    e.preventDefault();
    setEditError(null);
    setEditSaving(true);
    try {
      const mergedPortfolio = {
        ...editPortfolioRest,
        headline: editForm.headline,
        bio: editForm.bio,
        skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch(`${BASE_URL}/api/admin/student-portfolios/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({
          fullName: editForm.fullName,
          phone: editForm.phone,
          registeredCourse: editForm.registeredCourse,
          status: editForm.status,
          city: editForm.city,
          portfolio: mergedPortfolio
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save changes.');
      closeEdit();
      showBanner('success', 'Student details updated.');
      fetchStudents();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditSaving(false);
    }
  };

  // ---------- Credentials ----------
  const openCredentials = (student) => {
    setCredId(student.id);
    setCredError(null);
    setCredForm({ email: student.email || '', studentId: student.studentId || '', newPassword: '' });
  };
  const closeCredentials = () => { setCredId(null); setCredForm(emptyCredForm); };

  const submitCredentials = async (e) => {
    e.preventDefault();
    setCredError(null);
    setCredSaving(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/student-portfolios/${credId}/credentials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify(credForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials.');
      closeCredentials();
      showBanner('success', 'Login ID / password updated.');
      fetchStudents();
    } catch (err) {
      setCredError(err.message);
    } finally {
      setCredSaving(false);
    }
  };

  // ---------- Delete ----------
  const confirmDelete = async (student) => {
    if (!window.confirm(`Delete ${student.fullName || student.email}? This permanently removes their login and portfolio.`)) return;
    setDeletingId(student.id);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/student-portfolios/${student.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete student.');
      showBanner('success', 'Student deleted.');
      setStudents(prev => prev.filter(s => s.id !== student.id));
    } catch (err) {
      showBanner('danger', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = students.filter(s => {
    const term = searchTerm.toLowerCase();
    return !term ||
      (s.fullName || '').toLowerCase().includes(term) ||
      (s.email || '').toLowerCase().includes(term) ||
      (s.studentId || '').toLowerCase().includes(term);
  });

  if (loading) return <div className="d-flex justify-content-center mt-5">Loading Student Portfolios...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <h2 className="fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>Student Portfolios</h2>
          <button className="btn btn-dark fw-bold px-4 rounded-3" onClick={openCreate}>
            <i className="fa fa-plus me-2"></i>Create Student Login
          </button>
        </div>

        {banner && (
          <div className={`alert alert-${banner.type} rounded-3 fw-bold`}>{banner.text}</div>
        )}

        <div className="bg-white p-3 rounded-4 shadow-sm border mb-4">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: 420 }}
            placeholder="Search by name, email, or Student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th>Student ID</th>
                    <th>Course</th>
                    <th>Documents</th>
                    <th>Payment</th>
                    <th>Portfolio</th>
                    <th className="text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => {
                    const enrollment = s.enrollments && s.enrollments[0];
                    return (
                      <tr key={s.id}>
                        <td className="py-3 px-4">
                          <span className="fw-bold d-block text-dark">{s.fullName || 'Unnamed'}</span>
                          <span className="d-block small text-muted">{s.email}</span>
                        </td>
                        <td>
                          {s.studentId ? (
                            <div className="d-flex flex-column align-items-start gap-1">
                              <span className="badge bg-primary">{s.studentId}</span>
                              <a href={`/student-portfolio/${s.studentId}`} target="_blank" rel="noreferrer" className="small fw-bold text-decoration-none">
                                View <i className="fa fa-arrow-up-right-from-square ms-1"></i>
                              </a>
                            </div>
                          ) : <span className="text-muted small">Not assigned</span>}
                        </td>
                        <td>
                          <span className="small text-wrap d-inline-block" style={{ maxWidth: 200 }}>{s.registeredCourse || <span className="text-muted">No course</span>}</span>
                        </td>
                        <td>
                          <span className={`badge ${s.documentsCount > 0 ? 'bg-success' : 'bg-secondary'}`}>{s.documentsCount || 0} uploaded</span>
                          {s.hasApplicationForm && <span className="badge bg-info text-dark ms-1">Form ✓</span>}
                        </td>
                        <td>
                          {enrollment ? (
                            <div className="small">
                              <div><span className="text-muted">Total:</span> <strong>₹{(enrollment.totalFees || 0).toLocaleString('en-IN')}</strong></div>
                              <div><span className="text-muted">Paid:</span> <strong className="text-success">₹{(enrollment.feesPaid || 0).toLocaleString('en-IN')}</strong></div>
                              {enrollment.feesPending > 0 && <div><span className="text-muted">Pending:</span> <strong className="text-danger">₹{enrollment.feesPending.toLocaleString('en-IN')}</strong></div>}
                            </div>
                          ) : (
                            <span className={`badge ${s.registrationFeePaid ? 'bg-success' : 'bg-danger'}`}>
                              {s.registrationFeePaid ? 'Registration Paid' : 'Unpaid'}
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${s.portfolioFilled ? 'bg-success' : 'bg-secondary'}`}>{s.portfolioFilled ? 'Filled' : 'Empty'}</span>
                        </td>
                        <td className="text-end px-4">
                          <div className="d-flex gap-2 justify-content-end flex-wrap">
                            <button className="btn btn-sm btn-outline-dark fw-bold" onClick={() => openEdit(s)}>
                              <i className="fa fa-pencil me-1"></i>Edit
                            </button>
                            <button className="btn btn-sm btn-warning fw-bold" onClick={() => openCredentials(s)}>
                              <i className="fa fa-key me-1"></i>ID / Password
                            </button>
                            <button className="btn btn-sm btn-outline-danger fw-bold" disabled={deletingId === s.id} onClick={() => confirmDelete(s)}>
                              <i className="fa fa-trash me-1"></i>{deletingId === s.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan="7" className="text-center py-5">No students match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="bg-white rounded-4 shadow-lg p-4" style={{ width: '100%', maxWidth: 480 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Create Student Login</h5>
              <button className="btn-close" onClick={() => setShowCreate(false)}></button>
            </div>
            {createError && <div className="alert alert-danger py-2 small fw-bold">{createError}</div>}
            <form onSubmit={submitCreate}>
              <div className="mb-2">
                <label className="form-label small fw-bold">Full Name *</label>
                <input className="form-control" required value={createForm.fullName} onChange={(e) => setCreateForm(p => ({ ...p, fullName: e.target.value }))} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold">Email *</label>
                <input type="email" className="form-control" required value={createForm.email} onChange={(e) => setCreateForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold">Phone</label>
                <input className="form-control" value={createForm.phone} onChange={(e) => setCreateForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold">Password * (min 6 characters)</label>
                <input type="password" className="form-control" required minLength={6} value={createForm.password} onChange={(e) => setCreateForm(p => ({ ...p, password: e.target.value }))} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold">Registered Course</label>
                <select className="form-select" value={createForm.registeredCourse} onChange={(e) => setCreateForm(p => ({ ...p, registeredCourse: e.target.value }))}>
                  <option value="">-- Select a Course --</option>
                  {courseOptions.map(c => (
                    <option key={c.id || c._id || c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Student ID <span className="text-muted">(optional — auto-generated if left blank)</span></label>
                <input className="form-control" value={createForm.studentId} onChange={(e) => setCreateForm(p => ({ ...p, studentId: e.target.value.toUpperCase() }))} />
              </div>
              <button type="submit" className="btn btn-dark w-100 fw-bold" disabled={createSaving}>
                {createSaving ? 'Creating...' : 'Create Student'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="bg-white rounded-4 shadow-lg p-4" style={{ width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Edit Student</h5>
              <button className="btn-close" onClick={closeEdit}></button>
            </div>
            {editLoading ? <div className="text-center py-4">Loading...</div> : (
              <>
                {editError && <div className="alert alert-danger py-2 small fw-bold">{editError}</div>}
                <form onSubmit={submitEdit}>
                  <div className="row g-2 mb-2">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Full Name</label>
                      <input className="form-control" value={editForm.fullName} onChange={(e) => setEditForm(p => ({ ...p, fullName: e.target.value }))} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Phone</label>
                      <input className="form-control" value={editForm.phone} onChange={(e) => setEditForm(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Registered Course</label>
                      <select className="form-select" value={editForm.registeredCourse} onChange={(e) => setEditForm(p => ({ ...p, registeredCourse: e.target.value }))}>
                        <option value="">-- Select a Course --</option>
                        {courseOptions.map(c => (
                          <option key={c.id || c._id || c.name} value={c.name}>{c.name}</option>
                        ))}
                        {editForm.registeredCourse && !courseOptions.some(c => c.name === editForm.registeredCourse) && (
                          <option value={editForm.registeredCourse}>{editForm.registeredCourse}</option>
                        )}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Status</label>
                      <select className="form-select" value={editForm.status} onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-bold">City</label>
                    <input className="form-control" value={editForm.city} onChange={(e) => setEditForm(p => ({ ...p, city: e.target.value }))} />
                  </div>
                  <hr />
                  <p className="small fw-bold text-muted mb-2">PORTFOLIO (public page)</p>
                  <div className="mb-2">
                    <label className="form-label small fw-bold">Headline</label>
                    <input className="form-control" value={editForm.headline} onChange={(e) => setEditForm(p => ({ ...p, headline: e.target.value }))} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-bold">Bio</label>
                    <textarea className="form-control" rows={3} value={editForm.bio} onChange={(e) => setEditForm(p => ({ ...p, bio: e.target.value }))} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Skills <span className="text-muted">(comma separated)</span></label>
                    <input className="form-control" value={editForm.skills} onChange={(e) => setEditForm(p => ({ ...p, skills: e.target.value }))} />
                    <div className="form-text">Education, projects, experience and achievements are edited by the student on their own portfolio page.</div>
                  </div>
                  <button type="submit" className="btn btn-dark w-100 fw-bold" disabled={editSaving}>
                    {editSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {credId && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="bg-white rounded-4 shadow-lg p-4" style={{ width: '100%', maxWidth: 440 }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Edit Login ID / Password</h5>
              <button className="btn-close" onClick={closeCredentials}></button>
            </div>
            {credError && <div className="alert alert-danger py-2 small fw-bold">{credError}</div>}
            <form onSubmit={submitCredentials}>
              <div className="mb-2">
                <label className="form-label small fw-bold">Login Email</label>
                <input type="email" className="form-control" value={credForm.email} onChange={(e) => setCredForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-bold">Student ID</label>
                <input className="form-control text-uppercase" value={credForm.studentId} onChange={(e) => setCredForm(p => ({ ...p, studentId: e.target.value.toUpperCase() }))} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">New Password <span className="text-muted">(leave blank to keep current)</span></label>
                <input type="password" className="form-control" minLength={6} value={credForm.newPassword} onChange={(e) => setCredForm(p => ({ ...p, newPassword: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-warning w-100 fw-bold" disabled={credSaving}>
                {credSaving ? 'Saving...' : 'Update Credentials'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudentPortfolios;
