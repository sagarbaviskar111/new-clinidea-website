import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';
import AdminSidebar from '../components/AdminSidebar';

const AdminHREmailAccounts = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    smtpHost: 'smtp.hostinger.com',
    smtpPort: '465',
    dailyLimit: 500
  });

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/email-accounts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAccounts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/email-accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ email: '', password: '', smtpHost: 'smtp.hostinger.com', smtpPort: '465', dailyLimit: 500 });
        fetchAccounts();
      } else {
        alert('Failed to save account');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/email-accounts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) fetchAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/email-accounts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
          <h2 className="fw-bold" style={{ color: 'var(--color-primary)' }}>Sender Email Accounts</h2>
          </div>
          <button className="btn btn-success text-white fw-bold px-4" onClick={() => setShowModal(true)}>
            <i className="fa fa-plus me-2"></i> Add Email Account
          </button>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-4">Email ID</th>
                    <th>SMTP Host</th>
                    <th>Daily Limit</th>
                    <th>Sent Today</th>
                    <th>Status</th>
                    <th className="text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-4">Loading accounts...</td></tr>
                  ) : accounts.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-4">No email accounts found.</td></tr>
                  ) : (
                    accounts.map(acc => (
                      <tr key={acc.id}>
                        <td className="py-3 px-4 fw-bold">{acc.email}</td>
                        <td>{acc.smtpHost}:{acc.smtpPort}</td>
                        <td>{acc.dailyLimit}</td>
                        <td>
                          <span className={`badge ${acc.sentToday >= acc.dailyLimit ? 'bg-danger' : 'bg-success'}`}>
                            {acc.sentToday} / {acc.dailyLimit}
                          </span>
                        </td>
                        <td>
                          <div className="form-check form-switch">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              checked={acc.isActive}
                              onChange={() => toggleStatus(acc.id, acc.isActive)}
                              style={{ cursor: 'pointer' }}
                            />
                            <label className="form-check-label ms-2">
                              {acc.isActive ? 'Active' : 'Inactive'}
                            </label>
                          </div>
                        </td>
                        <td className="text-end px-4">
                          <button className="btn btn-sm btn-success text-white" onClick={() => handleDelete(acc.id)}>
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Account Modal */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow rounded-4">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">Add Email Account</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSaveAccount}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email Address</label>
                      <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required placeholder="admin@clinidea.in" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email Password</label>
                      <input type="password" className="form-control" name="password" value={formData.password} onChange={handleInputChange} required placeholder="Enter password" />
                      <small className="text-muted">Enter the password for your Hostinger webmail account.</small>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-8">
                        <label className="form-label fw-bold">SMTP Host</label>
                        <input type="text" className="form-control" name="smtpHost" value={formData.smtpHost} onChange={handleInputChange} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-bold">SMTP Port</label>
                        <input type="number" className="form-control" name="smtpPort" value={formData.smtpPort} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold">Daily Sending Limit</label>
                      <input type="number" className="form-control" name="dailyLimit" value={formData.dailyLimit} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="btn btn-success text-white w-100 fw-bold py-2 rounded-3">Save Account</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminHREmailAccounts;
