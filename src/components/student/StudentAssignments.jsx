import React, { useState } from 'react';
import { BASE_URL } from '../../config';

const StudentAssignments = ({ assignments, showMessage, fetchDashboardData }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e, assignmentId) => {
    e.preventDefault();
    if (!uploadFile) return showMessage('Please select a file to upload', 'warning');
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('assignmentId', assignmentId);
      formData.append('file', uploadFile);

      const token = localStorage.getItem('userToken');
      const res = await fetch(`${BASE_URL}/api/student/assignments/submit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        showMessage('Assignment submitted successfully', 'success');
        setUploadFile(null);
        setSelectedAssignment(null);
        fetchDashboardData();
      } else {
        const data = await res.json();
        showMessage(data.error || 'Submission failed', 'danger');
      }
    } catch (error) {
      showMessage('Error submitting assignment', 'danger');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card-premium h-100">
      <div className="card-header bg-white border-0 p-4" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
        <h4 className="heading-premium text-dark mb-0"><i className="fa fa-tasks text-primary me-2"></i> Assignments</h4>
      </div>
      <div className="card-body p-4 bg-light">
        {assignments.length === 0 ? (
          <div className="text-center py-5 text-muted">No assignments available.</div>
        ) : (
          <div className="row g-4">
            {assignments.map(a => {
              const submission = a.submissions && a.submissions.length > 0 ? a.submissions[0] : null;
              const isGraded = submission && submission.status === 'graded';
              
              return (
                <div key={a.id} className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className={`badge ${submission ? (isGraded ? 'bg-success' : 'bg-primary') : 'bg-warning'}`}>
                          {submission ? (isGraded ? 'Graded' : 'Submitted') : 'Pending'}
                        </span>
                        <div className="text-muted small fw-bold">Max Marks: {a.totalMarks}</div>
                      </div>
                      
                      <h5 className="fw-bold mb-2">{a.title}</h5>
                      <p className="text-muted small mb-3 text-truncate">{a.description}</p>
                      <div className="small fw-bold text-danger mb-4"><i className="fas fa-calendar-alt"></i> Due: {new Date(a.dueDate).toLocaleDateString()}</div>
                      
                      {submission ? (
                        <div className="bg-light p-3 rounded-3 border">
                          {isGraded ? (
                            <>
                              <div className="fw-bold text-success fs-5 mb-1">Score: {submission.marksObtained} / {a.totalMarks}</div>
                              {submission.mentorFeedback && <p className="text-muted small mb-0 mt-2"><strong>Feedback:</strong> {submission.mentorFeedback}</p>}
                            </>
                          ) : (
                            <div className="text-center text-primary fw-bold"><i className="fas fa-check-circle me-1"></i> Awaiting Mentor Review</div>
                          )}
                          <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary w-100 mt-3">View Submitted File</a>
                        </div>
                      ) : (
                        <button className="btn btn-primary w-100 fw-bold rounded-pill" onClick={() => setSelectedAssignment(a)}>Submit Assignment</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedAssignment && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title fw-bold">Submit Assignment</h5>
                <button type="button" className="btn-close" onClick={() => { setSelectedAssignment(null); setUploadFile(null); }}></button>
              </div>
              <div className="modal-body p-4 pt-0">
                <h6 className="fw-bold text-primary mb-2">{selectedAssignment.title}</h6>
                <p className="text-muted small mb-4">{selectedAssignment.description}</p>
                <form onSubmit={(e) => handleSubmit(e, selectedAssignment.id)}>
                  <div className="mb-4">
                    <label className="form-label fw-bold">Select File</label>
                    <input type="file" className="form-control" required onChange={e => setUploadFile(e.target.files[0])} />
                  </div>
                  <button type="submit" className="btn btn-success w-100 fw-bold py-2 rounded-pill" disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Submit Now'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
