import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const EnquiryForm = ({ initialCourse = '' }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course_interest: initialCourse,
    message: ''
  });
  
  // Update state if initialCourse changes after render
  React.useEffect(() => {
    if (initialCourse) {
      setFormData(prev => ({ ...prev, course_interest: initialCourse }));
    }
  }, [initialCourse]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Frontend validation (course_interest is optional)
    if (!formData.name || !formData.phone || !formData.email) {
      setError("Please fill in all required fields (Name, Phone, Email).");
      setLoading(false);
      return;
    }

    try {
      // In development, the backend is expected to run on port 5000.
      // BASE_URL from config.js is currently used for other API calls.
      // If BASE_URL is empty or not pointing to the new backend, we will hardcode the backend URL or use a relative path if proxied.
      // Assuming BASE_URL is correct or using localhost:5000 fallback
      const apiUrl = `${BASE_URL}/api/leads`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit enquiry. Please try again.");
      }

      // Success
      setFormData({
        name: '',
        phone: '',
        email: '',
        course_interest: '',
        message: ''
      });
      
      // Show success screen instead of redirecting
      setIsSuccess(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="enquiry-success-screen text-center p-4">
        <div className="success-icon mb-4" style={{ fontSize: '4rem', color: '#10b981' }}>✔️</div>
        <h3 style={{ color: 'var(--color-text-dark)', fontWeight: '800', marginBottom: '15px' }}>Thank You!</h3>
        <p style={{ color: '#4b5563', fontSize: '1.1rem', marginBottom: '25px' }}>
          Your enquiry has been received. Our career counselor will contact you shortly to guide you.
        </p>
        <div className="d-flex flex-column align-items-center gap-3">
          <button 
            className="btn w-100" 
            style={{ backgroundColor: '#25D366', color: 'white', fontWeight: 'bold' }}
            onClick={() => {
              const text = encodeURIComponent(`Hi Clinidea, I just submitted an enquiry for the ${formData.course_interest} course. My name is ${formData.name}.`);
              window.open(`https://wa.me/918999213129?text=${text}`, '_blank');
            }}
          >
            <i className="fa fa-whatsapp mr-2"></i> Chat with us on WhatsApp
          </button>
          
          <div className="d-flex justify-content-center gap-3 w-100 mt-2">
            <button 
              className="btn btn-outline-secondary flex-grow-1" 
              onClick={() => {
                const closeBtn = document.querySelector('.enquiry-popup-close');
                if(closeBtn) closeBtn.click();
                else window.location.href = '/program';
              }}
            >
              Close
            </button>
            <button className="btn btn-primary flex-grow-1" onClick={() => window.location.href = '/program'}>
              Explore Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enquiry-form-container">
      {/* Heading is handled in Home.jsx, but keeping a fallback just in case it's used elsewhere without a wrapper */}
      {error && <div className="alert alert-danger" style={{ fontSize: '0.9rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} className="modern-enquiry-form">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="form-group mb-4">
            <label htmlFor="name" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Full Name <span className="text-danger">*</span></label>
            <input 
              type="text" 
              className="form-control input-premium" 
              id="name"
              name="name"
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="phone" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Phone Number <span className="text-danger">*</span></label>
            <PhoneInput
              country={'in'}
              value={formData.phone}
              onChange={(value, country, e, formattedValue) => setFormData(prev => ({ ...prev, phone: formattedValue }))}
              inputClass="form-control input-premium"
              containerClass="w-100"
              inputStyle={{ width: '100%', borderRadius: '8px' }}
            />
          </div>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="email" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Email Address <span className="text-danger">*</span></label>
          <input 
            type="email" 
            className="form-control input-premium" 
            id="email"
            name="email"
            placeholder="johndoe@example.com" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="form-group mb-4">
          <label htmlFor="course_interest" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Select Course Interest <span className="text-muted" style={{ fontWeight: 'normal', fontSize: '0.85rem' }}>(Optional)</span></label>
          <select 
            className="form-control input-premium" 
            id="course_interest"
            name="course_interest"
            value={formData.course_interest}
            onChange={handleChange}
            style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 15px top 50%', backgroundSize: '12px auto' }}
          >
            <option value="" disabled>-- Please Select a Course --</option>
            <option value="Clinical Research & Pharmacovigilance">Clinical Research & Pharmacovigilance</option>
            <option value="Clinical Research & Data Management">Clinical Research & Data Management</option>
            <option value="Clinical Research, Pharmacovigilance & Data Management">Clinical Research, Pharmacovigilance & Data Management</option>
            <option value="Clinical Research & Regulatory Affairs">Clinical Research & Regulatory Affairs</option>
            <option value="Clinical Research & Medical Writing">Clinical Research & Medical Writing</option>
            <option value="Clinical Research and Medical Coding">Clinical Research and Medical Coding</option>
          </select>
        </div>

        <div className="form-group mb-4">
          <label htmlFor="message" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Your Message <span className="text-muted" style={{ fontWeight: 'normal', fontSize: '0.85rem' }}>(Optional)</span></label>
          <textarea 
            className="form-control input-premium" 
            id="message"
            name="message"
            placeholder="Tell us about your background or ask any questions..." 
            value={formData.message}
            onChange={handleChange}
            rows="3"
            style={{ resize: 'vertical', minHeight: '100px' }}
          ></textarea>
        </div>

        <div className="form-group mt-5">
          <button 
            type="submit" 
            className="btn-submit" 
            disabled={loading}
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '0.5px' }}
          >
            {loading ? 'Submitting...' : 'Submit Enquiry'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnquiryForm;
