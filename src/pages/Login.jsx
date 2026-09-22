import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';
import AuthLayout from '../components/shared/AuthLayout';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const isPortfolioRedirect = redirectPath.startsWith('/student/portfolio');
  const [formData, setFormData] = useState({
    identifier: '',
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
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      localStorage.setItem('userToken', data.token);
      navigate(redirectPath); 
      
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
        <title>Student Login | Clinidea Education</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AuthLayout
        title={isPortfolioRedirect ? "Login to Your Portfolio" : "Student Login"}
        subtitle={isPortfolioRedirect ? "Sign in to edit your public Student Portfolio" : "Welcome back to your educational journey"}
        role="student"
      >
        {error && <div className="alert alert-danger p-3 text-center fw-bold">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email or phone number</label>
            <input 
              type="text" 
              name="identifier"
              className="form-control"
              placeholder="jane@email.com"
              value={formData.identifier}
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
            {loading ? 'Signing you in...' : <>{isPortfolioRedirect ? 'Sign in to your portfolio' : 'Sign in to dashboard'} <i className="fa fa-arrow-right ms-2" /></>}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-muted mb-0">New to Clinidea? <Link to={`/register${location.search}`} className="fw-bold text-decoration-none">Create your account</Link></p>
        </div>
      </AuthLayout>
    </>
  );
};

export default Login;
