import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminStudents = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Active / Inactive
  const [enrollFilter, setEnrollFilter] = useState(''); // Pending / Confirmed

  // Selected Profile Panel
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, [navigate]);

  const fetchStudents = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    const url = `${BASE_URL}/api/admin/students`;
    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        if(!res.ok) {
          if (res.status === 401) throw new Error('Unauthorized');
          throw new Error('Failed to fetch data');
        }
        return res.json();
      })
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === 'Unauthorized') {
          // Token is invalid, let the global interceptor or AdminRoute handle it
        } else {
          setLoading(false);
          console.error("Error fetching students:", err);
        }
      });
  };

  const downloadSecureFile = async (fileUrl, documentType) => {
    const token = localStorage.getItem('adminToken');
    try {
      const filename = fileUrl.split('/').pop();
      const url = `${BASE_URL}/api/admin/documents/${filename}`;
      
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error("Secured retrieval failed. Target file may be orphaned.");
      
      const blob = await res.blob();
      const downloadLink = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadLink;
      a.download = `Clinidea_${documentType}_${filename}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(`Download Error: ${err.message}`);
    }
  };

  const viewSecureFile = async (fileUrl) => {
    const token = localStorage.getItem('adminToken');
    try {
      const filename = fileUrl.split('/').pop();
      const url = `${BASE_URL}/api/admin/documents/${filename}`;
      
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!res.ok) throw new Error("Secured retrieval failed.");
      
      const blob = await res.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      window.open(objectUrl, '_blank');
    } catch (err) {
      alert(`Viewer Error: ${err.message}`);
    }
  };

  const handleDocVerify = async (docId, newStatus) => {
    const token = localStorage.getItem('adminToken');
    try {
      const url = `${BASE_URL}/api/admin/documents/${docId}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Verification sync failed");
      
      // Update local state cleanly
      const updatedDocs = selectedStudent.documents.map(d => 
        d.id === docId ? { ...d, status: newStatus } : d
      );
      setSelectedStudent({ ...selectedStudent, documents: updatedDocs });
      
      const updatedStudents = students.map(s => 
        s.id === selectedStudent.id ? { ...s, documents: updatedDocs } : s
      );
      setStudents(updatedStudents);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePasswordReset = async () => {
    const newPassword = window.prompt(`Enter new password for ${selectedStudent.fullName} (min 6 chars):`);
    if (!newPassword) return;
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      const url = `${BASE_URL}/api/admin/users/${selectedStudent.id}/reset-password`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Password updated successfully");
      } else {
        throw new Error(data.error || "Failed to reset password");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Registration verification is now handled automatically via Razorpay webhook / API

  // Filter Logic
  const filteredStudents = students.filter(student => {
    const searchMatch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.phone.includes(searchTerm);
    
    const statusMatch = statusFilter === '' || student.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Enrollment is dynamically mapped (latest enrollment determines status)
    let latestEnrollmentStatus = '';
    if(student.enrollments && student.enrollments.length > 0) {
      latestEnrollmentStatus = student.enrollments[0].enrollmentStatus.toLowerCase();
    } else {
      latestEnrollmentStatus = 'none';
    }
    const enrollMatch = enrollFilter === '' || latestEnrollmentStatus === enrollFilter.toLowerCase();
    
    return searchMatch && statusMatch && enrollMatch;
  });

  if (loading) return <div className="d-flex justify-content-center mt-5">Loading Student Directory...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="admin-content">
        <h2 className="mb-4 fw-bold" style={{ color: 'var(--color-primary)' }}>Student CRM Engine</h2>

        {/* Toolbar */}
        <div className="d-flex justify-content-between mb-4 gap-3 bg-white p-3 rounded-4 shadow-sm border text-dark">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Regex cross-search by name, email, or phone..." 
            style={{ maxWidth: '400px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="d-flex gap-2 w-100 justify-content-end">
            <select 
              className="form-select" 
              style={{ maxWidth: '180px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">System Status</option>
              <option value="active">Active ID</option>
              <option value="inactive">Suspended</option>
            </select>
            <select 
              className="form-select" 
              style={{ maxWidth: '180px' }}
              value={enrollFilter}
              onChange={(e) => setEnrollFilter(e.target.value)}
            >
              <option value="">Academic Array</option>
              <option value="pending">Pending Course</option>
              <option value="confirmed">Enrolled</option>
              <option value="none">No Bookings</option>
            </select>
          </div>
        </div>

        {/* Master Student Roster */}
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-4">Student Profile</th>
                    <th>Contact Loop</th>
                    <th>Highest Qualification</th>
                    <th>Active Course Vector</th>
                    <th>Status Matrix</th>
                    <th className="text-end px-4">Admin Config</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => {
                    const latestEnrollment = student.enrollments && student.enrollments.length > 0 ? student.enrollments[0] : null;
                    return (
                    <tr key={student.id}>
                      <td className="py-3 px-4">
                         <span className="fw-bold d-block text-dark">{student.fullName}</span>
                         <span className="badge bg-secondary" style={{ fontSize: '10px' }}>ID: CLN-{student.id}</span>
                      </td>
                      <td>
                         <span className="d-block small text-muted"><i className="fa fa-envelope me-1"></i> {student.email}</span>
                         <span className="d-block small text-muted"><i className="fa fa-phone me-1"></i> {student.phone}</span>
                      </td>
                      <td>
                         <span className="d-block fw-bold text-primary">{student.profile?.qualification || 'Not Submitted'}</span>
                         {student.profile?.graduationYear && <small className="text-muted">Batch {student.profile.graduationYear}</small>}
                      </td>
                      <td>
                         {latestEnrollment ? (
                            <span className="badge bg-dark fw-bold text-wrap" style={{ lineHeight: '1.4' }}>{latestEnrollment.courseName} (Enrolled)</span>
                         ) : student.registeredCourse ? (
                            <span className="badge bg-info text-dark fw-bold text-wrap" style={{ lineHeight: '1.4' }}>{student.registeredCourse} (Registered)</span>
                         ) : (
                            <span className="text-muted small">No Course Attached</span>
                         )}
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1 align-items-start">
                          <span className={`badge ${student.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                            {student.status.toUpperCase()}
                          </span>
                          {latestEnrollment && (
                            <span className={`badge border ${latestEnrollment.enrollmentStatus === 'confirmed' ? 'border-primary text-primary' : 'border-warning text-warning'}`}>
                              {latestEnrollment.enrollmentStatus.toUpperCase()} BOOKING
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-end px-4">
                        <button 
                          className="btn btn-sm btn-dark fw-bold px-3 shadow-sm" style={{ borderRadius: '8px' }}
                          onClick={() => setSelectedStudent(student)}
                        >
                          Deep Inspect <i className="fa fa-arrow-right ms-1"></i>
                        </button>
                      </td>
                    </tr>
                    )
                  })}
                  {filteredStudents.length === 0 && (
                     <tr><td colSpan="6" className="text-center py-5">No active profiles matching parameters in SQLite.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Slide-over Frame */}
      {selectedStudent && (
        <div 
           className="bg-white border-start shadow-lg position-fixed top-0 bottom-0 end-0 p-4 custom-scrollbar"
           style={{ width: '100%', maxWidth: '500px', zIndex: 1050, overflowY: 'scroll' }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
            <h4 className="fw-bold mb-0 text-primary">Student Telemetry</h4>
          </div>
            <button className="btn-close" onClick={() => setSelectedStudent(null)}></button>
          </div>

          {/* Root Metadata */}
          <div className="mb-4 bg-light p-3 rounded-4 border">
            <h5 className="fw-bold mb-0 text-dark fs-5">{selectedStudent.fullName}</h5>
            <p className="mb-1 text-muted"><a href={`mailto:${selectedStudent.email}`}>{selectedStudent.email}</a></p>
            <p className="mb-2"><i className="fa fa-phone me-2 text-success"></i><a href={`tel:${selectedStudent.phone}`}>{selectedStudent.phone}</a></p>
            
            <hr className="my-2" />
            
            <details className="mt-3">
              <summary className="mb-1 fw-bold text-dark fs-6" style={{ cursor: 'pointer', outline: 'none' }}>Address Registration</summary>
              <div className="mt-2 p-2 bg-white rounded border">
                {selectedStudent.profile ? (
                  <p className="small text-muted mb-0">
                    {selectedStudent.profile.address}, {selectedStudent.profile.city}, {selectedStudent.profile.state} - {selectedStudent.profile.pincode}
                  </p>
                ) : (
                  <p className="small text-danger mb-0">Profile demographic forms incomplete.</p>
                )}
              </div>
            </details>

            <hr className="my-3" />
            <p className="mb-1 fw-bold text-dark fs-6 mt-3">Registration Payment (₹10,000)</p>
            {selectedStudent.registrationFeePaid ? (
               <div className="mb-2">
                 <span className="badge bg-success mb-2">Paid</span>
                 {selectedStudent.registeredCourse && (
                   <div className="small bg-white p-2 rounded border mt-1">
                     <span className="fw-bold text-muted">Registered Course:</span><br/>
                     <span className="text-dark fw-bold">{selectedStudent.registeredCourse}</span>
                   </div>
                 )}
               </div>
            ) : (
               <span className="badge bg-danger">Pending Payment</span>
            )}

            <hr className="my-3" />
            <div className="mt-3">
              <span className="fw-bold mb-2 text-dark fs-6 d-block">Account Security</span>
              <button 
                className="btn btn-warning fw-bold btn-sm shadow-sm"
                onClick={handlePasswordReset}
              >
                <i className="fa fa-key me-2"></i>Reset Student Password
              </button>
            </div>
          </div>

          {/* Academic Background */}
          {selectedStudent.profile && (
            <details className="mb-4">
              <summary className="fw-bold mb-2 text-dark fs-6 border-bottom pb-1 d-block w-100" style={{ cursor: 'pointer', outline: 'none' }}>Academic Background</summary>
              <div className="d-flex justify-content-between mt-2">
                <div>
                  <span className="fw-bold text-dark d-block">Qualification</span>
                  <span>{selectedStudent.profile.qualification || 'N/A'}</span>
                </div>
                <div className="text-end">
                  <span className="fw-bold text-dark d-block">Graduating Class</span>
                  <span>{selectedStudent.profile.graduationYear || 'N/A'}</span>
                </div>
              </div>
              <p className="mt-2 text-muted fw-bold mb-0"><small>{selectedStudent.profile.collegeName || 'Unknown College'}</small></p>
            </details>
          )}

          {/* Secure Raw Documents Area */}
          <details className="mb-4" open>
            <summary className="fw-bold mb-3 text-dark fs-6 border-bottom pb-2 d-block w-100" style={{ cursor: 'pointer', outline: 'none' }}>Secured Cryptographic Binaries (Vault)</summary>
            {selectedStudent.documents && selectedStudent.documents.length > 0 ? (
              <div className="d-flex flex-column gap-3 mt-2">
                {selectedStudent.documents.map(doc => (
                  <div key={doc.id} className="p-3 border rounded-3" style={{ backgroundColor: '#fcfcfc' }}>
                    <div className="d-flex align-items-center justify-content-between mb-2 flex-wrap gap-2">
                      <div>
                        <span className="fw-bold d-block text-capitalize text-dark" style={{ fontSize: '13px' }}>
                           <i className="fa fa-file-contract me-2 text-primary"></i>{doc.documentType.replace('_', ' ')}
                        </span>
                        <small className="text-muted" style={{ fontSize: '11px' }}>{new Date(doc.uploadedAt).toLocaleString()}</small>
                      </div>
                      <div className="d-flex gap-2">
                        <button 
                          onClick={() => viewSecureFile(doc.fileUrl)}
                          className="btn btn-sm btn-info fw-bold px-3"
                        >
                          View <i className="fa fa-eye ms-1"></i>
                        </button>
                        <button 
                          onClick={() => downloadSecureFile(doc.fileUrl, doc.documentType)}
                          className="btn btn-sm btn-dark fw-bold px-3"
                        >
                          Pull <i className="fa fa-download ms-1"></i>
                        </button>
                      </div>
                    </div>
                    
                    {/* Verification Toggle */}
                    <div className="d-flex align-items-center bg-white p-2 border rounded mt-2">
                      <span className="small fw-bold text-muted me-2">KYC Status:</span>
                      <select 
                        className={`form-select form-select-sm fw-bold border-0 ${doc.status === 'verified' ? 'text-success' : 'text-danger'}`}
                        value={doc.status}
                        onChange={(e) => handleDocVerify(doc.id, e.target.value)}
                        style={{ cursor: 'pointer', backgroundColor: 'transparent' }}
                      >
                        <option value="not_verified" className="text-danger">Not Verified (Pending)</option>
                        <option value="verified" className="text-success">Verified & Approved</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-warning py-2 small fw-bold mt-2">Student has not pushed any documents to the secure vault.</div>
            )}
            <small className="text-muted d-block mt-3 lh-sm" style={{ fontSize: '11px' }}>
               Binaries extracted natively via Bearer token passing. This bypasses the static HTML routing blocks enabling secure Admin downloading to your physical hard drive.
            </small>
          </details>

          <button className="btn btn-outline-danger w-100 mt-5 fw-bold" onClick={() => setSelectedStudent(null)}>Close Overlay</button>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
