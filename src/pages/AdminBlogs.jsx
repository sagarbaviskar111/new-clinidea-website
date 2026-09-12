import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import AdminSidebar from '../components/AdminSidebar';
import '../admin.css';

const AdminBlogs = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    content: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
    schemaMarkup: '',
    featuredImage: '',
    isPublished: false
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [navigate]);

  const fetchBlogs = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/admin/blogs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Unauthorized');
      const data = await res.json();
      setBlogs(data || []);
    } catch (err) {
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (blog) => {
    setIsEditing(true);
    setFormData({
      id: blog.id,
      title: blog.title || '',
      content: blog.content || '',
      slug: blog.slug || '',
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
      schemaMarkup: blog.schemaMarkup || '',
      featuredImage: blog.featuredImage || '',
      isPublished: blog.isPublished || false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setBlogs(blogs.filter(b => b.id !== id));
      } else {
        alert('Failed to delete blog.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting blog.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    let finalImageUrl = formData.featuredImage;

    // Handle image upload if a file was selected
    if (imageFile) {
      setUploading(true);
      const fd = new FormData();
      fd.append('image', imageFile);
      try {
        const uploadRes = await fetch(`${BASE_URL}/api/admin/upload-image`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: fd
        });
        if (uploadRes.ok) {
          const upData = await uploadRes.json();
          finalImageUrl = upData.url;
        } else {
          alert('Failed to upload image. Saving without image update.');
        }
      } catch (err) {
        alert('Error uploading image.');
      }
      setUploading(false);
    }

    const payload = {
      ...formData,
      featuredImage: finalImageUrl
    };

    try {
      const url = isEditing 
        ? `${BASE_URL}/api/admin/blogs/${formData.id}`
        : `${BASE_URL}/api/admin/blogs`;
      
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchBlogs();
        resetForm();
        alert(`Blog ${isEditing ? 'updated' : 'created'} successfully!`);
      } else {
        alert('Failed to save blog.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving blog.');
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setImageFile(null);
    setFormData({
      id: null,
      title: '',
      content: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      schemaMarkup: '',
      featuredImage: '',
      isPublished: false
    });
  };

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex align-items-center mb-4">
          <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
            <i className="fa fa-bars"></i>
          </button>
          <h2 className="admin-header">Blogs Management</h2>
        </div>

        {/* Add / Edit Form */}
        <div className="admin-card mb-5">
          <h4 className="fw-bold mb-4 border-bottom pb-2" style={{ color: 'var(--color-primary)' }}>
            {isEditing ? 'Edit Blog' : 'Create New Blog'}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8 mb-3">
                <label className="form-label fw-bold">Blog Title *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="Enter blog title"
                />
              </div>
              <div className="col-md-4 mb-3 d-flex align-items-end">
                <div className="form-check form-switch mb-2">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="isPublished" 
                    name="isPublished" 
                    checked={formData.isPublished} 
                    onChange={handleInputChange} 
                  />
                  <label className="form-check-label fw-bold" htmlFor="isPublished">Published</label>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">URL Slug (SEO)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleInputChange} 
                  placeholder="Leave blank to auto-generate"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Meta Title (SEO)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="metaTitle" 
                  value={formData.metaTitle} 
                  onChange={handleInputChange} 
                  placeholder="Enter meta title for search engines"
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label fw-bold">Content (HTML allowed) *</label>
                <textarea 
                  className="form-control" 
                  name="content" 
                  rows="8" 
                  value={formData.content} 
                  onChange={handleInputChange} 
                  required
                  placeholder="<p>Write your blog content here...</p>"
                ></textarea>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Featured Image</label>
                <input 
                  type="file" 
                  className="form-control mb-2" 
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files[0])}
                />
                {formData.featuredImage && !imageFile && (
                  <div className="mt-2">
                    <img loading="lazy" src={`${BASE_URL}${formData.featuredImage}`} alt="Current" style={{height: '60px', borderRadius: '4px'}} />
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Meta Description (SEO)</label>
                <textarea 
                  className="form-control" 
                  name="metaDescription" 
                  rows="2" 
                  value={formData.metaDescription} 
                  onChange={handleInputChange} 
                  placeholder="Short description for search engines"
                ></textarea>
              </div>
              
              <div className="col-md-12 mb-3">
                <label className="form-label fw-bold">Schema Markup (JSON-LD)</label>
                <textarea 
                  className="form-control font-monospace" 
                  name="schemaMarkup" 
                  rows="4" 
                  value={formData.schemaMarkup} 
                  onChange={handleInputChange} 
                  placeholder='{"@context": "https://schema.org", "@type": "BlogPosting", ...}'
                ></textarea>
                <small className="text-muted">For Answer Engine Optimization (AEO). Only valid JSON-LD structure should go here without script tags.</small>
              </div>
            </div>

            <div className="mt-4">
              <button type="submit" className="btn btn-success fw-bold px-4 me-2 text-white" disabled={uploading}>
                {uploading ? 'Uploading...' : isEditing ? 'Update Blog' : 'Publish Blog'}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-outline-secondary fw-bold px-4" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Blogs List */}
        <div className="admin-card">
          <h4 className="fw-bold mb-4 border-bottom pb-2" style={{ color: 'var(--color-primary)' }}>All Blogs</h4>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog.id}>
                    <td className="fw-bold">
                      {blog.title}
                      <br/>
                      <small className="text-muted fw-normal">/{blog.slug}</small>
                    </td>
                    <td>
                      <span className={`badge ${blog.isPublished ? 'bg-success' : 'bg-secondary'}`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleEdit(blog)} className="btn btn-sm btn-outline-primary me-2">
                        <i className="fa fa-edit"></i> Edit
                      </button>
                      <button onClick={() => handleDelete(blog.id)} className="btn btn-sm btn-outline-danger">
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr><td colSpan="4" className="text-center py-4">No blogs found. Start writing!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminBlogs;
