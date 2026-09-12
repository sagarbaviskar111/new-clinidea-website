import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';
import AuthLayout from '../components/shared/AuthLayout';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminLastActivity', Date.now().toString());
      if (data.role) {
        localStorage.setItem('adminRole', data.role);
      } else {
        localStorage.setItem('adminRole', 'superadmin'); // fallback
      }
      
      if (data.role === 'mentor') {
        navigate('/admin/lms');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Clinidea Education</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuthLayout 
        title="Admin Portal" 
        subtitle="Sign in to access the administrator panel" 
        role="admin"
      >
        {error && <div className="alert alert-danger p-2 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Administrator email</label>
            <input 
              type="email" 
              className="form-control"
              placeholder="admin@clinidea.in"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required 
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required 
            />
          </div>
          <button type="submit" className="btn w-100 clinidea-auth__submit" disabled={loading}>
            {loading ? 'Signing you in...' : <>Access administration <i className="fa fa-arrow-right ms-2" /></>}
          </button>
        </form>
      </AuthLayout>
    </>
  );
};

export default AdminLogin;
