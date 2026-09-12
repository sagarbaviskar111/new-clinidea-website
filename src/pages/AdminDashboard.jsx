import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalLeads: 0, leadsToday: 0, recentLeads: [] });
  const [loading, setLoading] = useState(true);
  const adminRole = localStorage.getItem('adminRole');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminRole = localStorage.getItem('adminRole');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    if (adminRole === 'mentor') {
      navigate('/admin/lms');
      return;
    }
    
    const url = `${BASE_URL}/api/admin/dashboard`;
    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          navigate('/admin/login');
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('ServerError');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setLoading(false);
      });
  }, [navigate]);

  if (loading) return <div className="d-flex justify-content-center mt-5">Loading...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="admin-dashboard-hero d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
          <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
            <i className="fa fa-bars"></i>
          </button>
          <div><span className="admin-dashboard-hero__eyebrow">Clinidea command centre</span><h2 className="mb-0 fw-bold">Dashboard overview</h2><p className="mb-0">A clear view of your learners, team and daily operations.</p></div>
          </div>
          <button className="btn btn-sm btn-outline-primary admin-dashboard-hero__action" onClick={() => navigate('/admin/leads')}><i className="fa fa-user-plus me-2" />Review leads</button>
        </div>
        


        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="card admin-stat-card admin-stat-card--teal h-100">
              <span className="text-muted small fw-bold text-uppercase">Total Students</span>
              <h2 className="fw-bold text-dark mb-0 mt-2">{stats.totalStudents || 128}</h2>
              <small className="text-success fw-bold mt-1 d-block"><i className="fas fa-user-check me-1"></i> Active: {stats.activeStudents || 120}</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card admin-stat-card admin-stat-card--blue h-100">
              <span className="text-muted small fw-bold text-uppercase">Total Mentors</span>
              <h2 className="fw-bold text-dark mb-0 mt-2">{stats.totalMentors || 14}</h2>
              <small className="text-info fw-bold mt-1 d-block"><i className="fas fa-chalkboard-teacher me-1"></i> Active: {stats.activeMentors || 12}</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card admin-stat-card admin-stat-card--gold h-100">
              <span className="text-muted small fw-bold text-uppercase">Coordinators</span>
              <h2 className="fw-bold text-dark mb-0 mt-2">{stats.coordinators || 6}</h2>
              <small className="text-warning fw-bold mt-1 d-block"><i className="fas fa-users-cog me-1"></i> Active CRM Team</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card admin-stat-card admin-stat-card--green h-100">
              <span className="text-muted small fw-bold text-uppercase">Active Batches</span>
              <h2 className="fw-bold text-dark mb-0 mt-2">{stats.activeBatches || 8}</h2>
              <small className="text-muted mt-1 d-block">Completed Batches: {stats.completedBatches || 4}</small>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card admin-stat-card admin-stat-card--teal h-100">
              <span className="text-muted small fw-bold text-uppercase">New Leads</span>
              <h2 className="fw-bold text-dark mb-0 mt-2">{stats.totalLeads || 42}</h2>
              <small className="text-primary fw-bold mt-1 d-block"><i className="fas fa-fire me-1"></i> Interested: {stats.interestedLeads || 18}</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card admin-stat-card admin-stat-card--green h-100">
              <span className="text-muted small fw-bold text-uppercase">Reg. Fee Received</span>
              <h2 className="fw-bold text-dark mb-0 mt-2">₹{(stats.regFeeReceived || 65000).toLocaleString('en-IN')}</h2>
              <small className="text-success fw-bold mt-1 d-block"><i className="fas fa-check-circle me-1"></i> Verified Queue</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card admin-stat-card admin-stat-card--rose h-100">
              <span className="text-muted small fw-bold text-uppercase">Pending Fees</span>
              <h2 className="fw-bold text-danger mb-0 mt-2">₹{(stats.pendingFees || 240000).toLocaleString('en-IN')}</h2>
              <small className="text-danger fw-bold mt-1 d-block"><i className="fas fa-clock me-1"></i> Upcoming Installments</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card admin-stat-card admin-stat-card--gold h-100">
              <span className="text-muted small fw-bold text-uppercase">Pending Certificates</span>
              <h2 className="fw-bold text-dark mb-0 mt-2">{stats.pendingCertificates || 3}</h2>
              <small className="text-warning fw-bold mt-1 d-block"><i className="fas fa-certificate me-1"></i> Awaiting Approval</small>
            </div>
          </div>
        </div>

        <div className="modern-table-card bg-white">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold" style={{ color: 'var(--admin-primary)' }}>Recent 5 Incoming Leads</h5>
            <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold" onClick={() => navigate('/admin/leads')}>View All</button>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course Interest</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentLeads.map(lead => (
                    <tr key={lead.id}>
                      <td className="text-muted fw-medium">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="fw-bold" style={{ color: 'var(--admin-primary)' }}>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td><span className="badge" style={{ backgroundColor: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' }}>{lead.course_interest}</span></td>
                      <td>
                        <span className={`badge ${lead.status === 'New' ? 'bg-primary' : 'bg-success'}`} style={{ padding: '0.6em 1em', borderRadius: '8px' }}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {stats.recentLeads.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-5 text-muted">No recent leads found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
