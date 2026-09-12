import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminMentorManagement = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payoutModal, setPayoutModal] = useState({ show: false, mentor: null, amount: 5000, notes: '' });

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/mentors-management`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMentors(data.mentors || []);
      } else {
        // Fallback sample mock data
        setMentors([
          { id: 1, name: 'Prof. Ramesh Kumar', email: 'ramesh.mentor@clinidea.in', activeBatches: ['CR-PV-2026A', 'CR-PV-2026B'], classesTaken: 24, cancelledSessions: 1, status: 'Active (In Class)', pendingPayout: 12000, completedPayout: 48000 },
          { id: 2, name: 'Dr. Sunita Deshmukh', email: 'sunita.mentor@clinidea.in', activeBatches: ['CR-DM-2026A'], classesTaken: 18, cancelledSessions: 0, status: 'Active', pendingPayout: 8500, completedPayout: 32000 },
          { id: 3, name: 'Dr. Vikramaditya', email: 'vikram.mentor@clinidea.in', activeBatches: ['Medical Writing 2026'], classesTaken: 12, cancelledSessions: 2, status: 'Inactive', pendingPayout: 0, completedPayout: 24000 }
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPaySlip = (m) => {
    alert(`Downloading Pay Slip for ${m.name}... (Amount: ₹${m.completedPayout || m.pendingPayout})`);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMentor, setNewMentor] = useState({ name: '', email: '', password: '' });
  const [adding, setAdding] = useState(false);

  const handleCreateMentor = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newMentor.email,
          password: newMentor.password,
          role: 'mentor',
          name: newMentor.name,
          fullName: newMentor.name
        })
      });
      if (res.ok) {
        alert("Mentor created successfully!");
        setShowAddModal(false);
        setNewMentor({ name: '', email: '', password: '' });
        fetchMentors();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to create mentor.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content flex-grow-1 p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
            <h2 className="mb-0 fw-bold" style={{ color: 'var(--admin-primary)' }}>Mentor Management</h2>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm" onClick={() => setShowAddModal(true)}>
              <i className="fas fa-user-plus me-2"></i> Create Mentor
            </button>
            <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" onClick={fetchMentors}>
              <i className="fas fa-sync-alt me-2"></i> Refresh Mentors
            </button>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
          <div className="card-header bg-light p-3 px-4 border-bottom">
            <h5 className="mb-0 fw-bold text-dark">Mentor Activities & Payout Tracker</h5>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Mentor Details</th>
                      <th>Assigned Batches</th>
                      <th>Classes Taken</th>
                      <th>Cancelled Sessions</th>
                      <th>Current Status</th>
                      <th>Pending Payout</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mentors.map(m => (
                      <tr key={m.id}>
                        <td className="ps-4">
                          <div className="fw-bold text-dark">{m.name}</div>
                          <small className="text-muted">{m.email}</small>
                        </td>
                        <td>
                          {m.activeBatches?.map((b, i) => (
                            <span key={i} className="badge bg-primary bg-opacity-10 text-primary me-1 mb-1">{b}</span>
                          ))}
                        </td>
                        <td className="fw-bold">{m.classesTaken} sessions</td>
                        <td className="text-danger fw-bold">{m.cancelledSessions} cancelled</td>
                        <td>
                          <span className={`badge ${m.status?.includes('Active') ? 'bg-success' : 'bg-secondary'} rounded-pill px-3 py-2`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="fw-bold text-success">₹{m.pendingPayout?.toLocaleString()}</td>
                        <td className="text-end pe-4">
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold" onClick={() => handleDownloadPaySlip(m)}>
                              <i className="fas fa-file-invoice-dollar me-1"></i> Download Pay Slip
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
      </div>
      </div>

      {showAddModal && (
        <div className="modal fade show d-block text-dark" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow-lg bg-white">
              <div className="modal-header border-bottom p-4">
                <h5 className="modal-title fw-bold text-dark"><i className="fas fa-user-plus me-2 text-primary"></i>Create New Mentor</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleCreateMentor}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small text-uppercase">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control form-control-lg bg-light border-0 rounded-3 text-dark" 
                      required 
                      placeholder="e.g. Prof. Ramesh Kumar"
                      value={newMentor.name}
                      onChange={e => setNewMentor({ ...newMentor, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small text-uppercase">Email Address</label>
                    <input 
                      type="email" 
                      className="form-control form-control-lg bg-light border-0 rounded-3 text-dark" 
                      required 
                      placeholder="mentor@clinidea.in"
                      value={newMentor.email}
                      onChange={e => setNewMentor({ ...newMentor, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-muted small text-uppercase">Login Password</label>
                    <input 
                      type="password" 
                      className="form-control form-control-lg bg-light border-0 rounded-3 text-dark" 
                      required 
                      placeholder="••••••••"
                      value={newMentor.password}
                      onChange={e => setNewMentor({ ...newMentor, password: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer border-top p-4 d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light rounded-pill px-4 text-dark" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold" disabled={adding}>
                    {adding ? 'Creating...' : 'Create Mentor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMentorManagement;
