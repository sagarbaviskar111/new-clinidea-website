import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminCourses = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    fees: '',
    syllabus: '',
    youtubeUrl: ''
  });
  const [brochureFile, setBrochureFile] = useState(null);

  // Quick Media Assign State
  const [mediaCourseId, setMediaCourseId] = useState('');
  const [mediaYoutubeUrl, setMediaYoutubeUrl] = useState('');
  const [mediaBrochureFile, setMediaBrochureFile] = useState(null);
  const [mediaSubmitting, setMediaSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [navigate]);

  const fetchCourses = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return navigate('/admin/login');
    
    const url = `${BASE_URL}/api/courses`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openNewForm = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', duration: '', fees: '', syllabus: '', youtubeUrl: '' });
    setBrochureFile(null);
    setShowForm(true);
  };

  const openEditForm = (course) => {
    setEditingId(course.id);
    setFormData({
      name: course.name || '',
      description: course.description || '',
      duration: course.duration || '',
      fees: course.fees || '',
      syllabus: course.syllabus || '',
      youtubeUrl: course.youtubeUrl || ''
    });
    setBrochureFile(null);
    setShowForm(true);
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    const token = localStorage.getItem('adminToken');
    const url = `${BASE_URL}/api/admin/courses/${id}`;
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Could not delete course.");
      fetchCourses();
    } catch (err) {
      alert(err.message);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  const submitCourseForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem('adminToken');
    
    let brochureUrl = undefined;
    
    if (brochureFile) {
      const uploadUrl = `${BASE_URL}/api/admin/upload-brochure`;
      const filePayload = new FormData();
      filePayload.append('file', brochureFile);
      
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: filePayload
      });
      
      if (uploadRes.ok) {
        const uData = await uploadRes.json();
        brochureUrl = uData.url;
      } else {
        alert("Brochure upload failed.");
      }
    }

    const payload = {
      ...formData,
      youtubeUrl: getEmbedUrl(formData.youtubeUrl),
      ...(brochureUrl && { brochureUrl })
    };

    const targetUrl = editingId 
      ? (`${BASE_URL}/api/admin/courses/${editingId}`)
      : (`${BASE_URL}/api/admin/courses`);

    try {
      const res = await fetch(targetUrl, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error("Failed to save course data.");
      
      setShowForm(false);
      fetchCourses();
    } catch (err) {
      alert(`API Error: ${err.message}`);
    }
    setSubmitting(false);
  };

  const handleMediaCourseChange = (e) => {
    const cid = e.target.value;
    setMediaCourseId(cid);
    if (!cid) {
      setMediaYoutubeUrl('');
      return;
    }
    const selectedCourse = courses.find(c => c.id === parseInt(cid));
    if (selectedCourse) {
      setMediaYoutubeUrl(selectedCourse.youtubeUrl || '');
    }
  };

  const submitMediaForm = async (e) => {
    e.preventDefault();
    if (!mediaCourseId) return alert("Please select a course first.");
    
    setMediaSubmitting(true);
    const token = localStorage.getItem('adminToken');
    let finalBrochureUrl = undefined;

    if (mediaBrochureFile) {
      const uploadUrl = `${BASE_URL}/api/admin/upload-brochure`;
      const filePayload = new FormData();
      filePayload.append('file', mediaBrochureFile);
      
      try {
        const uploadRes = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: filePayload
        });
        if (uploadRes.ok) {
          const uData = await uploadRes.json();
          finalBrochureUrl = uData.url;
        } else {
          alert("Brochure upload failed.");
          setMediaSubmitting(false);
          return;
        }
      } catch (err) {
        alert("Upload error: " + err.message);
        setMediaSubmitting(false);
        return;
      }
    }

    try {
      const targetUrl = `${BASE_URL}/api/admin/courses/${mediaCourseId}/media`;
      const res = await fetch(targetUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          youtubeUrl: getEmbedUrl(mediaYoutubeUrl),
          brochureUrl: finalBrochureUrl
        })
      });
      
      if (!res.ok) throw new Error("Could not update media assets.");
      
      alert("Media assets updated successfully!");
      setMediaCourseId('');
      setMediaYoutubeUrl('');
      setMediaBrochureFile(null);
      
      document.getElementById('mediaBrochureInput').value = '';
      
      fetchCourses();
    } catch (err) {
      alert(err.message);
    }
    setMediaSubmitting(false);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
          <h2 className="fw-bold m-0" style={{ color: 'var(--color-primary)' }}>Course Management</h2>
          </div>
          {!showForm && (
            <button className="btn btn-success fw-bold px-4 shadow-sm" style={{ borderRadius: '8px' }} onClick={openNewForm}>
              <i className="fa fa-plus me-2"></i> Add New Course
            </button>
          )}
        </div>

        {!showForm && (
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-header bg-dark text-white border-0 pt-3 pb-2 px-4" style={{ borderRadius: '15px 15px 0 0' }}>
              <h5 className="fw-bold mb-0"><i className="fa fa-photo-video me-2"></i> Quick Update: Course Media</h5>
            </div>
            <div className="card-body p-4 bg-light" style={{ borderRadius: '0 0 15px 15px' }}>
              <form onSubmit={submitMediaForm}>
                <div className="row g-3 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label fw-bold">Select Existing Course</label>
                    <select className="form-select" value={mediaCourseId} onChange={handleMediaCourseChange} required>
                      <option value="">-- Choose Course --</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">YouTube Video URL</label>
                    <input type="url" className="form-control" placeholder="https://youtube.com/watch?v=..." value={mediaYoutubeUrl} onChange={e => setMediaYoutubeUrl(e.target.value)} disabled={!mediaCourseId} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-bold">Information Brochure (PDF)</label>
                    <input type="file" id="mediaBrochureInput" className="form-control" accept=".pdf,.doc,.docx" onChange={e => setMediaBrochureFile(e.target.files[0])} disabled={!mediaCourseId} />
                  </div>
                  <div className="col-md-2 text-end">
                    <button type="submit" className="btn btn-warning fw-bold w-100" disabled={!mediaCourseId || mediaSubmitting}>
                      {mediaSubmitting ? 'Updating...' : 'Update Media'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {showForm ? (
          <div className="card shadow-lg border-0 rounded-4 mb-4 slide-in">
            <div className="card-header bg-primary text-white border-0 pt-4 pb-0 px-4">
               <h4 className="fw-bold mb-3">{editingId ? 'Edit Course' : 'Add New Course'}</h4>
            </div>
            <div className="card-body p-4 p-md-5">
              <form onSubmit={submitCourseForm}>
                
                <div className="row g-4 mb-4">
                  <div className="col-md-8">
                    <label className="form-label fw-bold">Course Title <span className="text-danger">*</span></label>
                    <input type="text" className="form-control form-control-lg bg-light" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-bold">Duration</label>
                    <input type="text" className="form-control form-control-lg bg-light" name="duration" placeholder="e.g. 6 Months" value={formData.duration} onChange={handleInputChange} />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label fw-bold">Fees (₹)</label>
                    <input type="number" className="form-control form-control-lg bg-light" name="fees" placeholder="25000" value={formData.fees} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">YouTube Video Link</label>
                    <input type="url" className="form-control bg-light" name="youtubeUrl" value={formData.youtubeUrl} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=..." />
                    <small className="text-muted">Link will be automatically converted to embed format for frontend display.</small>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Description</label>
                  <textarea className="form-control bg-light" rows="3" name="description" value={formData.description} onChange={handleInputChange} placeholder="Course description..."></textarea>
                </div>

                <div className="row g-4 mb-5">
                  <div className="col-md-8">
                    <label className="form-label fw-bold">Syllabus</label>
                    <textarea className="form-control bg-light" rows="5" name="syllabus" value={formData.syllabus} onChange={handleInputChange} placeholder="Course syllabus..."></textarea>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold d-block">Information Brochure (PDF)</label>
                    <div className="p-3 border rounded bg-light">
                      <p className="text-muted small mb-2">Upload a new brochure to replace the existing one.</p>
                      <input type="file" className="form-control" onChange={e => setBrochureFile(e.target.files[0])} accept=".pdf,.doc,.docx" />
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-3 justify-content-end">
                   <button type="button" className="btn btn-outline-secondary px-5 fw-bold" onClick={() => setShowForm(false)} disabled={submitting}>Cancel</button>
                   <button type="submit" className="btn btn-success px-5 fw-bold text-white shadow" disabled={submitting}>
                     {submitting ? 'Saving...' : (editingId ? 'Update Course' : 'Save Course')}
                   </button>
                </div>
                
              </form>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-0">
              {loading ? (
                 <div className="p-5 text-center fw-bold">Loading Courses...</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3">ID</th>
                        <th>Course Name</th>
                        <th>Duration</th>
                        <th>Fees</th>
                        <th className="text-end px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map(course => (
                        <tr key={course.id}>
                          <td className="px-4 fw-bold text-muted">#{course.id}</td>
                          <td className="fw-bold text-dark">
                            {course.name}
                            <div className="mt-1">
                              {course.youtubeUrl && <span className="badge bg-danger me-1" title="YouTube Video Attached"><i className="fa fa-youtube-play"></i> Video</span>}
                              {course.brochureUrl && <span className="badge bg-info" title="Brochure PDF Attached"><i className="fa fa-file-pdf-o"></i> Brochure</span>}
                            </div>
                          </td>
                          <td><span className="badge bg-secondary">{course.duration || 'Flexible'}</span></td>
                          <td><span className="fw-bold text-success">₹{course.fees || '0'}</span></td>
                          <td className="text-end px-4">
                            <button className="btn btn-sm btn-outline-primary fw-bold me-2" onClick={() => openEditForm(course)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger fw-bold" onClick={() => deleteCourse(course.id)}><i className="fa fa-trash"></i></button>
                          </td>
                        </tr>
                      ))}
                      {courses.length === 0 && <tr><td colSpan="5" className="p-5 text-center text-muted">No courses found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminCourses;
