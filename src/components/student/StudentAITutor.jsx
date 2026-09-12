import React, { useState, useRef, useEffect } from 'react';

const StudentAITutor = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your Clinidea AI Tutor 🤖. Ask me any question about Clinical Research, Pharmacovigilance (PV), MedDRA coding, GCP Guidelines, or Clinical Data Management (CDM).'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const predefinedKnowledge = [
    {
      keywords: ['gcp', 'good clinical practice', 'ich'],
      answer: 'Good Clinical Practice (GCP) is an international ethical and scientific quality standard for designing, conducting, recording, and reporting trials that involve human subjects (ICH E6 Guidelines).'
    },
    {
      keywords: ['pv', 'pharmacovigilance', 'ae', 'adverse event'],
      answer: 'Pharmacovigilance (PV) is defined by WHO as the science and activities relating to the detection, assessment, understanding, and prevention of adverse effects or any other drug-related problems.'
    },
    {
      keywords: ['cdm', 'clinical data management', 'crf', 'edc'],
      answer: 'Clinical Data Management (CDM) involves collecting, cleaning, and managing trial data in compliance with regulatory standards (e.g. CDISC / SDTM) to generate high-quality, statistically sound data.'
    },
    {
      keywords: ['meddra', 'coding', 'soc'],
      answer: 'MedDRA (Medical Dictionary for Regulatory Activities) is a standardized medical terminology used for coding Adverse Events, Medical History, and Indications in clinical safety databases.'
    },
    {
      keywords: ['phase 1', 'phase i', 'phase 2', 'phase 3', 'phase 4'],
      answer: 'Clinical trial phases: Phase 1 (Safety/Tolerability in 20-100 healthy volunteers), Phase 2 (Efficacy & side effects in 100-300 patients), Phase 3 (Confirmatory efficacy in 1000-3000+ patients), Phase 4 (Post-marketing surveillance).'
    }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentQuery = input.toLowerCase();
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let matchedAnswer = null;
      for (const item of predefinedKnowledge) {
        if (item.keywords.some(kw => currentQuery.includes(kw))) {
          matchedAnswer = item.answer;
          break;
        }
      }

      if (!matchedAnswer) {
        matchedAnswer = `Clinidea AI Tutor response: Clinical Research topic "${userMessage.text}" is covered in your course module. Always ensure compliance with ICH-GCP E6(R2) standards and sponsor SOPs. Feel free to ask more specific questions about PV, GCP, SAE reporting, or CDM!`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: matchedAnswer }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="card border-0 rounded-4 shadow-sm bg-white overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
      <div className="card-header bg-primary text-white p-4 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '42px', height: '42px' }}>
            🤖
          </div>
          <div>
            <h5 className="mb-0 fw-bold">Clinidea AI Doubt Solver</h5>
            <small className="opacity-75">24/7 Interactive Clinical Research & PV Assistant</small>
          </div>
        </div>
        <span className="badge bg-success bg-opacity-25 text-white fw-bold px-3 py-2 rounded-pill">
          <i className="fas fa-bolt me-1"></i> Active
        </span>
      </div>

      <div className="card-body p-4 bg-light overflow-auto" style={{ height: '420px' }}>
        {messages.map(msg => (
          <div key={msg.id} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className={`p-3 rounded-4 shadow-sm max-w-75 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white text-dark border'}`} style={{ maxWidth: '80%' }}>
              <div className="fw-semibold small mb-1 opacity-75">{msg.sender === 'user' ? 'You' : 'Clinidea AI Tutor'}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="d-flex justify-content-start mb-3">
            <div className="bg-white p-3 rounded-4 border text-muted small shadow-sm">
              <i className="fas fa-circle-notch fa-spin me-2 text-primary"></i> AI Tutor is thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="card-footer p-3 bg-white border-top">
        <form onSubmit={handleSend} className="d-flex gap-2">
          <input 
            type="text" 
            className="form-control rounded-pill px-4" 
            placeholder="Ask any doubt (e.g. What is ICH-GCP? How to code Adverse Events in MedDRA?)..." 
            value={input} 
            onChange={e => setInput(e.target.value)} 
          />
          <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" disabled={!input.trim()}>
            <i className="fas fa-paper-plane me-1"></i> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentAITutor;
