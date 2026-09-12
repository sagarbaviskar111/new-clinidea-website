import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';
import AdminSidebar from '../components/AdminSidebar';

const AdminHRDatabase = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/hr-contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setContacts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this HR Contact?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/hr-contacts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchContacts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = tagFilter ? (c.tags && c.tags.includes(tagFilter)) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
          <h2 className="fw-bold" style={{ color: 'var(--color-primary)' }}>HR Contacts Database</h2>
          </div>
          <span className="badge bg-primary fs-6">{contacts.length} Total Contacts</span>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">
            <div className="d-flex gap-3 w-50">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by name, email, or company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select className="form-select w-auto" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
                <option value="">All Tags</option>
                <option value="Clinical Research">Clinical Research</option>
                <option value="Pharmacovigilance">Pharmacovigilance</option>
                <option value="Regulatory Affairs">Regulatory Affairs</option>
              </select>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Tags</th>
                    <th className="text-end px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-4">Loading contacts...</td></tr>
                  ) : filteredContacts.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4">No contacts found.</td></tr>
                  ) : (
                    filteredContacts.map(c => (
                      <tr key={c.id}>
                        <td className="py-3 px-4 fw-bold">{c.name || '-'}</td>
                        <td>{c.email}</td>
                        <td>{c.company || '-'}</td>
                        <td>
                          {c.tags && c.tags.split(',').map((tag, idx) => (
                            <span key={idx} className="badge bg-secondary me-1">{tag.trim()}</span>
                          ))}
                        </td>
                        <td className="text-end px-4">
                          <button className="btn btn-sm btn-success text-white" onClick={() => handleDelete(c.id)}>
                            <i className="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminHRDatabase;
