import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../config';

const MentorExams = ({ selectedBatch, showMessage }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  const [newExam, setNewExam] = useState({ title: '', totalMarks: 100, startTime: '', endTime: '' });
  const [questions, setQuestions] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    if (selectedBatch) fetchExams();
  }, [selectedBatch]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/exams/${selectedBatch.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setExams(data.exams || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = (type) => {
    if (type === 'mcq') {
      setQuestions([...questions, { type: 'mcq', questionText: '', optionsJson: ['', '', '', ''], correctOption: 0, marks: 5 }]);
    } else {
      setQuestions([...questions, { type: 'written', questionText: '', marks: 10 }]);
    }
  };

  const updateQuestion = (index, field, value) => {
    const q = [...questions];
    q[index][field] = value;
    setQuestions(q);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const q = [...questions];
    q[qIndex].optionsJson[optIndex] = value;
    setQuestions(q);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (questions.length === 0) return showMessage('Please add at least one question.', 'warning');
    
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/exams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...newExam, batchId: selectedBatch.id, questions })
      });
      if (res.ok) {
        showMessage('Exam created successfully');
        setShowCreate(false);
        setNewExam({ title: '', totalMarks: 100, startTime: '', endTime: '' });
        setQuestions([]);
        fetchExams();
      } else {
        const data = await res.json();
        showMessage(data.error || 'Failed to create exam', 'danger');
      }
    } catch (error) {
      showMessage('Error creating exam', 'danger');
    }
  };

  const handleGrade = async (answerId, marksObtained, mentorRemarks) => {
    try {
      const token = localStorage.getItem('mentorToken');
      const res = await fetch(`${BASE_URL}/api/mentor/exams/grade/${answerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ marksObtained, mentorRemarks })
      });
      if (res.ok) {
        showMessage('Graded successfully');
        fetchExams(); // Refresh to show updated score
      }
    } catch (error) {
      showMessage('Error grading', 'danger');
    }
  };

  if (!selectedBatch) return <div className="alert alert-warning">Please select a batch from "My Batches" first.</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Tests & Exams - {selectedBatch.name}</h4>
        <button className="btn btn-primary fw-bold" onClick={() => setShowCreate(!showCreate)}>
          <i className="fas fa-plus me-2"></i> Create Exam
        </button>
      </div>

      {showCreate && (
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">New Exam</h5>
            <form onSubmit={handleCreate}>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Title</label>
                  <input type="text" className="form-control" required value={newExam.title} onChange={e => setNewExam({...newExam, title: e.target.value})} />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Total Marks</label>
                  <input type="number" className="form-control" required value={newExam.totalMarks} onChange={e => setNewExam({...newExam, totalMarks: e.target.value})} />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Start Time</label>
                  <input type="datetime-local" className="form-control" required value={newExam.startTime} onChange={e => setNewExam({...newExam, startTime: e.target.value})} />
                </div>
                <div className="col-md-2">
                  <label className="form-label">End Time</label>
                  <input type="datetime-local" className="form-control" required value={newExam.endTime} onChange={e => setNewExam({...newExam, endTime: e.target.value})} />
                </div>
              </div>

              <h6 className="fw-bold border-bottom pb-2">Questions ({questions.length})</h6>
              
              {questions.map((q, i) => (
                <div key={i} className="card bg-light border-0 mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-secondary mb-2">Q{i + 1} - {q.type.toUpperCase()}</span>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setQuestions(questions.filter((_, idx) => idx !== i))}><i className="fas fa-trash"></i></button>
                    </div>
                    <div className="row g-3">
                      <div className="col-md-10">
                        <input type="text" className="form-control mb-2" placeholder="Question Text" required value={q.questionText} onChange={e => updateQuestion(i, 'questionText', e.target.value)} />
                      </div>
                      <div className="col-md-2">
                        <input type="number" className="form-control mb-2" placeholder="Marks" required value={q.marks} onChange={e => updateQuestion(i, 'marks', e.target.value)} />
                      </div>
                    </div>
                    {q.type === 'mcq' && (
                      <div className="row g-2 mt-1">
                        {q.optionsJson.map((opt, oIdx) => (
                          <div key={oIdx} className="col-md-6 d-flex align-items-center">
                            <input type="radio" name={`correct_${i}`} className="form-check-input me-2 mt-0" checked={q.correctOption === oIdx} onChange={() => updateQuestion(i, 'correctOption', oIdx)} />
                            <input type="text" className="form-control form-control-sm" placeholder={`Option ${oIdx + 1}`} required value={opt} onChange={e => updateOption(i, oIdx, e.target.value)} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="mb-4">
                <button type="button" className="btn btn-outline-primary btn-sm me-2" onClick={() => addQuestion('mcq')}>+ Add MCQ</button>
                <button type="button" className="btn btn-outline-info btn-sm" onClick={() => addQuestion('written')}>+ Add Written Q</button>
              </div>

              <div className="col-12 border-top pt-3">
                <button type="submit" className="btn btn-success me-2 fw-bold">Publish Exam</button>
                <button type="button" className="btn btn-light" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : (
        <div className="row g-4">
          {exams.map(exam => (
            <div key={exam.id} className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="fw-bold text-primary">{exam.title}</h5>
                      <div className="d-flex gap-3 text-muted small fw-bold mt-2">
                        <span><i className="fas fa-star text-warning"></i> {exam.totalMarks} Marks</span>
                        <span><i className="fas fa-clock"></i> {new Date(exam.startTime).toLocaleString()} - {new Date(exam.endTime).toLocaleString()}</span>
                        <span><i className="fas fa-question-circle"></i> {exam.questions?.length || 0} Questions</span>
                      </div>
                    </div>
                    <button className="btn btn-outline-primary btn-sm" onClick={() => setSelectedExam(exam.id === selectedExam?.id ? null : exam)}>
                      {exam.id === selectedExam?.id ? 'Hide Submissions' : `Grade Submissions (${exam.submissions?.length || 0})`}
                    </button>
                  </div>

                  {exam.id === selectedExam?.id && (
                    <div className="mt-4 pt-4 border-top">
                      <h6 className="fw-bold mb-3">Student Submissions</h6>
                      {exam.submissions && exam.submissions.length > 0 ? (
                        <div className="accordion" id={`acc-${exam.id}`}>
                          {exam.submissions.map((sub, sIdx) => (
                            <div className="accordion-item border-0 shadow-sm mb-2" key={sub.id}>
                              <h2 className="accordion-header">
                                <button className="accordion-button collapsed fw-bold d-flex justify-content-between" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${sub.id}`}>
                                  <span>{sub.user?.fullName} ({sub.user?.email})</span>
                                  <span className="ms-auto me-3 badge bg-primary">Score: {sub.totalScore || 0} / {exam.totalMarks}</span>
                                </button>
                              </h2>
                              <div id={`collapse-${sub.id}`} className="accordion-collapse collapse" data-bs-parent={`#acc-${exam.id}`}>
                                <div className="accordion-body bg-light">
                                  {sub.answers?.map(ans => {
                                    const q = exam.questions.find(x => x.id === ans.questionId);
                                    if (!q) return null;
                                    
                                    return (
                                      <div key={ans.id} className="card mb-3 border-0">
                                        <div className="card-body">
                                          <p className="fw-bold mb-1">Q: {q.questionText}</p>
                                          {q.type === 'mcq' ? (
                                            <div className="alert alert-secondary p-2 mb-0">
                                              Selected Option: {ans.selectedOption !== null ? JSON.parse(q.optionsJson)[ans.selectedOption] : 'N/A'}
                                              {ans.selectedOption === q.correctOption ? 
                                                <span className="badge bg-success ms-2"><i className="fas fa-check"></i> Correct (+{q.marks})</span> : 
                                                <span className="badge bg-danger ms-2"><i className="fas fa-times"></i> Incorrect (0)</span>}
                                            </div>
                                          ) : (
                                            <div>
                                              <div className="alert alert-secondary p-2 mb-2" style={{ whiteSpace: 'pre-wrap' }}>
                                                {ans.writtenAnswer || 'No answer provided'}
                                              </div>
                                              <div className="d-flex align-items-center gap-2">
                                                <input type="number" id={`marks-${ans.id}`} className="form-control form-control-sm" style={{width: '80px'}} placeholder={`/ ${q.marks}`} defaultValue={ans.marksObtained} max={q.marks} min="0" />
                                                <input type="text" id={`remarks-${ans.id}`} className="form-control form-control-sm" placeholder="Remarks" defaultValue={ans.mentorRemarks} />
                                                <button className="btn btn-sm btn-success fw-bold" onClick={() => {
                                                  const m = document.getElementById(`marks-${ans.id}`).value;
                                                  const r = document.getElementById(`remarks-${ans.id}`).value;
                                                  handleGrade(ans.id, m, r);
                                                }}>Grade</button>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          ))}
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
          {exams.length === 0 && <div className="col-12 text-center py-5 text-muted">No exams created yet.</div>}
        </div>
      )}
    </div>
  );
};

export default MentorExams;
