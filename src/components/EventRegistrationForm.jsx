import React, { useState } from 'react';
import { BASE_URL } from '../config';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const EventRegistrationForm = ({ event, onClose }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [registerStatus, setRegisterStatus] = useState({ loading: false, error: null, success: false });

  if (!event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterStatus({ loading: true, error: null, success: false });

    try {
      const response = await fetch(`${BASE_URL}/api/events/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: event.id,
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register');
      }

      setRegisterStatus({ loading: false, error: null, success: true });
      
      // Auto open WhatsApp
      const text = `Hello, my name is ${formData.name}. I have just registered for the event "${event.title}". Kindly share more details regarding this.`;
      const waUrl = `https://wa.me/918999213129?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');

      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      setRegisterStatus({ loading: false, error: err.message, success: false });
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px' }}>
      <div className="bg-white p-4" style={{ borderRadius: '15px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
        <h3 className="mb-1" style={{ fontWeight: '700', color: 'var(--color-primary)' }}>Register for Event</h3>
        <p className="text-muted mb-4">{event.title}</p>
        
        {registerStatus.success ? (
          <div className="alert alert-success text-center">
            Successfully registered! See you there.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {registerStatus.error && <div className="alert alert-danger">{registerStatus.error}</div>}
            <div className="form-group mb-3">
              <label>Name</label>
              <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Enter your name" style={{ borderRadius: '8px' }} />
            </div>
            <div className="form-group mb-3">
              <label>Phone</label>
              <PhoneInput
                country={'in'}
                value={formData.phone}
                onChange={(value, country, e, formattedValue) => setFormData({...formData, phone: formattedValue})}
                inputClass="form-control"
                containerClass="w-100"
                inputStyle={{ width: '100%', borderRadius: '8px' }}
              />
            </div>
            <div className="form-group mb-4">
              <label>Email</label>
              <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="Enter your email" style={{ borderRadius: '8px' }} />
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2" disabled={registerStatus.loading} style={{ background: '#ff0055', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
              {registerStatus.loading ? 'Registering...' : 'Confirm Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationForm;
