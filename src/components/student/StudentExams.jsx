import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../config';

const StudentExams = ({ exams, showMessage, fetchDashboardData }) => {
  const [activeExam, setActiveExam] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionId: value }
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time remaining calculation
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (activeExam) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const end = new Date(activeExam.endTime).getTime();
        const diff = end - now;
        
        if (diff <= 0) {
          clearInterval(timer);
          handleSubmit(activeExam.id, answers); // Auto-submit when time is up
        } else {
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeExam, answers]);

  const startExam = (exam) => {
    const now = new Date();
    const start = new Date(exam.startTime);
    const end = new Date(exam.endTime);

    if (now < start) {
      return showMessage('Exam has not started yet', 'warning');
    }
    if (now > end) {
      return showMessage('Exam has already ended', 'danger');
    }

    setActiveExam(exam);
    setAnswers({});
  };

  const handleAnswerChange = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const handleSubmit = async (examId, currentAnswers = answers) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${BASE_URL}/api/student/exams/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ examId, answers: currentAnswers })
      });

      if (res.ok) {
        showMessage('Exam submitted successfully', 'success');
        setActiveExam(null);
        fetchDashboardData();
      } else {
        const data = await res.json();
        showMessage(data.error || 'Submission failed', 'danger');
      }
    } catch (error) {
      showMessage('Error submitting exam', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activeExam) {
    return (
      <div className="card-premium">
        <div className="card-header bg-primary text-white p-4 d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1 fw-bold">{activeExam.title}</h4>
            <div className="small opacity-75">Max Marks: {activeExam.totalMarks} | Questions: {activeExam.questions.length}</div>
          </div>
          <div className="bg-white text-danger px-3 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center">
            <i className="fas fa-stopwatch me-2"></i> {timeLeft || 'Calculating...'}
          </div>
        </div>
        <div className="card-body p-4 bg-light">
          {activeExam.questions.map((q, idx) => (
            <div key={q.id} className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="fw-bold text-dark"><span className="text-primary me-2">Q{idx + 1}.</span> {q.questionText}</h5>
                  <span className="badge bg-secondary">Marks: {q.marks}</span>
                </div>
                
                {q.type === 'mcq' && q.optionsJson ? (
                  <div className="d-flex flex-column gap-2 mt-3">
                    {JSON.parse(q.optionsJson).map((opt, optIdx) => (
                      <label key={optIdx} className={`p-3 border rounded-3 cursor-pointer ${answers[q.id] === optIdx ? 'bg-primary text-white border-primary' : 'bg-white hover-bg-light'}`} style={{ transition: 'all 0.2s' }}>
                        <div className="form-check mb-0 d-flex align-items-center">
                          <input 
                            className="form-check-input mt-0 me-3" 
                            type="radio" 
                            name={`q_${q.id}`} 
                            checked={answers[q.id] === optIdx}
                            onChange={() => handleAnswerChange(q.id, optIdx)}
                          />
                          <span className="fw-bold">{opt}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3">
                    <textarea 
                      className="form-control bg-light" 
                      rows="4" 
                      placeholder="Type your answer here..."
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    ></textarea>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div className="text-center mt-5">
            <button 
              className="btn btn-success btn-lg px-5 fw-bold rounded-pill shadow" 
              onClick={() => handleSubmit(activeExam.id, answers)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium h-100">
      <div className="card-header bg-white border-0 p-4" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
        <h4 className="heading-premium text-dark mb-0"><i className="fa fa-list-alt text-primary me-2"></i> Test Series</h4>
      </div>
      <div className="card-body p-4 bg-light">
        {exams.length === 0 ? (
          <div className="text-center py-5 text-muted">No exams available for your batch.</div>
        ) : (
          <div className="row g-4">
            {exams.map(exam => {
              const submission = exam.submissions && exam.submissions.length > 0 ? exam.submissions[0] : null;
              const isGraded = submission && submission.status === 'graded';
              const now = new Date();
              const start = new Date(exam.startTime);
              const end = new Date(exam.endTime);
              
              let statusText = '';
              let statusColor = '';
              
              if (submission) {
                statusText = isGraded ? 'Graded' : 'Submitted';
                statusColor = isGraded ? 'success' : 'primary';
              } else if (now < start) {
                statusText = 'Upcoming';
                statusColor = 'secondary';
              } else if (now > end) {
                statusText = 'Missed';
                statusColor = 'danger';
              } else {
                statusText = 'Live Now';
                statusColor = 'danger heartbeat';
              }
              
              return (
                <div key={exam.id} className="col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4 text-center">
                      <div className={`badge bg-${statusColor} mb-3`}>{statusText}</div>
                      <h5 className="fw-bold mb-3">{exam.title}</h5>
                      
                      <div className="d-flex flex-column gap-2 text-start text-muted small mb-4 bg-light p-3 rounded-3">
                        <div className="d-flex justify-content-between"><span>Total Marks:</span> <strong>{exam.totalMarks}</strong></div>
                        <div className="d-flex justify-content-between"><span>Questions:</span> <strong>{exam.questions.length}</strong></div>
                        <div className="d-flex justify-content-between"><span>Starts:</span> <strong className="text-end">{start.toLocaleString()}</strong></div>
                        <div className="d-flex justify-content-between"><span>Ends:</span> <strong className="text-end">{end.toLocaleString()}</strong></div>
                      </div>

                      {submission ? (
                        <div className="border border-success rounded-3 p-3 bg-success bg-opacity-10 text-center">
                          {isGraded ? (
                            <>
                              <div className="fw-bold text-success fs-5">Score: {submission.totalScore} / {exam.totalMarks}</div>
                              <small className="text-muted d-block mb-2">Percentage: {Math.round((submission.totalScore / exam.totalMarks) * 100)}%</small>
                              <a 
                                href={`${BASE_URL}/api/student/exams/result-pdf/${submission.id}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="btn btn-sm btn-outline-success rounded-pill fw-bold w-100"
                              >
                                <i className="fas fa-file-pdf me-2"></i> Download Result PDF
                              </a>
                            </>
                          ) : (
                            <>
                              <div className="fw-bold text-primary mb-2"><i className="fas fa-check-circle me-2"></i> Exam Completed</div>
                              <a 
                                href={`${BASE_URL}/api/student/exams/result-pdf/${submission.id}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="btn btn-sm btn-outline-primary rounded-pill fw-bold w-100"
                              >
                                <i className="fas fa-file-pdf me-2"></i> Download Result PDF
                              </a>
                            </>
                          )}
                        </div>
                      ) : (
                        <button 
                          className="btn btn-primary w-100 fw-bold rounded-pill shadow-sm"
                          disabled={now < start || now > end}
                          onClick={() => startExam(exam)}
                        >
                          {now < start ? 'Not Started Yet' : (now > end ? 'Exam Ended' : 'Start Exam Now')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentExams;
