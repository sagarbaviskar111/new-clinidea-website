import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../config';

const MentorAssignments = ({ selectedBatch, showMessage }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', totalMarks: 100, dueDate: '' });
  const [selectedAssignment, setSelectedAssignment] = useState(null); // For grading

  useEffect(() => {
    if (selectedBatch) {
      fetchAssignments();
    }
  }, [selectedBatch]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/assignments/${selectedBatch.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAssignments(data.assignments || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...newAssignment, batchId: selectedBatch.id })
      });
      if (res.ok) {
        showMessage('Assignment created successfully');
        setShowCreate(false);
        setNewAssignment({ title: '', description: '', totalMarks: 100, dueDate: '' });
        fetchAssignments();
      } else {
        const data = await res.json();
        showMessage(data.error || 'Failed to create', 'danger');
      }
    } catch (error) {
      showMessage('Error creating assignment', 'danger');
    }
  };

  const handleGrade = async (submissionId, marksObtained, mentorFeedback) => {
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/assignments/grade/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ marksObtained, mentorFeedback })
      });
      if (res.ok) {
        showMessage('Graded successfully');
        fetchAssignments();
        setSelectedAssignment(null);
      }
    } catch (error) {
      showMessage('Error grading', 'danger');
    }
  };

  if (!selectedBatch) {
    return <div className="alert alert-warning">Please select a batch from "My Batches" first.</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Assignments - {selectedBatch.name}</h4>
        <button className="btn btn-primary fw-bold" onClick={() => setShowCreate(!showCreate)}>
          <i className="fas fa-plus me-2"></i> Create Assignment
        </button>
      </div>

      {showCreate && (
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">New Assignment</h5>
            <form onSubmit={handleCreate}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" required value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Total Marks</label>
                  <input type="number" className="form-control" required value={newAssignment.totalMarks} onChange={e => setNewAssignment({...newAssignment, totalMarks: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Due Date</label>
                  <input type="date" className="form-control" required value={newAssignment.dueDate} onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} />
                </div>
                <div className="col-12">
                  <label className="form-label">Description / Instructions</label>
                  <textarea className="form-control" rows="3" required value={newAssignment.description} onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}></textarea>
                </div>
                <div className="col-12 mt-3">
                  <button type="submit" className="btn btn-success me-2">Create</button>
                  <button type="button" className="btn btn-light" onClick={() => setShowCreate(false)}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="row g-4">
          {assignments.map(assign => (
            <div key={assign.id} className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="fw-bold text-primary">{assign.title}</h5>
                      <p className="text-muted small mb-2">{assign.description}</p>
                      <div className="d-flex gap-3 text-muted small fw-bold">
                        <span><i className="fas fa-star text-warning"></i> {assign.totalMarks} Marks</span>
                        <span><i className="fas fa-calendar-alt"></i> Due: {new Date(assign.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => setSelectedAssignment(assign.id === selectedAssignment?.id ? null : assign)}>
                      {assign.id === selectedAssignment?.id ? 'Hide Submissions' : `View Submissions (${assign.submissions?.length || 0})`}
                    </button>
                  </div>

                  {assign.id === selectedAssignment?.id && (
                    <div className="mt-4 pt-4 border-top">
                      <h6 className="fw-bold mb-3">Student Submissions</h6>
                      {assign.submissions && assign.submissions.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-hover align-middle">
                            <thead className="table-light">
                              <tr>
                                <th>Student</th>
                                <th>Submitted On</th>
                                <th>File</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {assign.submissions.map(sub => (
                                <tr key={sub.id}>
                                  <td>
                                    <div className="fw-bold">{sub.user?.fullName}</div>
                                    <div className="small text-muted">{sub.user?.email}</div>
                                  </td>
                                  <td>{new Date(sub.submittedAt).toLocaleDateString()}</td>
                                  <td>
                                    <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-info text-white">
                                      <i className="fas fa-download"></i> View File
                                    </a>
                                  </td>
                                  <td>
                                    <span className={`badge bg-${sub.status === 'graded' ? 'success' : 'warning'}`}>
                                      {sub.status.toUpperCase()}
                                    </span>
                                  </td>
                                  <td>
                                    {sub.status !== 'graded' ? (
                                      <GradeForm submission={sub} maxMarks={assign.totalMarks} onGrade={(marks, feedback) => handleGrade(sub.id, marks, feedback)} />
                                    ) : (
                                      <div>
                                        <div className="fw-bold text-success">{sub.marksObtained} / {assign.totalMarks}</div>
                                        <div className="small text-muted">{sub.mentorFeedback}</div>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="alert alert-light text-center">No submissions yet.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {assignments.length === 0 && <div className="col-12 text-center py-5 text-muted">No assignments created yet.</div>}
        </div>
      )}
    </div>
  );
};

const GradeForm = ({ submission, maxMarks, onGrade }) => {
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onGrade(marks, feedback); }} className="d-flex flex-column gap-2" style={{minWidth: '200px'}}>
      <input type="number" className="form-control form-control-sm" placeholder={`Marks (Max ${maxMarks})`} required min="0" max={maxMarks} value={marks} onChange={e => setMarks(e.target.value)} />
      <input type="text" className="form-control form-control-sm" placeholder="Feedback" value={feedback} onChange={e => setFeedback(e.target.value)} />
      <button type="submit" className="btn btn-sm btn-success w-100">Grade</button>
    </form>
  );
};

export default MentorAssignments;
