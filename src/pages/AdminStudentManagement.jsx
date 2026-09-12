import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';

const AdminStudentManagement = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [students, setStudents] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fee Config Modal State
  const [showConfig, setShowConfig] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [feeConfig, setFeeConfig] = useState({
    totalFees: 0,
    feePlanType: '1_installment',
    startDate: ''
  });

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/student-management/batches`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch batches');
      const data = await res.json();
      setBatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (batchId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/student-management/batch/${batchId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    fetchStudents(batch.id);
    setError('');
    setSuccess('');
  };

  const openFeeConfig = (student) => {
    setCurrentStudent(student);
    setFeeConfig({
      totalFees: student.totalFees || 0,
      feePlanType: student.feePlanType || '1_installment',
      startDate: selectedBatch?.startDate ? selectedBatch.startDate.split('T')[0] : ''
    });
    setShowConfig(true);
  };

  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/student-management/configure-fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: currentStudent.userId,
          enrollmentId: currentStudent.enrollmentId,
          ...feeConfig
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update fees');
      
      setSuccess('Fees and installments configured successfully!');
      setShowConfig(false);
      fetchStudents(selectedBatch.id); // refresh
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (student, blockAction) => {
    if (!window.confirm(`Are you sure you want to manually ${blockAction} this student?`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/student-management/toggle-block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: student.userId, blockAction })
      });
      if (!res.ok) throw new Error('Failed to toggle block');
      setSuccess(`Student ${blockAction}ed successfully.`);
      fetchStudents(selectedBatch.id);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid p-4">
      <Helmet>
        <title>Student Management | Admin</title>
      </Helmet>

      <h2 className="fw-bold mb-4" style={{ color: 'var(--color-primary)' }}>Student & Fees Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!selectedBatch ? (
        <div className="row g-4">
          {batches.map(batch => (
            <div className="col-md-4" key={batch.id}>
              <div className="card shadow-sm border-0 h-100 rounded-4">
                <div className="card-body">
                  <h5 className="fw-bold">{batch.batchName}</h5>
                  <p className="text-muted small mb-3">{batch.course?.name}</p>
                  <p className="mb-1"><strong>Students:</strong> {batch._count?.enrollments}</p>
                  <p className="mb-3"><strong>Started:</strong> {new Date(batch.startDate).toLocaleDateString()}</p>
                  <button className="btn btn-primary btn-sm w-100 fw-bold" onClick={() => handleBatchSelect(batch)}>
                    Manage Students
                  </button>
                </div>
              </div>
            </div>
          ))}
          {batches.length === 0 && !loading && (
            <div className="col-12"><p className="text-muted">No started batches found.</p></div>
          )}
        </div>
      ) : (
        <div>
          <button className="btn btn-outline-secondary btn-sm mb-4 fw-bold" onClick={() => setSelectedBatch(null)}>
            &larr; Back to Batches
          </button>
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Students in {selectedBatch.batchName}</h5>
                <a 
                  href={`/api/admin/batches/${selectedBatch.id}/download-all`} 
                  className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa fa-file-archive me-2"></i> Download LMS (ZIP)
                </a>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Name / Email</th>
                      <th>Total Fees</th>
                      <th>Paid / Pending</th>
                      <th>Plan</th>
                      <th>Status / Installments</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.userId}>
                        <td>
                          <div className="fw-bold">{student.name}</div>
                          <div className="small text-muted">{student.email}</div>
                          <div className="small text-muted">{student.phone}</div>
                        </td>
                        <td className="fw-bold text-success">₹{student.totalFees}</td>
                        <td>
                          <div className="text-success small">Paid: ₹{student.feesPaid}</div>
                          <div className="text-danger small">Due: ₹{student.feesPending}</div>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{student.feePlanType?.replace('_', ' ')}</span>
                        </td>
                        <td>
                          {student.lmsBlocked ? (
                            <span className="badge bg-danger mb-2">LMS Blocked</span>
                          ) : (
                            <span className="badge bg-success mb-2">LMS Active</span>
                          )}
                          <br />
                          {student.payments?.map(p => (
                            <div key={p.id} className="small">
                              Inst {p.installmentNo}: ₹{p.amount} due {new Date(p.dueDate).toLocaleDateString()} 
                              <span className={`ms-1 text-${p.paymentStatus === 'paid' ? 'success' : 'danger'}`}>
                                ({p.paymentStatus})
                              </span>
                            </div>
                          ))}
                        </td>
                        <td className="text-end">
                          <button className="btn btn-sm btn-outline-primary mb-2 w-100" onClick={() => openFeeConfig(student)}>
                            <i className="fa fa-cog me-1"></i> Config Fees
                          </button>
                          
                          {student.adminUnblocked ? (
                            <button className="btn btn-sm btn-outline-danger w-100" onClick={() => handleToggleBlock(student, 'block')}>
                              <i className="fa fa-lock me-1"></i> Remove Override
                            </button>
                          ) : (
                            <button className="btn btn-sm btn-outline-success w-100" onClick={() => handleToggleBlock(student, 'unblock')}>
                              <i className="fa fa-unlock me-1"></i> Manual Unblock
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr><td colSpan="6" className="text-center py-4">No students enrolled.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fee Config Modal */}
      {showConfig && currentStudent && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title fw-bold">Fee Configuration for {currentStudent.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfig(false)}></button>
              </div>
              <form onSubmit={handleFeeSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Total Fees (₹)</label>
                    <input type="number" className="form-control" value={feeConfig.totalFees} onChange={e => setFeeConfig({...feeConfig, totalFees: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Installment Plan</label>
                    <select className="form-select" value={feeConfig.feePlanType} onChange={e => setFeeConfig({...feeConfig, feePlanType: e.target.value})}>
                      <option value="1_installment">1 Installment (Due in 2 Months)</option>
                      <option value="2_installments">2 Installments</option>
                      <option value="3_installments">3 Installments</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Batch Start Date (Reference)</label>
                    <input type="date" className="form-control" value={feeConfig.startDate} onChange={e => setFeeConfig({...feeConfig, startDate: e.target.value})} required />
                    <small className="text-muted">Due dates will be automatically calculated from this date.</small>
                  </div>
                </div>
                <div className="modal-footer border-top-0">
                  <button type="button" className="btn btn-secondary fw-bold" onClick={() => setShowConfig(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary fw-bold" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Configuration'}
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

export default AdminStudentManagement;
