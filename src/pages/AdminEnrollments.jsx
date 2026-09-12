import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminEnrollments = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Enrollment Panel
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  useEffect(() => {
    fetchEnrollments();
    fetchBatches();
  }, [navigate]);

  const fetchBatches = () => {
    const token = localStorage.getItem('adminToken');
    fetch(`${BASE_URL}/api/admin/batches`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setBatches(data))
      .catch(console.error);
  };

  const fetchEnrollments = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    const url = `${BASE_URL}/api/admin/enrollments`;
    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        if(!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setEnrollments(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message !== 'Unauthorized') {
          console.error("Fetch error:", err);
          setLoading(false);
        }
      });
  };

  const handleStatusUpdate = async (id, field, newValue) => {
    const token = localStorage.getItem('adminToken');
    try {
      const url = `${BASE_URL}/api/admin/enrollments/${id}`;
      const payload = {};
      
      // Ensure batchId is parsed to an integer for the database
      if (field === 'batchId') {
        payload[field] = newValue ? parseInt(newValue, 10) : null;
      } else {
        payload[field] = newValue;
      }

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to update academic status');
      
      // Update local state dynamically without network flush
      setEnrollments(enrollments.map(e => e.id === id ? { ...e, [field]: newValue } : e));
      if (selectedEnrollment && selectedEnrollment.id === id) {
        setSelectedEnrollment({ ...selectedEnrollment, [field]: newValue });
      }
    } catch (err) {
      alert("Error pushing update via API.");
    }
  };

  // Payment confirmation is automated via Razorpay webhook/API

  // Filter Logic
  const filteredEnrollments = enrollments.filter(enroll => {
    const userMatches = enroll.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        enroll.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const courseMatches = enroll.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if batch name matches search
    const batchName = enroll.batch?.batchName || '';
    const batchMatches = batchName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSearch = userMatches || courseMatches || batchMatches;
    
    // Exact match for the status dropdown
    const matchesStatus = statusFilter === '' || enroll.enrollmentStatus.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="d-flex justify-content-center mt-5">Loading Academic Rolls...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="admin-content">
        <h2 className="mb-4 fw-bold" style={{ color: 'var(--color-primary)' }}>Academic & Enrollments</h2>

        {/* Toolbar */}
        <div className="d-flex justify-content-between mb-4 gap-3 bg-white p-3 rounded-4 shadow-sm border text-dark">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search student, course, or batch..." 
            style={{ maxWidth: '400px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="form-select" 
            style={{ maxWidth: '200px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status Filter</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Enrollments Table */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-4">Enrolled Date</th>
                    <th>Student Profile</th>
                    <th>Subscribed Course</th>
                    <th>Assigned Batch</th>
                    <th>Payment Flag</th>
                    <th>Academic Status</th>
                    <th className="text-end px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnrollments.map(enroll => (
                    <tr key={enroll.id}>
                      <td className="py-3 px-4 text-muted">{new Date(enroll.createdAt).toLocaleDateString()}</td>
                      <td className="fw-bold">{enroll.user?.fullName}</td>
                      <td>{enroll.courseName}</td>
                      <td>
                        <span className={`badge ${enroll.batchId ? 'bg-info text-dark' : 'bg-light text-muted border'}`}>
                          {enroll.batch?.batchName || 'Unassigned'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          enroll.paymentStatus === 'paid' ? 'bg-success' : 
                          enroll.paymentStatus === 'pending' ? 'bg-warning text-dark' : 'bg-danger'
                        }`}>
                          {enroll.paymentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          enroll.enrollmentStatus === 'confirmed' ? 'bg-primary' : 
                          enroll.enrollmentStatus === 'pending' ? 'bg-secondary' : 'bg-dark'
                        }`}>
                          {enroll.enrollmentStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-end px-4">
                        <button 
                          className="btn btn-sm btn-dark fw-bold px-3"
                          onClick={() => setSelectedEnrollment(enroll)}
                        >
                          Modify Setup
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredEnrollments.length === 0 && (
                     <tr><td colSpan="7" className="text-center py-5">No academic enrollments match the filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Manager Details Panel */}
      {selectedEnrollment && (
        <div 
           className="bg-white border-start shadow-lg position-fixed top-0 bottom-0 end-0 p-4 custom-scrollbar"
           style={{ width: '100%', maxWidth: '500px', zIndex: 1050, overflowY: 'scroll' }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
            <h4 className="fw-bold mb-0">Enrollment Architect</h4>
          </div>
            <button className="btn-close" onClick={() => setSelectedEnrollment(null)}></button>
          </div>

          <div className="mb-4">
            <label className="fw-bold mb-1 text-muted">Primary Student Link</label>
            <p className="fs-5 mb-0 fw-bold">{selectedEnrollment.user?.fullName}</p>
            <p className="mb-0"><a href={`mailto:${selectedEnrollment.user?.email}`}>{selectedEnrollment.user?.email}</a></p>
          </div>
          
          <div className="mb-4">
            <label className="fw-bold mb-1 text-muted">Course Attachment</label>
            <p className="fs-5">{selectedEnrollment.courseName}</p>
          </div>

          <div className="mb-4 bg-light p-3 rounded-3 border">
             <label className="fw-bold mb-2">Assign Academic Batch</label>
             <div className="d-flex">
               <select 
                 className="form-select me-2" 
                 value={selectedEnrollment.batchId || ''}
                 onChange={(e) => handleStatusUpdate(selectedEnrollment.id, 'batchId', e.target.value)}
               >
                 <option value="">-- Unassigned --</option>
                 {batches.map(b => (
                   <option key={b.id} value={b.id}>{b.batchName}</option>
                 ))}
               </select>
               <button className="btn btn-success fw-bold" onClick={() => alert("Batch updated securely.")}>Save</button>
             </div>
             <small className="text-muted d-block mt-2 display-block">
               Select an active batch to link this student's enrollment.
             </small>
          </div>

          <div className="mb-4 bg-white p-3 rounded-3 border">
            <label className="fw-bold mb-2">Modify Academic Status</label>
            <select 
              className="form-select"
              value={selectedEnrollment.enrollmentStatus}
              onChange={(e) => handleStatusUpdate(selectedEnrollment.id, 'enrollmentStatus', e.target.value)}
            >
               <option value="pending">Pending Review</option>
               <option value="confirmed">Confirmed</option>
               <option value="cancelled">Cancelled (Revoked)</option>
            </select>
            <small className="text-muted d-block mt-2">
              Locking an enrollment to "Confirmed" will usually trigger the system to grant structural dashboard privileges.
            </small>
          </div>
          
          <details className="mb-4 border p-3 rounded" style={{ backgroundColor: 'var(--color-bg-light)' }} open>
            <summary className="fw-bold p-1 d-block" style={{ cursor: 'pointer', outline: 'none' }}>System Ledger Reference</summary>
            <div className="mt-2">
              Current financial marker: 
              <span className={`badge ms-2 ${
                    selectedEnrollment.paymentStatus === 'completed' || selectedEnrollment.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning text-dark'
                  }`}>
                {selectedEnrollment.paymentStatus}
              </span>
              <div className="mt-3 text-start small border-top pt-2">
                <p className="mb-1"><strong>Total Fees:</strong> ₹{selectedEnrollment.totalFees}</p>
                <p className="mb-1"><strong>Fees Paid:</strong> ₹{selectedEnrollment.feesPaid}</p>
                <p className="mb-1"><strong>Fees Pending:</strong> ₹{selectedEnrollment.feesPending}</p>
                <p className="mb-1"><strong>Installments:</strong> {selectedEnrollment.installmentCount}</p>
                <p className="mb-1"><strong>Transaction ID:</strong> {selectedEnrollment.transactionId || 'N/A'}</p>
              </div>
            </div>
          </details>

        </div>
      )}
    </div>
  );
};

export default AdminEnrollments;
