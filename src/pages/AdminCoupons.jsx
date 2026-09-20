import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import AdminSidebar from '../components/AdminSidebar';
import '../admin.css';

const AdminCoupons = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountPercent: '',
    maxUses: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, [navigate]);

  const fetchCoupons = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/admin/coupons`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setCoupons(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/coupons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create coupon.');
      setFormData({ code: '', discountPercent: '', maxUses: '', expiryDate: '' });
      fetchCoupons();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (coupon) => {
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`${BASE_URL}/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isActive: !coupon.isActive })
      });
      fetchCoupons();
    } catch (err) {
      alert('Failed to update coupon.');
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`${BASE_URL}/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCoupons(coupons.filter(c => c.id !== id));
    } catch (err) {
      alert('Failed to delete coupon.');
    }
  };

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex align-items-center mb-4">
          <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
            <i className="fa fa-bars"></i>
          </button>
          <h2 className="admin-header">Coupons Management</h2>
        </div>

        <div className="admin-card mb-5">
          <h4 className="fw-bold mb-4 border-bottom pb-2" style={{ color: 'var(--color-primary)' }}>Create New Coupon</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label fw-bold">Coupon Code *</label>
                <input type="text" className="form-control text-uppercase" name="code" value={formData.code} onChange={handleChange} required placeholder="WELCOME10" />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-bold">Discount (%) *</label>
                <input type="number" className="form-control" name="discountPercent" value={formData.discountPercent} onChange={handleChange} required min="1" max="100" placeholder="10" />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-bold">Max Uses (optional)</label>
                <input type="number" className="form-control" name="maxUses" value={formData.maxUses} onChange={handleChange} placeholder="Unlimited" />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-bold">Expiry Date (optional)</label>
                <input type="date" className="form-control" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-success fw-bold px-4 text-white" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Coupon'}
            </button>
          </form>
        </div>

        <div className="admin-card">
          <h4 className="fw-bold mb-4 border-bottom pb-2" style={{ color: 'var(--color-primary)' }}>All Coupons</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Uses</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id}>
                    <td className="fw-bold">{coupon.code}</td>
                    <td>{coupon.discountPercent}%</td>
                    <td>{coupon.usedCount || 0}{coupon.maxUses ? ` / ${coupon.maxUses}` : ''}</td>
                    <td>{coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}</td>
                    <td>
                      <span className={`badge ${coupon.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => toggleActive(coupon)} className="btn btn-sm btn-outline-primary me-2">
                        {coupon.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => deleteCoupon(coupon.id)} className="btn btn-sm btn-outline-danger">
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-4">No coupons created yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
