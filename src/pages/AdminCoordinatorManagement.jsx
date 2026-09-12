import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminCoordinatorManagement = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const fetchCoordinators = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/coordinators-management`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCoordinators(data.coordinators || []);
      } else {
        // Mock sample data
        setCoordinators([
          { id: 1, name: 'Priya Sharma', email: 'priya.coord@clinidea.in', studentsRegistered: 14, leadsContacted: 120, interestedCount: 45, ratePerStudent: 500, pendingPayout: 3500, completedPayout: 3500 },
          { id: 2, name: 'Amit Verma', email: 'amit.coord@clinidea.in', studentsRegistered: 18, leadsContacted: 150, interestedCount: 60, ratePerStudent: 500, pendingPayout: 4000, completedPayout: 5000 },
          { id: 3, name: 'Kavita Patel', email: 'kavita.coord@clinidea.in', studentsRegistered: 9, leadsContacted: 90, interestedCount: 28, ratePerStudent: 500, pendingPayout: 1500, completedPayout: 3000 }
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPaySlip = (c) => {
    alert(`Downloading Commission Pay Slip for Coordinator: ${c.name} (Amount: ₹${c.completedPayout || c.pendingPayout})`);
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
            <h2 className="mb-0 fw-bold" style={{ color: 'var(--admin-primary)' }}>Student Coordinator Management</h2>
          </div>
          <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={fetchCoordinators}>
            <i className="fas fa-sync-alt me-2"></i> Refresh Coordinators
          </button>
        </div>

        <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
          <div className="card-header bg-light p-3 px-4 border-bottom">
            <h5 className="mb-0 fw-bold text-dark">Coordinator Registrations, Commission & Pay Slips</h5>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Coordinator Details</th>
                      <th>Registered Students</th>
                      <th>Leads Contacted</th>
                      <th>Interested Count</th>
                      <th>Rate Per Student</th>
                      <th>Pending Payout</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coordinators.map(c => (
                      <tr key={c.id}>
                        <td className="ps-4">
                          <div className="fw-bold text-dark">{c.name}</div>
                          <small className="text-muted">{c.email}</small>
                        </td>
                        <td>
                          <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill">
                            {c.studentsRegistered} Registered
                          </span>
                        </td>
                        <td className="fw-bold">{c.leadsContacted} leads</td>
                        <td className="text-warning fw-bold">{c.interestedCount} interested</td>
                        <td className="fw-bold">₹{c.ratePerStudent} / reg</td>
                        <td className="fw-bold text-success">₹{c.pendingPayout?.toLocaleString()}</td>
                        <td className="text-end pe-4">
                          <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold" onClick={() => handleDownloadPaySlip(c)}>
                            <i className="fas fa-file-invoice-dollar me-1"></i> Download Pay Slip
                          </button>
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
    </div>
  );
};

export default AdminCoordinatorManagement;
