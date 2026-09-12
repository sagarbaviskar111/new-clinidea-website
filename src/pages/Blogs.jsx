import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import { Helmet } from 'react-helmet-async';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/blogs`);
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const data = await res.json();
        setBlogs(data || []);
      } catch (err) {
        setError('We are currently unable to load the blogs. Please check back later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      <Helmet>
        <title>Insights & Industry Blogs | Clinidea Education</title>
        <meta name="description" content="Stay updated with the latest trends, tips, and insights in Clinical Research, Pharmacovigilance, and Data Management from Clinidea Education." />
        <meta name="keywords" content="Clinical Research blogs, Pharmacovigilance career guides, Healthcare article insights" />
        <link rel="canonical" href="https://clinidea.in/blogs" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Insights & Industry Blogs | Clinidea Education" />
        <meta property="og:description" content="Stay updated with the latest trends, tips, and insights in Clinical Research, Pharmacovigilance, and Data Management." />
        <meta property="og:url" content="https://clinidea.in/blogs" />
        <meta property="og:image" content="https://clinidea.in/images/about.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Insights & Industry Blogs | Clinidea Education" />
        <meta name="twitter:description" content="Stay updated with the latest trends, tips, and insights in Clinical Research, Pharmacovigilance, and Data Management." />
        <meta name="twitter:image" content="https://clinidea.in/images/about.webp" />
      </Helmet>

      {/* Hero Section */}
      <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: 'url(/images/bg_2.webp)' }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end">
            <div className="col-md-9 pb-5">
              <p className="breadcrumbs mb-2"><span className="mr-2"><a href="/index">Home <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></a></span> <span>Blogs <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></span></p>
              <h1 className="mb-0 bread">Clinidea Published Blogs</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section styled identically to Events Page Title Header block */}
      <section className="ftco-section bg-light" style={{ minHeight: '80vh', padding: '4em 0' }}>
        <div className="container">
          <div className="row justify-content-center pb-5 mb-3">
            <div className="col-md-8 heading-section text-center">
              <h2 style={{ fontWeight: '800', color: 'var(--color-primary)' }}>Clinidea Published Blogs</h2>
              <span className="subheading">Discover Expert Perspectives, Healthcare Trends & Career Milestones</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div className="text-muted fw-bold">Fetching interesting reads...</div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center shadow-sm rounded-3 max-width-600 mx-auto" role="alert">
              <i className="fa fa-exclamation-circle me-2"></i> {error}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-5">
              <h3 className="fw-bold text-muted mb-2">No Blogs Published Yet</h3>
              <p className="text-muted">Check back soon for our latest expert insights and articles.</p>
            </div>
          ) : (
            <div className="row justify-content-center">
              {blogs.map(blog => (
                <div key={blog.id} className="col-11 col-sm-10 col-md-6 col-lg-4 d-flex align-items-stretch mb-4 mb-lg-5">
                  <div 
                    className="card-premium border-0 h-100 shadow-sm rounded-4 overflow-hidden" 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      width: '100%', 
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer',
                      background: '#ffffff'
                    }}
                    onClick={() => navigate(`/blogs/${blog.slug}`)}
                    onMouseOver={(e) => { 
                      e.currentTarget.style.transform = 'translateY(-5px)'; 
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'; 
                    }}
                    onMouseOut={(e) => { 
                      e.currentTarget.style.transform = 'translateY(0)'; 
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'; 
                    }}
                  >
                    <div style={{ width: '100%', overflow: 'hidden', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center' }}>
                      <img loading="lazy" 
                        src={blog.featuredImage ? `${BASE_URL}${blog.featuredImage}` : 'https://via.placeholder.com/600x400?text=Clinidea+Blog'} 
                        alt={blog.title} 
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Clinidea+Blog'; }}
                      />
                    </div>
                    <div className="card-body p-4 d-flex flex-column" style={{ flexGrow: 1 }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge" style={{ backgroundColor: 'rgba(30, 94, 255, 0.05)', color: 'var(--color-secondary)', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {blog.category ? blog.category.name.toUpperCase() : 'ARTICLE'}
                        </span>
                        <div className="text-muted small fw-bold">
                          <span className="fa fa-calendar-alt me-1" style={{ color: 'var(--color-secondary)' }}></span> {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <h4 className="card-title" style={{ fontWeight: '700', color: 'var(--color-primary)', fontSize: '1.25rem', lineHeight: '1.4' }}>{blog.title}</h4>
                      
                      <p className="card-text mb-4 flex-grow-1" style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                        {blog.metaDescription || blog.content.replace(/<[^>]+>/g, '').substring(0, 110) + '...'}
                      </p>
                      
                      <div className="mt-auto pt-2">
                        <button 
                          className="btn w-100 py-2 d-flex justify-content-center align-items-center"
                          style={{
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                            color: 'white',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(30, 94, 255, 0.2)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                          }}
                          onMouseOver={(e) => { 
                            e.currentTarget.style.transform = 'translateY(-2px)'; 
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 94, 255, 0.3)'; 
                          }}
                          onMouseOut={(e) => { 
                            e.currentTarget.style.transform = 'translateY(0)'; 
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(30, 94, 255, 0.2)'; 
                          }}
                        >
                          Read Article <span className="fa fa-arrow-right ms-2"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="footer bg-dark">
        <div className="container-fluid px-lg-5">
          <div className="row">
            <div className="col-md-12 py-4 text-center text-white">
              <p className="mb-0">&copy; {new Date().getFullYear()} Clinidea Education. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blogs;
