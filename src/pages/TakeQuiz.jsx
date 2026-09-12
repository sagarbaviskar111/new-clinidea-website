import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';

// Courses will be dynamically loaded from the backend

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('registration'); // registration, active, completed
  const [attemptId, setAttemptId] = useState(null);
  
  // Registration Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', qualification: '', location: '', courseInterest: ''
  });
  const [registering, setRegistering] = useState(false);
  const [dbCourses, setDbCourses] = useState([]);
  
  useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbCourses(data);
        }
      })
      .catch(err => console.error("Failed to load courses:", err));
  }, []);

  // Quiz State
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  
  // Anti-cheat timer reference
  const timerRef = useRef(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      const res = await fetch(`${BASE_URL}/api/public/events/${id}/start-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      let data;
      const textResponse = await res.text();
      try {
        data = JSON.parse(textResponse);
      } catch (parseErr) {
        console.error("Non-JSON Response:", textResponse);
        alert(`Server Error Details:\n\n${textResponse.substring(0, 150)}...\n\nPlease check if backend is running correctly.`);
        setRegistering(false);
        return;
      }

      if (!res.ok) {
        alert(data.error || 'Failed to start quiz');
        setRegistering(false);
        return;
      }
      
      if (data.status === 'submitted') {
        alert("You have already completed this quiz.");
        navigate('/events');
        return;
      }
      
      setAttemptId(data.attemptId);
      loadQuiz(data.attemptId);
    } catch (err) {
      console.error(err);
      alert("Network error: " + err.message);
      setRegistering(false);
    }
  };

  const loadQuiz = async (attId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/public/events/${id}/quiz-session/${attId}`);
      const data = await res.json();
      if (data.error) {
        if (data.status === 'submitted') {
           setStep('completed');
        } else {
           alert(data.error);
        }
        return;
      }
      
      // Shuffle questions
      const shuffledQs = data.questions.sort(() => Math.random() - 0.5);
      // Parse options
      shuffledQs.forEach(q => {
        if(typeof q.optionsJson === 'string') {
          q.optionsJson = JSON.parse(q.optionsJson);
        }
        // Shuffle options for each question
        q.optionsJson = q.optionsJson.sort(() => Math.random() - 0.5);
      });
      
      setQuizData({ ...data, questions: shuffledQs });
      setStep('active');
      
      // Calculate remaining time
      const startTime = new Date(data.attempt.startTime).getTime();
      const now = new Date().getTime();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const totalDurationSeconds = data.durationMinutes * 60;
      let remaining = totalDurationSeconds - elapsedSeconds;
      
      if (remaining <= 0) {
        handleSubmitQuiz(attId, {});
      } else {
        setTimeLeft(remaining);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load quiz.");
    }
  };

  useEffect(() => {
    if (step === 'active' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitQuiz(attemptId, responses);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step, timeLeft, attemptId, responses]);

  // Anti-cheat: Visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (step === 'active' && attemptId) {
        if (document.hidden) {
          // Pause quiz on backend
          fetch(`${BASE_URL}/api/public/events/${id}/quiz-session/${attemptId}/pause`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ responsesJson: responses })
          });
        } else {
          // Check if away > 5 mins by reloading quiz
          loadQuiz(attemptId);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [step, attemptId, responses, id]);

  const handleOptionSelect = (qId, option) => {
    setResponses(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmitQuiz = async (attId, finalResponses) => {
    setSubmitting(true);
    clearInterval(timerRef.current);
    try {
      const res = await fetch(`${BASE_URL}/api/public/events/${id}/quiz-session/${attId || attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses: finalResponses })
      });
      const data = await res.json();
      if (res.ok) {
        setScoreResult(data);
        setStep('completed');
      } else {
        alert(data.error || "Failed to submit quiz.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (step === 'registration') {
    return (
      <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' }}>
        <Helmet><title>Take Quiz | Clinidea Education</title></Helmet>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-11 col-sm-10 col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow border-0 rounded-4 overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                <div className="card-header p-4 text-center border-0" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', color: 'white' }}>
                  <h3 className="mb-0 fw-bold" style={{ letterSpacing: '0.5px' }}>Quiz Registration</h3>
                  <p className="mb-0 small mt-1" style={{ opacity: 0.9 }}>Please fill your details to begin the assessment.</p>
                </div>
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleRegister}>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-secondary small text-uppercase" style={{ letterSpacing: '0.5px' }}>Full Name</label>
                      <input type="text" className="form-control bg-light border-0 py-2 px-3 shadow-none" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ borderRadius: '8px' }} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-secondary small text-uppercase" style={{ letterSpacing: '0.5px' }}>Mobile Number</label>
                      <input type="tel" className="form-control bg-light border-0 py-2 px-3 shadow-none" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ borderRadius: '8px' }} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold text-secondary small text-uppercase" style={{ letterSpacing: '0.5px' }}>Email ID</label>
                      <input type="email" className="form-control bg-light border-0 py-2 px-3 shadow-none" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ borderRadius: '8px' }} />
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-6 mb-3 mb-sm-0">
                        <label className="form-label fw-bold text-secondary small text-uppercase" style={{ letterSpacing: '0.5px' }}>Qualification</label>
                        <input type="text" className="form-control bg-light border-0 py-2 px-3 shadow-none" required value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} style={{ borderRadius: '8px' }} />
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label fw-bold text-secondary small text-uppercase" style={{ letterSpacing: '0.5px' }}>Location (City/State)</label>
                        <input type="text" className="form-control bg-light border-0 py-2 px-3 shadow-none" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} style={{ borderRadius: '8px' }} />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label fw-bold text-secondary small text-uppercase" style={{ letterSpacing: '0.5px' }}>Course Interest</label>
                      <select className="form-select bg-light border-0 py-2 px-3 shadow-none" required value={formData.courseInterest} onChange={e => setFormData({...formData, courseInterest: e.target.value})} style={{ borderRadius: '8px', cursor: 'pointer' }}>
                        <option value="">Select a course...</option>
                        {dbCourses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <button type="submit" className="btn w-100 py-3 fw-bold rounded-pill text-white mt-2" disabled={registering} style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', boxShadow: '0 4px 15px rgba(30, 94, 255, 0.3)', transition: 'transform 0.2s', transform: registering ? 'scale(0.98)' : 'scale(1)' }}>
                      {registering ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Starting...</>
                      ) : (
                        'Start Quiz Now'
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'active' && quizData) {
    const q = quizData.questions[currentQuestionIndex];
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <Helmet><title>Active Quiz | Clinidea Education</title></Helmet>
        {/* Fixed Premium Header */}
        <div className="bg-white sticky-top py-3 px-4 d-flex justify-content-between align-items-center" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h5 className="mb-0 fw-bold d-none d-sm-block" style={{ color: 'var(--color-primary)', letterSpacing: '0.5px' }}>Clinidea Quiz Assessment</h5>
          <h5 className="mb-0 fw-bold d-sm-none" style={{ color: 'var(--color-primary)' }}>Quiz</h5>
          <div className="d-flex align-items-center text-white px-3 px-md-4 py-2 rounded-pill fw-bold" style={{ fontSize: '1.1rem', background: 'linear-gradient(135deg, #ff416c, #ff4b2b)', boxShadow: '0 4px 10px rgba(255, 65, 108, 0.3)' }}>
            <i className="fa fa-clock-o me-2"></i> {formatTime(timeLeft)}
          </div>
        </div>

        <div className="container py-4 py-md-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="card shadow-sm border-0 rounded-4 mb-4" style={{ overflow: 'hidden' }}>
                <div className="card-body p-4 p-md-5">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                    <span className="text-secondary fw-bold text-uppercase" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                      Question <span className="text-primary fs-5">{currentQuestionIndex + 1}</span> of {quizData.questions.length}
                    </span>
                    <span className="badge" style={{ background: 'rgba(30, 94, 255, 0.1)', color: 'var(--color-primary)', padding: '8px 15px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {q.marks} Marks
                    </span>
                  </div>
                  
                  <h4 className="fw-bold mb-4 mb-md-5" style={{ lineHeight: '1.6', color: '#2b3452' }}>{q.questionText}</h4>
                  
                  <div className="d-flex flex-column gap-3">
                    {q.optionsJson.map((opt, i) => {
                      const isSelected = responses[q.id] === opt;
                      return (
                        <label 
                          key={i} 
                          className="btn text-start p-3 p-md-4 rounded-3 d-flex align-items-center m-0"
                          style={{ 
                            cursor: 'pointer', 
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
                            border: `2px solid ${isSelected ? 'var(--color-primary)' : '#e9ecef'}`,
                            background: isSelected ? 'rgba(30, 94, 255, 0.03)' : '#ffffff',
                            boxShadow: isSelected ? '0 4px 15px rgba(30, 94, 255, 0.1)' : 'none',
                            transform: isSelected ? 'translateY(-2px)' : 'none'
                          }}
                        >
                          <input 
                            type="radio" 
                            name={`q-${q.id}`} 
                            className="form-check-input mt-0 me-3 me-md-4" 
                            style={{ 
                              transform: 'scale(1.3)', 
                              cursor: 'pointer',
                              accentColor: 'var(--color-primary)'
                            }}
                            checked={isSelected}
                            onChange={() => handleOptionSelect(q.id, opt)}
                          />
                          <span className="fw-semibold" style={{ fontSize: '1.05rem', color: isSelected ? 'var(--color-primary)' : '#495057' }}>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                
                <div className="card-footer bg-light border-0 p-3 p-md-4 d-flex justify-content-between align-items-center">
                  <button 
                    className="btn btn-outline-secondary px-4 py-2 fw-bold rounded-pill" 
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    style={{ borderWidth: '2px', transition: 'all 0.2s' }}
                  >
                    <i className="fa fa-arrow-left me-2 d-none d-sm-inline"></i> Prev
                  </button>
                  
                  {currentQuestionIndex === quizData.questions.length - 1 ? (
                    <button 
                      className="btn px-4 px-md-5 py-2 fw-bold rounded-pill text-white" 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to submit the quiz?")) {
                          handleSubmitQuiz(attemptId, responses);
                        }
                      }}
                      disabled={submitting}
                      style={{ background: 'linear-gradient(135deg, #11998e, #38ef7d)', boxShadow: '0 4px 15px rgba(56, 239, 125, 0.4)', border: 'none', transition: 'transform 0.2s' }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary px-4 px-md-5 py-2 fw-bold rounded-pill" 
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      style={{ boxShadow: '0 4px 15px rgba(30, 94, 255, 0.3)', transition: 'transform 0.2s' }}
                    >
                      Next <i className="fa fa-arrow-right ms-2 d-none d-sm-inline"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'completed') {
    return (
      <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' }}>
        <Helmet><title>Quiz Completed | Clinidea Education</title></Helmet>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-11 col-sm-10 col-md-8 col-lg-6">
              <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 text-center" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                <div className="mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle" style={{ width: '100px', height: '100px', background: 'rgba(56, 239, 125, 0.1)' }}>
                    <i className="fa fa-check text-success" style={{ fontSize: '3.5rem' }}></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>Quiz Submitted!</h2>
                {scoreResult && (
                  <div className="p-4 rounded-4 mb-4 mt-4" style={{ background: 'linear-gradient(135deg, rgba(30, 94, 255, 0.05), rgba(30, 94, 255, 0.1))', border: '1px solid rgba(30, 94, 255, 0.1)' }}>
                    <h5 className="fw-bold text-secondary mb-2 text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.9rem' }}>Your Final Score</h5>
                    <div className="display-4 fw-bold" style={{ color: 'var(--color-primary)' }}>{scoreResult.score} <span className="fs-3 text-muted">/ {scoreResult.totalMarks}</span></div>
                  </div>
                )}
                <p className="text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                  Your results have been sent to your registered Email and WhatsApp. Our team will get in touch with you shortly.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                  <button 
                    className="btn w-100 py-3 fw-bold rounded-pill text-white" 
                    onClick={() => {
                      const text = encodeURIComponent(`Hi Clinidea, I just completed the Quiz! My score is ${scoreResult?.score || 0}/${scoreResult?.totalMarks || 0}.`);
                      window.open(`https://wa.me/918999213129?text=${text}`, '_blank');
                    }}
                    style={{ background: '#25D366', boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <i className="fa fa-whatsapp me-2" style={{ fontSize: '1.2rem' }}></i> Send to WhatsApp
                  </button>
                  <button 
                    className="btn text-white w-100 py-3 fw-bold rounded-pill" 
                    onClick={() => navigate('/events')}
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', boxShadow: '0 4px 15px rgba(30, 94, 255, 0.3)', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <i className="fa fa-home me-2"></i> Back to Events
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TakeQuiz;
