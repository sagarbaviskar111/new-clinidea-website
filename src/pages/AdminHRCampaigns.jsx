import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import AdminSidebar from '../components/AdminSidebar';

const AdminHRCampaigns = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/hr-campaigns`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setCampaigns(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Campaign? This will also delete all recipient history.')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/hr-campaigns/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchCampaigns();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'running': return <span className="badge bg-success">Running</span>;
      case 'paused': return <span className="badge bg-warning text-dark">Paused</span>;
      case 'completed': return <span className="badge bg-primary">Completed</span>;
      default: return <span className="badge bg-secondary">Draft</span>;
    }
  };

  const handleCreateNew = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/hr-campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'New Campaign ' + new Date().toLocaleDateString(),
          subject: 'Your Subject Here',
          body: '<p>Hello {{Name}},</p><p>We have candidates for {{Company}}.</p>'
        })
      });
      const data = await res.json();
      if (res.ok) {
        navigate(`/admin/hr-campaigns/${data.id}`);
      }
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
          <h2 className="fw-bold" style={{ color: 'var(--color-primary)' }}>HR Campaigns</h2>
          </div>
          <button className="btn btn-success text-white fw-bold px-4" onClick={handleCreateNew}>
            <i className="fa fa-plus me-2"></i> Create Campaign
          </button>
        </div>

        <div className="row">
          {loading ? (
            <div className="col-12 text-center py-5">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="col-12 text-center py-5">No campaigns found. Create one to get started.</div>
          ) : (
            campaigns.map(camp => (
              <div key={camp.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 border-0 shadow-sm rounded-4">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="fw-bold mb-0 text-truncate" style={{ maxWidth: '80%' }}>{camp.name}</h5>
                      {getStatusBadge(camp.status)}
                    </div>
                    <p className="text-muted small mb-3">Created: {new Date(camp.createdAt).toLocaleDateString()}</p>
                    
                    <div className="d-flex justify-content-between text-center mb-4 bg-light p-3 rounded-3">
                      <div>
                        <div className="h4 mb-0 fw-bold">{camp.totalRecipients}</div>
                        <div className="small text-muted">Total</div>
                      </div>
                      <div>
                        <div className="h4 mb-0 fw-bold text-success">{camp.sentCount}</div>
                        <div className="small text-muted">Sent</div>
                      </div>
                      <div>
                        <div className="h4 mb-0 fw-bold text-danger">{camp.failedCount}</div>
                        <div className="small text-muted">Failed</div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between">
                      <Link to={`/admin/hr-campaigns/${camp.id}`} className="btn btn-success text-white btn-sm flex-grow-1 me-2 fw-bold">
                        Manage Campaign
                      </Link>
                      <button className="btn btn-success text-white btn-sm px-3" onClick={() => handleDelete(camp.id)}>
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminHRCampaigns;
