import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../config';

const emptyPortfolio = { headline: '', bio: '', skills: [], education: [], projects: [], experience: [], achievements: [], profileImageUrl: '', bgImageUrl: '', linkedinUrl: '', naukriUrl: '' };

const StudentPortfolioEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);
  const [portfolio, setPortfolio] = useState(emptyPortfolio);
  const [skillInput, setSkillInput] = useState('');
  const [imageUploading, setImageUploading] = useState({});
  const [imageError, setImageError] = useState(null);

  const [accountForm, setAccountForm] = useState({ fullName: '', email: '', phone: '', currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountError, setAccountError] = useState(null);
  const [accountSaved, setAccountSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent('/student/portfolio')}`);
      return;
    }
    fetch(`${BASE_URL}/api/student/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const user = data.profile?.user || null;
        setStudentInfo(user);
        setAccountForm(prev => ({ ...prev, fullName: user?.fullName || '', email: user?.email || '', phone: user?.phone || '' }));
        setPortfolio({ ...emptyPortfolio, ...(data.profile?.portfolio || {}) });
      })
      .catch(() => setError('Failed to load your portfolio.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const submitAccountUpdate = async (e) => {
    e.preventDefault();
    setAccountError(null);
    setAccountSaved(false);

    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmNewPassword) {
      setAccountError('New password and confirmation do not match.');
      return;
    }

    setAccountSaving(true);
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${BASE_URL}/api/student/account`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          fullName: accountForm.fullName,
          email: accountForm.email,
          phone: accountForm.phone,
          currentPassword: accountForm.currentPassword || undefined,
          newPassword: accountForm.newPassword || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update your details.');

      setStudentInfo(prev => ({ ...prev, ...data.user }));
      setAccountForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
      setAccountSaved(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setAccountError(err.message);
    } finally {
      setAccountSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${BASE_URL}/api/student/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ portfolio })
      });
      if (!res.ok) throw new Error('Failed to save portfolio.');
      setSaved(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (key, file) => {
    if (!file) return;
    setImageError(null);
    setImageUploading(prev => ({ ...prev, [key]: true }));
    try {
      const token = localStorage.getItem('userToken');
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${BASE_URL}/api/student/portfolio/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      const updatedPortfolio = { ...portfolio, [key]: data.url };
      setPortfolio(updatedPortfolio);
      // Persist right away so the image survives even if they leave before hitting Save.
      await fetch(`${BASE_URL}/api/student/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ portfolio: updatedPortfolio })
      });
    } catch (err) {
      setImageError(err.message);
    } finally {
      setImageUploading(prev => ({ ...prev, [key]: false }));
    }
  };
  const removeImage = (key) => {
    const updatedPortfolio = { ...portfolio, [key]: '' };
    setPortfolio(updatedPortfolio);
    const token = localStorage.getItem('userToken');
    fetch(`${BASE_URL}/api/student/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ portfolio: updatedPortfolio })
    }).catch(() => {});
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || portfolio.skills.includes(value)) return;
    setPortfolio(prev => ({ ...prev, skills: [...prev.skills, value] }));
    setSkillInput('');
  };
  const removeSkill = (skill) => setPortfolio(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

  const addRow = (key, emptyRow) => setPortfolio(prev => ({ ...prev, [key]: [...prev[key], emptyRow] }));
  const updateRow = (key, idx, field, value) => setPortfolio(prev => ({
    ...prev,
    [key]: prev[key].map((row, i) => i === idx ? { ...row, [field]: value } : row)
  }));
  const removeRow = (key, idx) => setPortfolio(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));

  const addAchievement = () => setPortfolio(prev => ({ ...prev, achievements: [...prev.achievements, ''] }));
  const updateAchievement = (idx, value) => setPortfolio(prev => ({
    ...prev, achievements: prev.achievements.map((a, i) => i === idx ? value : a)
  }));
  const removeAchievement = (idx) => setPortfolio(prev => ({ ...prev, achievements: prev.achievements.filter((_, i) => i !== idx) }));

  const publicUrl = studentInfo?.studentId ? `${window.location.origin}/student-portfolio/${studentInfo.studentId}` : '';

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  if (loading) {
    return <div className="pf-screen d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}><div className="spinner-border text-primary"></div></div>;
  }

  return (
    <div className="pf-screen">
      <Helmet>
        <title>My Portfolio | Clinidea Education</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <style>{`
        .pf-screen { min-height: 100vh; width: 100%; background: var(--color-bg-light); padding-top: 116px; }
        .pf-topbar { width: 100%; background: #0F172A; border-bottom: 3px solid #06B6D4; padding: 1.5rem clamp(1.25rem, 5vw, 4rem) 2rem; color: #fff; }
        .pf-topbar-inner { max-width: 1100px; margin: 0 auto; }
        .pf-topbar h1 { font-weight: 800; font-size: clamp(1.4rem, 2.4vw, 1.9rem); margin-bottom: 4px; color: #fff !important; }
        .pf-topbar p { opacity: 0.88; margin-bottom: 0; }
        .pf-id-card { margin-top: 1.5rem; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); border-radius: 14px; padding: 1rem 1.25rem; display: flex; flex-wrap: wrap; align-items: center; gap: 1.25rem; backdrop-filter: blur(6px); }
        .pf-id-card .label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.75; margin-bottom: 2px; }
        .pf-id-card .value { font-weight: 700; font-size: 1.05rem; }
        .pf-link-value { max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #fff; text-decoration: underline; }
        .pf-copy-btn { background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.35); color: #fff; border-radius: 10px; padding: 0.5rem 1rem; font-weight: 700; font-size: 0.85rem; white-space: nowrap; }
        .pf-copy-btn:hover { background: rgba(255,255,255,0.28); }
        .pf-topbar-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
        .pf-logout-btn { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.4); color: #fff; border-radius: 10px; padding: 0.55rem 1.1rem; font-weight: 700; font-size: 0.85rem; white-space: nowrap; transition: var(--transition-smooth); }
        .pf-logout-btn:hover { background: rgba(255,255,255,0.24); color: #fff; }
        .pf-preview-btn { background: #fff; color: var(--color-secondary); border: none; border-radius: 10px; padding: 0.5rem 1.1rem; font-weight: 700; font-size: 0.85rem; white-space: nowrap; }
        .pf-preview-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }

        .pf-body { max-width: 1100px; margin: 0 auto; padding: 2rem clamp(1.25rem, 5vw, 4rem) 5rem; }
        .pf-card { background: #fff; border: 1px solid var(--color-border); border-radius: 18px; box-shadow: var(--box-shadow-premium); padding: clamp(1.4rem, 3vw, 2.2rem); margin-bottom: 1.75rem; }
        .pf-card-title { display: flex; align-items: center; gap: 10px; font-weight: 800; color: var(--color-primary); font-size: 1.05rem; margin: 0 0 1.25rem; padding-bottom: 0.65rem; border-bottom: 2px solid var(--color-gray-light); }
        .pf-card-title i { color: var(--color-secondary); }

        .pf-input, .pf-textarea { width: 100%; padding: 0.7rem 1rem; background: var(--color-bg-light); border: 1.5px solid var(--color-border); border-radius: 10px; font-size: 0.95rem; color: var(--color-text-dark); transition: var(--transition-smooth); }
        .pf-input:focus, .pf-textarea:focus { outline: none; border-color: var(--color-secondary); background: #fff; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.12); }
        .pf-label { font-weight: 600; font-size: 0.85rem; color: var(--color-text-dark); margin-bottom: 0.4rem; display: block; }

        .pf-skill-chip { display: inline-flex; align-items: center; gap: 8px; background: rgba(79, 70, 229, 0.08); color: var(--color-secondary); border: 1.5px solid rgba(79, 70, 229, 0.2); border-radius: 999px; padding: 0.4rem 0.9rem; font-weight: 600; font-size: 0.85rem; }
        .pf-skill-chip i { cursor: pointer; opacity: 0.6; }
        .pf-skill-chip i:hover { opacity: 1; }

        .pf-entry { background: var(--color-bg-light); border: 1.5px solid var(--color-border); border-radius: 14px; padding: 1.1rem 1.25rem; margin-bottom: 1rem; position: relative; }
        .pf-entry-remove { position: absolute; top: 10px; right: 10px; background: none; border: none; color: #c0392b; opacity: 0.6; }
        .pf-entry-remove:hover { opacity: 1; }
        .pf-add-btn { background: rgba(79, 70, 229, 0.08); color: var(--color-secondary); border: 1.5px dashed rgba(79, 70, 229, 0.35); border-radius: 10px; padding: 0.6rem 1.2rem; font-weight: 700; font-size: 0.9rem; width: 100%; }
        .pf-add-btn:hover { background: rgba(79, 70, 229, 0.14); }

        .pf-save-bar { position: sticky; bottom: 0; background: linear-gradient(180deg, rgba(248,250,252,0), var(--color-bg-light) 30%); padding: 1.5rem 0 0.5rem; }
        .pf-save-btn { width: 100%; padding: 1rem; border: none; border-radius: 10px; font-weight: 700; font-size: 1.05rem; color: #fff; background: #0F172A; box-shadow: 0 12px 28px -8px rgba(15, 23, 42, 0.45); transition: var(--transition-smooth); }
        .pf-save-btn:hover:not(:disabled) { background: #06B6D4; transform: translateY(-2px); box-shadow: 0 16px 32px -8px rgba(6, 182, 212, 0.4); }
        .pf-save-btn:disabled { opacity: 0.7; }

        @media (max-width: 991px) { .pf-screen { padding-top: 70px; } }

        .pf-image-row { display: flex; flex-wrap: wrap; gap: 1.5rem; }
        .pf-image-box { flex: 1 1 260px; }
        .pf-image-box-label { font-weight: 700; font-size: 0.9rem; color: var(--color-text-dark); margin-bottom: 0.6rem; display: block; }
        .pf-avatar-preview { width: 110px; height: 110px; border-radius: 50%; object-fit: cover; border: 3px solid var(--color-border); background: var(--color-bg-light); display: block; }
        .pf-avatar-placeholder { width: 110px; height: 110px; border-radius: 50%; background: var(--color-bg-light); border: 2px dashed var(--color-border); display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); font-size: 1.6rem; }
        .pf-bg-preview { width: 100%; height: 130px; border-radius: 12px; object-fit: cover; border: 1.5px solid var(--color-border); background: var(--color-bg-light); display: block; }
        .pf-bg-placeholder { width: 100%; height: 130px; border-radius: 12px; background: var(--color-bg-light); border: 2px dashed var(--color-border); display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); font-size: 1.6rem; }
        .pf-image-actions { display: flex; gap: 0.6rem; margin-top: 0.75rem; align-items: center; }
        .pf-upload-btn { background: rgba(79, 70, 229, 0.08); color: var(--color-secondary); border: 1.5px solid rgba(79, 70, 229, 0.25); border-radius: 8px; padding: 0.45rem 1rem; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: inline-block; }
        .pf-upload-btn:hover { background: rgba(79, 70, 229, 0.14); }
        .pf-upload-btn input { display: none; }
        .pf-remove-img-btn { background: none; border: none; color: #c0392b; font-weight: 700; font-size: 0.82rem; opacity: 0.75; }
        .pf-remove-img-btn:hover { opacity: 1; }

        .pf-input-icon-group { position: relative; display: flex; align-items: center; }
        .pf-input-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 26px; height: 26px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 800; color: #fff; z-index: 1; }
        .pf-input-icon-linkedin { background: #0a66c2; }
        .pf-input-icon-naukri { background: #4a5cc5; font-size: 0.9rem; }
        .pf-input-with-icon { padding-left: 46px; }
      `}</style>

      <div className="pf-topbar">
        <div className="pf-topbar-inner">
          <div className="pf-topbar-head">
            <div>
              <h1>My Student Portfolio</h1>
              <p>Build your public profile — like a resume — that anyone can view and share.</p>
            </div>
            <button type="button" className="pf-logout-btn" onClick={handleLogout}>
              <i className="fa fa-sign-out-alt me-2"></i>Logout
            </button>
          </div>

          {studentInfo?.studentId && (
            <div className="pf-id-card">
              <div>
                <div className="label">Student ID</div>
                <div className="value">{studentInfo.studentId}</div>
              </div>
              <div className="flex-grow-1">
                <div className="label">Public Link</div>
                <a href={publicUrl} target="_blank" rel="noreferrer" className="pf-link-value d-inline-block">{publicUrl}</a>
              </div>
              <button type="button" className="pf-copy-btn" onClick={() => navigator.clipboard?.writeText(publicUrl)}>
                <i className="fa fa-copy me-1"></i>Copy
              </button>
              <a href={publicUrl} target="_blank" rel="noreferrer" className="pf-preview-btn">
                <i className="fa fa-eye me-1"></i>Preview
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="pf-body">
        {error && <div className="alert alert-danger fw-bold rounded-3">{error}</div>}
        {saved && <div className="alert alert-success fw-bold rounded-3"><i className="fa fa-check-circle me-2"></i>Portfolio saved successfully.</div>}
        {imageError && <div className="alert alert-danger fw-bold rounded-3">{imageError}</div>}

        <div className="pf-card">
          <h5 className="pf-card-title"><i className="fa fa-user-circle"></i>My Details</h5>
          {accountSaved && <div className="alert alert-success py-2 small fw-bold rounded-3"><i className="fa fa-check-circle me-2"></i>Your details were updated.</div>}
          {accountError && <div className="alert alert-danger py-2 small fw-bold rounded-3">{accountError}</div>}
          <form onSubmit={submitAccountUpdate}>
            <div className="row g-3 mb-2">
              <div className="col-md-6">
                <label className="pf-label">Full Name</label>
                <input type="text" className="pf-input" value={accountForm.fullName} onChange={e => setAccountForm(prev => ({ ...prev, fullName: e.target.value }))} required />
              </div>
              <div className="col-md-6">
                <label className="pf-label">Phone</label>
                <input type="text" className="pf-input" value={accountForm.phone} onChange={e => setAccountForm(prev => ({ ...prev, phone: e.target.value }))} />
              </div>
            </div>
            <div className="mb-3">
              <label className="pf-label">Email (used to log in)</label>
              <input type="email" className="pf-input" value={accountForm.email} onChange={e => setAccountForm(prev => ({ ...prev, email: e.target.value }))} required />
            </div>

            <hr />
            <p className="pf-label mb-2" style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.04em' }}>Change Password <span className="text-muted" style={{ textTransform: 'none' }}>(optional)</span></p>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="pf-label">Current Password</label>
                <input type="password" className="pf-input" value={accountForm.currentPassword} onChange={e => setAccountForm(prev => ({ ...prev, currentPassword: e.target.value }))} placeholder="Required to set a new password" />
              </div>
              <div className="col-md-4">
                <label className="pf-label">New Password</label>
                <input type="password" className="pf-input" minLength={6} value={accountForm.newPassword} onChange={e => setAccountForm(prev => ({ ...prev, newPassword: e.target.value }))} placeholder="Min 6 characters" />
              </div>
              <div className="col-md-4">
                <label className="pf-label">Confirm New Password</label>
                <input type="password" className="pf-input" minLength={6} value={accountForm.confirmNewPassword} onChange={e => setAccountForm(prev => ({ ...prev, confirmNewPassword: e.target.value }))} />
              </div>
            </div>

            <button type="submit" className="pf-add-btn mt-3" style={{ borderStyle: 'solid' }} disabled={accountSaving}>
              {accountSaving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="fa fa-check me-1"></i>Save My Details</>}
            </button>
          </form>
        </div>

        <div className="pf-card">
          <h5 className="pf-card-title"><i className="fa fa-image"></i>Profile &amp; Background Images</h5>
          <div className="pf-image-row">
            <div className="pf-image-box">
              <label className="pf-image-box-label">Profile Photo</label>
              {portfolio.profileImageUrl
                ? <img src={portfolio.profileImageUrl} alt="Profile" className="pf-avatar-preview" />
                : <div className="pf-avatar-placeholder"><i className="fa fa-user"></i></div>}
              <div className="pf-image-actions">
                <label className="pf-upload-btn">
                  {imageUploading.profileImageUrl ? 'Uploading...' : <><i className="fa fa-upload me-1"></i>{portfolio.profileImageUrl ? 'Change' : 'Upload'}</>}
                  <input type="file" accept="image/*" disabled={imageUploading.profileImageUrl} onChange={e => handleImageUpload('profileImageUrl', e.target.files[0])} />
                </label>
                {portfolio.profileImageUrl && (
                  <button type="button" className="pf-remove-img-btn" onClick={() => removeImage('profileImageUrl')}>Remove</button>
                )}
              </div>
            </div>

            <div className="pf-image-box" style={{ flex: '2 1 340px' }}>
              <label className="pf-image-box-label">Background / Cover Image</label>
              {portfolio.bgImageUrl
                ? <img src={portfolio.bgImageUrl} alt="Background" className="pf-bg-preview" />
                : <div className="pf-bg-placeholder"><i className="fa fa-image"></i></div>}
              <div className="pf-image-actions">
                <label className="pf-upload-btn">
                  {imageUploading.bgImageUrl ? 'Uploading...' : <><i className="fa fa-upload me-1"></i>{portfolio.bgImageUrl ? 'Change' : 'Upload'}</>}
                  <input type="file" accept="image/*" disabled={imageUploading.bgImageUrl} onChange={e => handleImageUpload('bgImageUrl', e.target.files[0])} />
                </label>
                {portfolio.bgImageUrl && (
                  <button type="button" className="pf-remove-img-btn" onClick={() => removeImage('bgImageUrl')}>Remove</button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pf-card">
          <h5 className="pf-card-title"><i className="fa fa-link"></i>Social Links</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="pf-label">LinkedIn Profile URL</label>
              <div className="pf-input-icon-group">
                <span className="pf-input-icon pf-input-icon-linkedin"><i className="fab fa-linkedin-in"></i></span>
                <input
                  type="url"
                  className="pf-input pf-input-with-icon"
                  placeholder="https://linkedin.com/in/your-name"
                  value={portfolio.linkedinUrl}
                  onChange={e => setPortfolio(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                />
              </div>
            </div>
            <div className="col-md-6">
              <label className="pf-label">Naukri.com Profile URL</label>
              <div className="pf-input-icon-group">
                <span className="pf-input-icon pf-input-icon-naukri">N</span>
                <input
                  type="url"
                  className="pf-input pf-input-with-icon"
                  placeholder="https://www.naukri.com/mnjuser/profile"
                  value={portfolio.naukriUrl}
                  onChange={e => setPortfolio(prev => ({ ...prev, naukriUrl: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pf-card">
          <h5 className="pf-card-title"><i className="fa fa-id-badge"></i>Headline &amp; Bio</h5>
          <div className="mb-3">
            <label className="pf-label">Headline</label>
            <input type="text" className="pf-input" placeholder="e.g. Aspiring Clinical Research Associate" value={portfolio.headline} onChange={e => setPortfolio(prev => ({ ...prev, headline: e.target.value }))} />
          </div>
          <div>
            <label className="pf-label">Bio</label>
            <textarea className="pf-textarea" rows="4" placeholder="A short introduction about yourself..." value={portfolio.bio} onChange={e => setPortfolio(prev => ({ ...prev, bio: e.target.value }))}></textarea>
          </div>
        </div>

        <div className="pf-card">
          <h5 className="pf-card-title"><i className="fa fa-star"></i>Skills</h5>
          <div className="d-flex gap-2 mb-3">
            <input type="text" className="pf-input" placeholder="Add a skill and press Enter" value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
            />
            <button type="button" className="pf-preview-btn" style={{ color: 'var(--color-secondary)', background: 'rgba(79,70,229,0.08)', flexShrink: 0 }} onClick={addSkill}>Add</button>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {portfolio.skills.map(skill => (
              <span key={skill} className="pf-skill-chip">
                {skill}
                <i className="fa fa-times" onClick={() => removeSkill(skill)}></i>
              </span>
            ))}
            {portfolio.skills.length === 0 && <span className="text-muted small">No skills added yet.</span>}
          </div>
        </div>

        <div className="pf-card">
          <h5 className="pf-card-title"><i className="fa fa-graduation-cap"></i>Education</h5>
          {portfolio.education.map((row, idx) => (
            <div className="pf-entry" key={idx}>
              <button type="button" className="pf-entry-remove" onClick={() => removeRow('education', idx)}><i className="fa fa-trash"></i></button>
              <div className="row g-3">
                <div className="col-md-3"><label className="pf-label">Degree</label><input className="pf-input" value={row.degree || ''} onChange={e => updateRow('education', idx, 'degree', e.target.value)} /></div>
                <div className="col-md-4"><label className="pf-label">Institution</label><input className="pf-input" value={row.institution || ''} onChange={e => updateRow('education', idx, 'institution', e.target.value)} /></div>
                <div className="col-md-2"><label className="pf-label">Year</label><input className="pf-input" value={row.year || ''} onChange={e => updateRow('education', idx, 'year', e.target.value)} /></div>
                <div className="col-md-3"><label className="pf-label">Grade</label><input className="pf-input" value={row.grade || ''} onChange={e => updateRow('education', idx, 'grade', e.target.value)} /></div>
              </div>
            </div>
          ))}
          <button type="button" className="pf-add-btn" onClick={() => addRow('education', { degree: '', institution: '', year: '', grade: '' })}>
            <i className="fa fa-plus me-1"></i>Add Education
          </button>
        </div>

        <div className="pf-card">
          <h5 className="pf-card-title"><i className="fa fa-diagram-project"></i>Projects</h5>
          {portfolio.projects.map((row, idx) => (
            <div className="pf-entry" key={idx}>
              <button type="button" className="pf-entry-remove" onClick={() => removeRow('projects', idx)}><i className="fa fa-trash"></i></button>
              <div className="row g-3">
                <div className="col-md-4"><label className="pf-label">Title</label><input className="pf-input" value={row.title || ''} onChange={e => updateRow('projects', idx, 'title', e.target.value)} /></div>
                <div className="col-md-5"><label className="pf-label">Description</label><input className="pf-input" value={row.description || ''} onChange={e => updateRow('projects', idx, 'description', e.target.value)} /></div>
                <div className="col-md-3"><label className="pf-label">Link (optional)</label><input className="pf-input" value={row.link || ''} onChange={e => updateRow('projects', idx, 'link', e.target.value)} /></div>
              </div>
            </div>
          ))}
          <button type="button" className="pf-add-btn" onClick={() => addRow('projects', { title: '', description: '', link: '' })}>
            <i className="fa fa-plus me-1"></i>Add Project
          </button>
        </div>

        <div className="pf-card">
          <h5 className="pf-card-title"><i className="fa fa-briefcase"></i>Experience</h5>
          {portfolio.experience.map((row, idx) => (
            <div className="pf-entry" key={idx}>
              <button type="button" className="pf-entry-remove" onClick={() => removeRow('experience', idx)}><i className="fa fa-trash"></i></button>
              <div className="row g-3">
                <div className="col-md-3"><label className="pf-label">Company</label><input className="pf-input" value={row.company || ''} onChange={e => updateRow('experience', idx, 'company', e.target.value)} /></div>
                <div className="col-md-3"><label className="pf-label">Role</label><input className="pf-input" value={row.role || ''} onChange={e => updateRow('experience', idx, 'role', e.target.value)} /></div>
                <div className="col-md-2"><label className="pf-label">Duration</label><input className="pf-input" value={row.duration || ''} onChange={e => updateRow('experience', idx, 'duration', e.target.value)} /></div>
                <div className="col-md-4"><label className="pf-label">Description</label><input className="pf-input" value={row.description || ''} onChange={e => updateRow('experience', idx, 'description', e.target.value)} /></div>
              </div>
            </div>
          ))}
          <button type="button" className="pf-add-btn" onClick={() => addRow('experience', { company: '', role: '', duration: '', description: '' })}>
            <i className="fa fa-plus me-1"></i>Add Experience
          </button>
        </div>

        <div className="pf-card">
          <h5 className="pf-card-title"><i className="fa fa-trophy"></i>Achievements</h5>
          {portfolio.achievements.map((text, idx) => (
            <div className="pf-entry d-flex align-items-center gap-2" key={idx} style={{ paddingRight: '3rem' }}>
              <input className="pf-input" placeholder="Achievement" value={text} onChange={e => updateAchievement(idx, e.target.value)} />
              <button type="button" className="pf-entry-remove" style={{ position: 'static' }} onClick={() => removeAchievement(idx)}><i className="fa fa-trash"></i></button>
            </div>
          ))}
          <button type="button" className="pf-add-btn" onClick={addAchievement}>
            <i className="fa fa-plus me-1"></i>Add Achievement
          </button>
        </div>

        <div className="pf-save-bar">
          <button type="button" className="pf-save-btn" disabled={saving} onClick={handleSave}>
            {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <>Save Portfolio <i className="fa fa-check ms-2"></i></>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPortfolioEdit;
