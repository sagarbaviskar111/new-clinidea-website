import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';
import AuthLayout from '../components/shared/AuthLayout';

const MentorLogin = () => {
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
      const url = `${BASE_URL}/api/mentor/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      localStorage.setItem('mentorToken', data.token);
      navigate('/mentor/dashboard'); 
      
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
        <title>Mentor Login | Clinidea Education</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuthLayout 
        title="Mentor Portal" 
        subtitle="Sign in to manage your batches and content" 
        role="mentor"
      >
        {error && <div className="alert alert-danger p-3 text-center fw-bold">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Clinidea email</label>
            <input 
              type="email" 
              name="email"
              className="form-control"
              placeholder="mentor@clinidea.in"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              name="password"
              className="form-control"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn w-100 clinidea-auth__submit"
            disabled={loading}
          >
            {loading ? 'Signing you in...' : <>Enter mentor workspace <i className="fa fa-arrow-right ms-2" /></>}
          </button>
        </form>
      </AuthLayout>
    </>
  );
};

export default MentorLogin;
