import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { BASE_URL } from '../config';

const AdminLeads = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [selectedLead, setSelectedLead] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchLeads = () => {
    const token = localStorage.getItem('adminToken');
    const adminRole = localStorage.getItem('adminRole');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    if (adminRole === 'mentor') {
      navigate('/admin/lms');
      return;
    }
    fetch(`${BASE_URL}/api/admin/leads`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          navigate('/admin/login');
          throw new Error('Unauthorized');
        }
        if (!res.ok) throw new Error('ServerError');
        return res.json();
      })
      .then(data => {
        setLeads(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching leads:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeads();
    // Fetch courses for brochure links
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (Array.isArray(data)) setCourses(data);
      })
      .catch(console.error);
  }, [navigate]);

  const handleUpdateLead = async () => {
    setUpdating(true);
    const token = localStorage.getItem('adminToken');
    const url = `${BASE_URL}/api/admin/leads/${selectedLead.id}`;
    
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: selectedLead.status,
          notes: selectedLead.notes
        })
      });
      if (res.ok) {
        fetchLeads(); // refresh leads to reflect update
        setSelectedLead(null); // Close modal equivalent (or clear selection)
      }
    } catch (error) {
      console.error("Failed to update", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead permanently?")) return;
    setUpdating(true);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        // Instantly update UI state for a snappy experience
        setLeads(prevLeads => prevLeads.filter(l => l.id !== id));
        if (selectedLead && selectedLead.id === id) setSelectedLead(null);
        
        // Fetch fresh list in background to ensure sync
        fetchLeads();
        
        alert("Lead deleted successfully!");
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert("Failed to delete lead: " + (errorData.error || "Server Error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting lead");
    } finally {
      setUpdating(false);
    }
  };

  // Derived state for table
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return 'bg-primary';
      case 'Contacted': return 'bg-info';
      case 'Interested': return 'bg-warning text-dark';
      case 'Converted': return 'bg-success';
      case 'Not Interested': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getWhatsAppLink = (lead) => {
    const phoneNum = lead.phone.replace(/[^0-9]/g, '');
    const registerLink = `${BASE_URL}/register?course=${encodeURIComponent(lead.courseInterest || '')}`;
    const text = `Hello *${lead.name}* 👋,\n\nThank you for showing interest in the *Advanced Certification Course ${lead.courseInterest}*.\n\n🚀 *Register Now:* ${registerLink}\n\nOur team will connect with you soon to guide you further regarding the course.\n\nIf you have any questions regarding the course, placements, internship, or career opportunities, feel free to reply to this message. We’ll be happy to assist you.\n\nRegards,\n*Team Clinidea Education*`;
    const encodedText = encodeURIComponent(text);
    
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      return `intent://send/?phone=${phoneNum}&text=${encodedText}#Intent;scheme=whatsapp;package=com.whatsapp.w4b;end`;
    } else if (isIOS) {
      return `whatsapp-smb://send?phone=${phoneNum}&text=${encodedText}`;
    } else {
      return `https://api.whatsapp.com/send?phone=${phoneNum}&text=${encodedText}`;
    }
  };

  if (loading) return <div className="d-flex justify-content-center mt-5">Loading...</div>;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex align-items-center mb-4">
          <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
            <i className="fa fa-bars"></i>
          </button>
          <h2 className="mb-4 fw-bold" style={{ color: 'var(--color-primary)' }}>Leads Management</h2>
        </div>
        
        {/* Top Controls */}
        <div className="row mb-4">
          <div className="col-md-8 mb-2">
            <input 
              type="text" 
              className="form-control p-3 shadow-sm border-0 rounded-3" 
              placeholder="Search by Name, Email, or Phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-md-4 mb-2">
            <select 
              className="form-select p-3 shadow-sm border-0 rounded-3" 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Converted">Converted</option>
              <option value="Not Interested">Not Interested</option>
            </select>
          </div>
        </div>

        <div className="row">
          {/* Table Column */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: '70vh' }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light sticky-top">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Status</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map(lead => (
                        <tr key={lead.id} className={selectedLead?.id === lead.id ? 'table-primary' : ''}>
                          <td className="py-3 px-4 text-nowrap">{new Date(lead.createdAt).toLocaleDateString()}</td>
                          <td className="fw-bold">{lead.name}</td>
                          <td>{lead.phone}</td>
                          <td>{lead.email}</td>
                          <td><span className="text-secondary small">{lead.courseInterest}</span></td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="text-center">
                            <button 
                              className="btn btn-sm btn-outline-primary rounded-pill fw-bold"
                              onClick={() => setSelectedLead(lead)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredLeads.length === 0 && (
                        <tr><td colSpan="7" className="text-center py-5 text-muted">No leads match your criteria.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Details Modal */}
          {selectedLead && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={(e) => { if (e.target.classList.contains('modal')) setSelectedLead(null); }}>
              <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                <div className="modal-content border-0 shadow rounded-4">
                  <div className="modal-header bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 fw-bold">Lead Details</h4>
                    <button className="btn-close" onClick={() => setSelectedLead(null)}></button>
                  </div>
                  <div className="modal-body px-4 pb-4 pt-3" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                  <div className="mb-3">
                    <label className="text-muted small fw-bold">Full Name</label>
                    <p className="fs-5 fw-bold mb-0">{selectedLead.name}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-bold">Contact Info</label>
                    <p className="mb-0 "><span className="fa fa-envelope me-2 text-primary"></span>{selectedLead.email}</p>
                    <p className="mb-0"><span className="fa fa-phone me-2 text-primary"></span>{selectedLead.phone}</p>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-bold">Course Interest</label>
                    <p className="mb-0 badge bg-secondary text-wrap fs-6">{selectedLead.courseInterest}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="text-muted small fw-bold">Quick Actions</label>
                    <div className="d-flex gap-2 mt-1">
                      <a 
                        href={`tel:${selectedLead.phone}`}
                        className="btn btn-success rounded-pill fw-bold px-4 shadow-sm flex-grow-1"
                        title="Call Lead"
                      >
                        <i className="fa fa-phone me-2"></i> Call
                      </a>
                      <a 
                        href={getWhatsAppLink(selectedLead)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn rounded-pill fw-bold text-white px-4 shadow-sm flex-grow-1"
                        style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                        title="Message on WhatsApp Business"
                      >
                        <i className="fab fa-whatsapp me-2"></i> WA Business
                      </a>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="text-muted small fw-bold">Message</label>
                    <div className="p-3 bg-light rounded text-muted fst-italic">
                      {selectedLead.message ? selectedLead.message : "No message provided."}
                    </div>
                  </div>

                  <hr className="my-4" />
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Update Status</label>
                    <select 
                      className="form-select bg-light"
                      value={selectedLead.status}
                      onChange={(e) => setSelectedLead({...selectedLead, status: e.target.value})}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Interested">Interested</option>
                      <option value="Converted">Converted</option>
                      <option value="Not Interested">Not Interested</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Admin Notes</label>
                    <textarea 
                      className="form-control bg-light" 
                      rows="3" 
                      placeholder="Add private notes here..."
                      value={selectedLead.notes || ''}
                      onChange={(e) => setSelectedLead({...selectedLead, notes: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    className="btn w-100 py-3 fw-bold rounded-pill mb-3" 
                    style={{ backgroundColor: 'var(--color-primary, #0d6efd)', color: '#ffffff', boxShadow: '0 4px 12px rgba(13, 110, 253, 0.4)', transition: 'all 0.3s' }}
                    onClick={handleUpdateLead}
                    disabled={updating}
                  >
                    <i className="fa fa-save me-2"></i>
                    {updating ? 'Saving Updates...' : 'Save Changes'}
                  </button>
                  <button 
                    className="btn btn-outline-danger w-100 py-2 fw-bold rounded-pill" 
                    onClick={() => handleDeleteLead(selectedLead.id)}
                    disabled={updating}
                  >
                    Delete Lead
                  </button>
                </div>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLeads;
