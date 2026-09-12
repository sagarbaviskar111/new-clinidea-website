import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { BASE_URL } from '../config';
import AdminSidebar from '../components/AdminSidebar';

const AdminHRCampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [campaign, setCampaign] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // File states
  const [excelFile, setExcelFile] = useState(null);
  const [parsedRecipients, setParsedRecipients] = useState([]);
  const [cvFiles, setCvFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchCampaign = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [campRes, accRes] = await Promise.all([
        fetch(`${BASE_URL}/api/admin/hr-campaigns/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/api/admin/email-accounts`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (campRes.ok) setCampaign(await campRes.json());
      if (accRes.ok) setAccounts(await accRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
    // Refresh stats every 10 seconds if running
    const interval = setInterval(() => {
      if (campaign && campaign.status === 'running') fetchCampaign();
    }, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const handleUpdateField = async (field, value) => {
    const updated = { ...campaign, [field]: value };
    setCampaign(updated);
    
    // Auto-save
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${BASE_URL}/api/admin/hr-campaigns/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error('Failed to save field', field);
    }
  };

  const handleControl = async (action) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/hr-campaigns/${id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchCampaign();
    } catch (err) {
      console.error('Failed to', action);
    }
  };

  // ----------------------------------------------------
  // EXCEL PARSING LOGIC
  // ----------------------------------------------------
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const dataArray = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

      // Find the header row (a row that contains 'email' or similar)
      let headerRowIndex = -1;
      let emailColIdx = -1;
      let nameColIdx = -1;
      let companyColIdx = -1;
      let tagsColIdx = -1;

      for (let i = 0; i < dataArray.length; i++) {
        const row = dataArray[i];
        // Clean all headers in this row
        const cleanRow = row.map(cell => String(cell).toLowerCase().trim());
        
        emailColIdx = cleanRow.findIndex(c => ['email', 'email id', 'email_id', 'email address', 'e-mail', 'mail'].includes(c));
        
        if (emailColIdx !== -1) {
          headerRowIndex = i;
          nameColIdx = cleanRow.findIndex(c => ['name', 'hr name', 'contact name', 'person name', 'full name', 'first name'].includes(c));
          companyColIdx = cleanRow.findIndex(c => ['company', 'organization', 'company name', 'employer', 'companyname'].includes(c));
          tagsColIdx = cleanRow.findIndex(c => ['tags', 'industry', 'domain', 'category', 'tag'].includes(c));
          break; // Found the header row!
        }
      }

      if (headerRowIndex === -1 || emailColIdx === -1) {
        setParsedRecipients([]);
        setExcelFile(file);
        return;
      }

      // Map rows to standard schema
      const mapped = [];
      for (let i = headerRowIndex + 1; i < dataArray.length; i++) {
        const row = dataArray[i];
        const email = row[emailColIdx] ? String(row[emailColIdx]).trim() : '';
        
        // Very basic email validation (contains @)
        if (email && email.includes('@')) {
          mapped.push({
            email: email,
            name: nameColIdx !== -1 && row[nameColIdx] ? String(row[nameColIdx]).trim() : '',
            company: companyColIdx !== -1 && row[companyColIdx] ? String(row[companyColIdx]).trim() : '',
            tags: tagsColIdx !== -1 && row[tagsColIdx] ? String(row[tagsColIdx]).trim() : ''
          });
        }
      }

      setParsedRecipients(mapped);
      setExcelFile(file);
    };
    reader.readAsBinaryString(file);
  };

  const submitRecipients = async () => {
    if (parsedRecipients.length === 0) return alert("No valid recipients found in Excel.");
    setUploading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/hr-campaigns/${id}/recipients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipients: parsedRecipients })
      });
      if (res.ok) {
        alert("Recipients imported successfully!");
        setParsedRecipients([]);
        setExcelFile(null);
        fetchCampaign();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to import recipients");
    } finally {
      setUploading(false);
    }
  };

  // ----------------------------------------------------
  // CV MULTI-UPLOAD LOGIC
  // ----------------------------------------------------
  const handleCvFiles = (e) => {
    setCvFiles(Array.from(e.target.files));
  };

  const submitCvs = async () => {
    if (cvFiles.length === 0) return alert("No files selected.");
    setUploading(true);
    const formData = new FormData();
    cvFiles.forEach(file => formData.append('cvs', file));

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/hr-campaigns/${id}/upload-cvs`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert("CVs uploaded successfully!");
        setCvFiles([]);
        fetchCampaign();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload CVs");
    } finally {
      setUploading(false);
    }
  };

  if (loading || !campaign) return <div className="text-center mt-5">Loading Campaign...</div>;

  const isRunning = campaign.status === 'running';

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
          <div>
            <h2 className="fw-bold mb-1" style={{ color: 'var(--color-primary)' }}>{campaign.name}</h2>
          </div>
            <span className={`badge ${isRunning ? 'bg-success' : campaign.status === 'paused' ? 'bg-warning text-dark' : campaign.status === 'completed' ? 'bg-primary' : 'bg-secondary'}`}>
              Status: {campaign.status.toUpperCase()}
            </span>
          </div>
          <div className="d-flex gap-2">
            {!isRunning && campaign.status !== 'completed' && (
              <button 
                className="btn btn-success text-white fw-bold px-4 rounded-3" 
                onClick={() => handleControl('start')}
                disabled={campaign.totalRecipients === 0}
                title={campaign.totalRecipients === 0 ? "Import recipients first!" : ""}
              >
                <i className="fa fa-play me-2"></i> Start Campaign
              </button>
            )}
            {isRunning && (
              <button className="btn btn-success text-white fw-bold px-4 rounded-3" onClick={() => handleControl('pause')}>
                <i className="fa fa-pause me-2"></i> Pause Campaign
              </button>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold mb-3">Campaign Progress</h5>
            <div className="row text-center mb-3">
              <div className="col-4 border-end">
                <h3 className="fw-bold mb-0">{campaign.totalRecipients}</h3>
                <small className="text-muted text-uppercase fw-bold">Total Enqueued</small>
              </div>
              <div className="col-4 border-end">
                <h3 className="fw-bold text-success mb-0">{campaign.sentCount}</h3>
                <small className="text-muted text-uppercase fw-bold">Successfully Sent</small>
              </div>
              <div className="col-4">
                <h3 className="fw-bold text-danger mb-0">{campaign.failedCount}</h3>
                <small className="text-muted text-uppercase fw-bold">Failed</small>
              </div>
            </div>
            {campaign.totalRecipients > 0 && (
              <div className="progress" style={{ height: '10px' }}>
                <div className="progress-bar bg-success" style={{ width: `${(campaign.sentCount / campaign.totalRecipients) * 100}%` }}></div>
                <div className="progress-bar bg-danger" style={{ width: `${(campaign.failedCount / campaign.totalRecipients) * 100}%` }}></div>
              </div>
            )}
          </div>
        </div>

        <div className="row">
          {/* Left Column: Editor & Settings */}
          <div className="col-lg-7 mb-4">
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                <h5 className="fw-bold"><i className="fa fa-edit me-2 text-primary"></i>Email Composer</h5>
              </div>
              <div className="card-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-bold">Subject Line</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={campaign.subject} 
                    onChange={(e) => handleUpdateField('subject', e.target.value)}
                    disabled={isRunning}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Email Body (HTML/Rich Text)</label>
                  <div className="alert alert-info py-2 small mb-2">
                    <i className="fa fa-info-circle me-1"></i> Available placeholders: <strong>{`{{Name}}`}</strong>, <strong>{`{{Company}}`}</strong>
                  </div>
                  <textarea 
                    className="form-control" 
                    rows="10" 
                    value={campaign.body}
                    onChange={(e) => handleUpdateField('body', e.target.value)}
                    disabled={isRunning}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 pt-4 pb-0 px-4">
                <h5 className="fw-bold"><i className="fa fa-cogs me-2 text-primary"></i>Sending Rules</h5>
              </div>
              <div className="card-body p-4">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Sender Account</label>
                    <select 
                      className="form-select" 
                      value={campaign.emailAccountId || ''}
                      onChange={(e) => handleUpdateField('emailAccountId', e.target.value)}
                      disabled={isRunning}
                    >
                      <option value="">Auto-Rotate All Active Accounts</option>
                      {accounts.filter(a => a.isActive).map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.email}</option>
                      ))}
                    </select>
                    <small className="text-muted d-block mt-1">Select specific or auto-switch when limit reached.</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Rate Limit (Emails/Min)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={campaign.rateLimitLimit}
                      onChange={(e) => handleUpdateField('rateLimitLimit', e.target.value)}
                      disabled={isRunning}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Uploads & Data */}
          <div className="col-lg-5">
            {/* Step 1: CV Uploads */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 border-start border-4 border-primary">
              <div className="card-body p-4">
                <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: '0.85rem' }}>Step 1: Upload CV Attachments</h6>
                <p className="text-muted small">Upload all PDF CVs you want to send in this campaign. All uploaded CVs will be automatically attached to every email sent to the HRs.</p>
                <div className="mb-3">
                  <input type="file" className="form-control" multiple accept=".pdf" onChange={handleCvFiles} disabled={isRunning} />
                </div>
                {cvFiles.length > 0 && (
                  <button className="btn btn-success text-white btn-sm fw-bold w-100" onClick={submitCvs} disabled={uploading}>
                    {uploading ? 'Uploading...' : `Upload ${cvFiles.length} CVs`}
                  </button>
                )}
                
                {campaign.attachments.length > 0 && (
                  <div className="mt-3">
                    <span className="badge bg-light text-dark border">
                      <i className="fa fa-file-pdf me-1 text-danger"></i> {campaign.attachments.length} CVs attached to campaign
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Excel Import */}
            <div className="card border-0 shadow-sm rounded-4 mb-4 border-start border-4 border-success">
              <div className="card-body p-4">
                <h6 className="fw-bold text-uppercase mb-3" style={{ fontSize: '0.85rem' }}>Step 2: Import HR List (Excel)</h6>
                <p className="text-muted small">Upload `.xlsx` file. Required columns: <strong>Email</strong>. Optional: Name, Company.</p>
                <div className="mb-3">
                  <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleExcelUpload} disabled={isRunning} />
                </div>
                
                {parsedRecipients.length > 0 && (
                  <div className="alert alert-success py-2 px-3 small d-flex justify-content-between align-items-center">
                    <span>Found <strong>{parsedRecipients.length}</strong> valid emails.</span>
                    <button className="btn btn-success text-white btn-sm fw-bold" onClick={submitRecipients} disabled={uploading}>
                      {uploading ? 'Importing...' : 'Import Now'}
                    </button>
                  </div>
                )}
                {excelFile && parsedRecipients.length === 0 && (
                  <div className="alert alert-danger py-2 px-3 small">
                    <i className="fa fa-exclamation-triangle me-2"></i>
                    <strong>No emails found!</strong> Please ensure your Excel file has a column header named <strong>Email</strong> in the very first row.
                  </div>
                )}
              </div>
            </div>

            {/* Preview Recipients */}
            <div className="card border-0 shadow-sm rounded-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <div className="card-header bg-white border-0 sticky-top pt-3 pb-2 px-3">
                <h6 className="fw-bold mb-0">Recipient Queue</h6>
              </div>
              <ul className="list-group list-group-flush px-2">
                {campaign.recipients.slice(0, 100).map(rec => (
                  <li key={rec.id} className="list-group-item border-0 px-2 py-2 mb-1 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{rec.hrContact.email}</div>
                      <div className="small text-muted d-flex gap-2">
                        {rec.hrContact.name && <span><i className="fa fa-user"></i> {rec.hrContact.name}</span>}
                        {rec.cvMappingId && <span className="text-primary"><i className="fa fa-paperclip"></i> {rec.cvMappingId}</span>}
                      </div>
                    </div>
                    {rec.status === 'pending' ? (
                      <span className="badge bg-secondary">Pending</span>
                    ) : rec.status === 'sent' ? (
                      <span className="badge bg-success">Sent</span>
                    ) : (
                      <span className="badge bg-danger" title={rec.error}>Failed</span>
                    )}
                  </li>
                ))}
                {campaign.recipients.length === 0 && <li className="list-group-item text-muted text-center py-4 border-0">No recipients added yet.</li>}
                {campaign.recipients.length > 100 && <li className="list-group-item text-center small border-0 text-muted">...and {campaign.recipients.length - 100} more</li>}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminHRCampaignDetail;
