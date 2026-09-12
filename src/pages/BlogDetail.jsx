import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import { Helmet } from 'react-helmet-async';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/blogs/${slug}`);
        if (res.status === 404) {
          navigate('/blogs');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch blog');
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        setError('Unable to load the article at this time.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '80vh' }}>
        <div className="alert alert-danger d-inline-block mt-5 shadow-sm rounded-3">
          <i className="fa fa-exclamation-triangle me-2"></i> {error || 'Blog not found'}
        </div>
        <br />
        <Link 
          to="/blogs" 
          className="btn text-white mt-3 px-4 py-2 fw-bold"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', borderRadius: '10px' }}
        >
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.metaTitle || `${blog.title} | Clinidea Insights`}</title>
        <meta name="description" content={blog.metaDescription || blog.title.substring(0, 160)} />
        <link rel="canonical" href={`https://clinidea.in/blogs/${blog.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta property="og:description" content={blog.metaDescription || blog.title.substring(0, 160)} />
        <meta property="og:url" content={`https://clinidea.in/blogs/${blog.slug}`} />
        <meta property="og:image" content={blog.featuredImage ? (blog.featuredImage.startsWith('http') ? blog.featuredImage : `https://clinidea.in${blog.featuredImage}`) : 'https://clinidea.in/images/about.webp'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.metaTitle || blog.title} />
        <meta name="twitter:description" content={blog.metaDescription || blog.title.substring(0, 160)} />
        <meta name="twitter:image" content={blog.featuredImage ? (blog.featuredImage.startsWith('http') ? blog.featuredImage : `https://clinidea.in${blog.featuredImage}`) : 'https://clinidea.in/images/about.webp'} />
        {blog.schemaMarkup && (
          <script type="application/ld+json">
            {blog.schemaMarkup}
          </script>
        )}
      </Helmet>

      {/* Hero Banner for Blog - Premium layout */}
      <section className="py-5 bg-light border-bottom">
        <div className="container pt-4 pb-2">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-4" style={{ backgroundColor: 'transparent', padding: 0 }}>
              <li className="breadcrumb-item"><Link to="/" className="text-decoration-none fw-bold" style={{ color: 'var(--color-secondary)' }}>Home</Link></li>
              <li className="breadcrumb-item"><Link to="/blogs" className="text-decoration-none fw-bold" style={{ color: 'var(--color-secondary)' }}>Blogs</Link></li>
              <li className="breadcrumb-item active fw-semibold text-muted" aria-current="page">{blog.title.substring(0, 35)}...</li>
            </ol>
          </nav>
          
          <div className="mt-2">
            {blog.category && (
              <span className="badge px-3 py-2 fs-6 mb-3" style={{ backgroundColor: 'rgba(30, 94, 255, 0.08)', color: 'var(--color-secondary)', fontWeight: 'bold' }}>
                {blog.category.name}
              </span>
            )}
            <h1 className="fw-bold mb-3" style={{ color: 'var(--color-primary)', fontSize: '2.5rem', lineHeight: '1.3' }}>{blog.title}</h1>
            <div className="text-muted d-flex align-items-center gap-3">
              <div>
                <span className="fa fa-calendar-alt me-2" style={{ color: 'var(--color-secondary)' }}></span>
                Published on {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-5 bg-white" style={{ minHeight: '60vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              {blog.featuredImage && (
                <img loading="lazy" 
                  src={`${BASE_URL}${blog.featuredImage}`} 
                  alt={blog.title} 
                  className="img-fluid rounded-4 shadow-sm mb-5 w-100"
                  style={{ maxHeight: '480px', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              
              <div 
                className="blog-content px-1 px-md-3" 
                style={{ 
                  fontSize: '1.15rem', 
                  lineHeight: '1.9', 
                  color: '#2d3748', 
                  fontFamily: 'Inter, sans-serif'
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }} 
              />
              
              <hr className="my-5" style={{ opacity: 0.15 }} />
              
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center p-4 bg-light rounded-4 gap-3 border shadow-sm">
                <h5 className="mb-0 fw-bold" style={{ color: 'var(--color-primary)' }}>Share this insightful article:</h5>
                <div className="d-flex gap-2">
                  <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${blog.title}`} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}><i className="fab fa-twitter"></i></a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${blog.title}`} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}><i className="fab fa-linkedin-in"></i></a>
                  <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(blog.title + ' ' + window.location.href)}`} target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}><i className="fab fa-whatsapp"></i></a>
                </div>
              </div>

              <div className="mt-5 text-center">
                <Link 
                  to="/blogs" 
                  className="btn text-white px-5 py-3 fw-bold shadow-sm"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', 
                    borderRadius: '12px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <i className="fa fa-arrow-left me-2"></i> Back to Insights
                </Link>
              </div>
            </div>
          </div>
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
    </>
  );
};

export default BlogDetail;
