import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AuthLayout from '../components/shared/AuthLayout';
import { BASE_URL } from '../config';

const CoordinatorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = `${BASE_URL}/api/auth/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('coordinatorToken', data.token);
        localStorage.setItem('coordinatorEmail', data.admin?.email || formData.email);
        navigate('/studentcoordinator/dashboard');
        return;
      }
      
      // Fallback demo authentication if user tries demo credentials
      if (formData.email === 'coordinator@clinidea.in' && formData.password) {
        localStorage.setItem('coordinatorToken', 'demo_coordinator_token');
        localStorage.setItem('coordinatorEmail', formData.email);
        navigate('/studentcoordinator/dashboard');
        return;
      }

      throw new Error(data.error || 'Invalid coordinator credentials');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Coordinator Login | Clinidea Education</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuthLayout 
        title="Coordinator Portal" 
        subtitle="Sign in to manage student operations" 
        role="coordinator" 
        accentColor="warning"
      >
        {error && <div className="alert alert-danger p-3 text-center fw-bold">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Email</label>
            <input 
              type="email" 
              name="email"
              className="form-control p-3 bg-light border-0" 
              placeholder="coordinator@clinidea.in"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold">Password</label>
            <input 
              type="password" 
              name="password"
              className="form-control p-3 bg-light border-0" 
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn text-white w-100 py-3 fw-bold fs-5 shadow-sm" 
            style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', border: 'none' }} 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </AuthLayout>
    </>
  );
};

export default CoordinatorLogin;
