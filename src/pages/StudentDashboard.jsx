import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from '../config';
import StudentAssignments from '../components/student/StudentAssignments';
import StudentExams from '../components/student/StudentExams';
import StudentPayments from '../components/student/StudentPayments';
import StudentAITutor from '../components/student/StudentAITutor';
import '../admin.css';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Data States
  const [userContext, setUserContext] = useState({ fullName: '', email: '', phone: '' });
  const [profile, setProfile] = useState({
    dateOfBirth: '', gender: '', address: '', city: '', state: '', pincode: '',
    qualification: '', collegeName: '', graduationYear: ''
  });
  
  const [documents, setDocuments] = useState([]);
  const [scheduleData, setScheduleData] = useState({ classes: [], courseName: null, batchName: null });
  const [certificates, setCertificates] = useState([]);
  const [payments, setPayments] = useState([]);
  
  // Live Sessions & Notifications
  const [liveSessions, setLiveSessions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // LMS Content
  const [contents, setContents] = useState([]);
  const [enrolledBatches, setEnrolledBatches] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);

  // File Upload State
  const [uploadType, setUploadType] = useState('photo');
  const [selectedFile, setSelectedFile] = useState(null);

  // Advanced Academic Data
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [pendingAbsence, setPendingAbsence] = useState(null);
  const [absenceReasonText, setAbsenceReasonText] = useState('');

  // Fee Blocking State
  const [isFeeBlocked, setIsFeeBlocked] = useState(false);
  const [feeBlockMessage, setFeeBlockMessage] = useState('');

  // UI State
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'lms', 'live', 'vault'
  const [activeLMSCategory, setActiveLMSCategory] = useState('Recordings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLmsOpen, setIsLmsOpen] = useState(false);

  const fetchDashboardData = React.useCallback(async () => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // 1. Fetch Profile
      const profileUrl = `${BASE_URL}/api/student/profile`;
      const pRes = await fetch(profileUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      const pData = await pRes.json();
      
      if (pRes.ok && pData.profile) {
        if(pData.profile.user) setUserContext(pData.profile.user);
        const mappedProfile = { ...pData.profile };
        if (mappedProfile.dateOfBirth) mappedProfile.dateOfBirth = mappedProfile.dateOfBirth.split('T')[0];
        setProfile(mappedProfile);
      }

      // 2. Fetch Docs
      const docUrl = `${BASE_URL}/api/student/documents`;
      const dRes = await fetch(docUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      const dData = await dRes.json();
      if (dRes.ok) setDocuments(dData.documents || []);
      
      // 3. Fetch Schedule
      const schedUrl = `${BASE_URL}/api/student/classes`;
      const sRes = await fetch(schedUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (sRes.ok) setScheduleData(await sRes.json());

      // 4. Fetch Certificates
      const certUrl = `${BASE_URL}/api/student/certificates`;
      const cRes = await fetch(certUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (cRes.ok) setCertificates((await cRes.json()).certificates || []);
      
      // 5. Fetch Payments
      const paymentUrl = `${BASE_URL}/api/student/payments`;
      const payRes = await fetch(paymentUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (payRes.ok) setPayments((await payRes.json()).payments || []);

      // 5.5 Fetch Pending Enrollments
      const pendingUrl = `${BASE_URL}/api/student/pending-enrollments`;
      const pendRes = await fetch(pendingUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      if (pendRes.ok) setPendingEnrollments((await pendRes.json()).enrollments || []);

      // 6. Fetch LMS Content
      const lmsRes = await fetch(`${BASE_URL}/api/student/content`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (lmsRes.status === 403) {
        const lmsError = await lmsRes.json();
        if (lmsError.isFeeBlock) {
          setIsFeeBlocked(true);
          setFeeBlockMessage(lmsError.error);
        }
      }
      if (lmsRes.ok) {
        const lmsData = await lmsRes.json();
        if (lmsData && Array.isArray(lmsData.contents)) {
          setContents(lmsData.contents);
          setEnrolledBatches(lmsData.enrolledBatches || []);
        } else if (Array.isArray(lmsData)) {
          setContents(lmsData);
        }
      }

      // 7. Fetch Live Sessions
      const liveRes = await fetch(`${BASE_URL}/api/student/live-sessions`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (liveRes.ok) setLiveSessions(await liveRes.json());

      // 8. Fetch Pending Absences
      const absRes = await fetch(`${BASE_URL}/api/student/pending-absences`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (absRes.ok) {
        const absData = await absRes.json();
        if (absData.absences && absData.absences.length > 0) {
          setPendingAbsence(absData.absences[0]); // Show popup for the first pending absence
        }
      }

      // 9. Fetch Assignments
      const assignRes = await fetch(`${BASE_URL}/api/student/assignments`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (assignRes.ok) setAssignments((await assignRes.json()).assignments || []);

      // 10. Fetch Exams
      const examsRes = await fetch(`${BASE_URL}/api/student/exams`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (examsRes.ok) setExams((await examsRes.json()).exams || []);

      setLoading(false);
    } catch (_err) {
      localStorage.removeItem('userToken');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Notifications Polling
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/api/student/notifications`, { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) setNotifications(await res.json());
      } catch (e) {}
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // 1 minute
    return () => clearInterval(interval);
  }, []);

  const handleMarkNotificationsRead = async () => {
    const token = localStorage.getItem('userToken');
    try {
      await fetch(`${BASE_URL}/api/student/notifications/read`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
      setNotifications([]);
      setShowNotifications(false);
    } catch (e) {}
  };

  const handlePayPending = async (enrollment) => {
    try {
      const token = localStorage.getItem('userToken');
      const orderRes = await fetch(`${BASE_URL}/api/student/pay-pending-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ enrollmentId: enrollment.id })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const options = {
        key: 'dummy_key', // This is handled in backend but required by Razorpay frontend script in some versions, or it uses the global script
        amount: orderData.amount,
        currency: "INR",
        name: "Clinidea Education",
        description: `Pending Fee Payment - ${enrollment.courseName}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${BASE_URL}/api/student/verify-pending-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                enrollmentId: enrollment.id
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error);
            alert("Payment Successful!");
            fetchDashboardData();
          } catch (err) {
            alert(err.message);
          }
        },
        prefill: {
          name: userContext.fullName,
          email: userContext.email,
          contact: userContext.phone
        },
        theme: { color: "#4f46e5" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
      });
      rzp1.open();
    } catch (err) {
      alert("Failed to initiate payment: " + err.message);
    }
  };

  const handleProfileChange = (e) => setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    const token = localStorage.getItem('userToken');
    
    try {
      const res = await fetch(`${BASE_URL}/api/student/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setMessage({ text: 'Profile successfully updated.', type: 'success' });
      } else {
         const data = await res.json();
         setMessage({ text: data.error || 'Failed to save profile.', type: 'danger' });
      }
    } catch (_err) {
      setMessage({ text: 'Network connection dropped.', type: 'danger' });
    }
    setSaving(false);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ text: 'Please select a file to upload.', type: 'warning' });
      return;
    }
    setUploading(true);
    setMessage({ text: '', type: '' });
    const token = localStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('document_type', uploadType);
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${BASE_URL}/api/student/upload-document`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ text: 'Document securely vaulted.', type: 'success' });
        setSelectedFile(null);
        fetchDashboardData();
      } else {
        setMessage({ text: data.error || 'Upload rejected by security validation.', type: 'danger' });
      }
    } catch (_err) {
      setMessage({ text: 'Upload failed.', type: 'danger' });
    }
    setUploading(false);
  };

  const handleAbsenceSubmit = async (e) => {
    e.preventDefault();
    if (!absenceReasonText.trim()) return showMessage('Reason is required', 'warning');
    
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${BASE_URL}/api/student/submit-absence-reason`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ attendanceId: pendingAbsence.id, reason: absenceReasonText })
      });
      if (res.ok) {
        showMessage('Reason submitted successfully', 'success');
        setPendingAbsence(null);
        setAbsenceReasonText('');
      } else {
        showMessage('Failed to submit reason', 'danger');
      }
    } catch (error) {
      showMessage('Error submitting reason', 'danger');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const categorizedContent = {
    'Recorded sessions': [],
    'Presentations and files': [],
    'Additional study material': [],
    'Question Bank': []
  };

  contents.forEach(curr => {
    let cat = curr.category;
    if (cat === 'Recorded sessions' || cat === 'Recordings' || curr.contentType === 'video') {
      cat = 'Recorded sessions';
    } else if (cat === 'Presentations and files' || cat === 'Presentations' || curr.contentType === 'ppt') {
      cat = 'Presentations and files';
    } else if (cat === 'Question Bank') {
      cat = 'Question Bank';
    } else {
      cat = 'Additional study material'; // Default for PDFs, Docs, etc.
    }

    if (categorizedContent[cat]) {
      categorizedContent[cat].push(curr);
    }
  });

  const getCategoryIcon = (category) => {
    if (category === 'Recordings') return 'fa-play-circle text-danger';
    if (category === 'Study Material') return 'fa-book text-info';
    return 'fa-question-circle text-primary';
  };

  const getIcon = (type) => {
    switch(type) {
      case 'video': return 'fa-video text-danger';
      case 'pdf': return 'fa-file-pdf text-danger';
      case 'ppt': return 'fa-file-powerpoint text-warning';
      default: return 'fa-file-alt text-info';
    }
  };



  const calculateProgress = () => {
    let completed = 0;
    const total = 11;
    if (profile.dateOfBirth) completed++;
    if (profile.gender) completed++;
    if (profile.address) completed++;
    if (profile.city) completed++;
    if (profile.state) completed++;
    if (profile.pincode) completed++;
    if (profile.qualification) completed++;
    if (profile.collegeName) completed++;
    if (profile.graduationYear) completed++;
    if (documents.some(d => d.documentType === 'photo')) completed++;
    if (documents.some(d => d.documentType === 'id_proof')) completed++;
    return Math.round((completed / total) * 100);
  };

  if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-primary"></div></div>;

  const completionPercentage = calculateProgress();
  const currentItems = categorizedContent[activeLMSCategory] || [];

  return (
    <div className="d-flex" style={{ minHeight: 'calc(100vh - 60px)', marginTop: '60px', backgroundColor: 'var(--color-bg-light)', color: 'var(--color-text-dark)', fontFamily: 'var(--font-sans)', position: 'relative' }}>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="d-md-none position-fixed w-100 h-100" 
          style={{ top: '60px', left: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1030 }}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      {/* Sidebar Navigation */}
      <div 
        className={`shadow-sm d-flex flex-column transition-all student-sidebar ${isSidebarOpen ? 'open' : ''}`}
        style={{ 
          background: '#0f172a', 
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.06)',
          color: '#94a3b8' 
        }}
      >
        <div className="p-4 d-flex justify-content-between align-items-center d-md-none border-bottom" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
           <h5 className="heading-premium mb-0 text-white animate__animated animate__fadeIn">Menu</h5>
           <button className="btn text-white-50 p-0" onClick={() => setIsSidebarOpen(false)}><i className="fa fa-times fs-4"></i></button>
        </div>

        {/* Logo Area */}
        <div className="p-4 d-flex align-items-center gap-3 border-bottom d-none d-md-flex" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="bg-white rounded-3 p-1 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px' }}>
            <img src="/clinidea-removebg-preview.webp" alt="Clinidea Logo" className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://clinidea.in/favicon.png'; }} />
          </div>
          <div>
            <h4 className="mb-0 fw-bold text-white fs-5" style={{ letterSpacing: '-0.3px' }}>Clinidea</h4>
            <span className="badge text-white fw-semibold px-2 py-0" style={{ fontSize: '11px', background: 'rgba(79, 70, 229, 0.3)' }}>Student Portal</span>
          </div>
        </div>
        
        <div className="p-3 flex-grow-1 overflow-auto custom-scrollbar">
          <p className="text-white-50 small fw-bold text-uppercase px-3 mb-2 mt-2" style={{ letterSpacing: '0.8px', fontSize: '11px', opacity: 0.6 }}>Navigation</p>
          <div className="d-flex flex-column gap-1 pb-4">
            
            {/* 1. Dashboard */}
            <button 
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
              className="btn w-100 text-start py-3 px-3 rounded-4 d-flex align-items-center border-0" 
              style={{ 
                transition: 'all 0.25s', 
                background: activeTab === 'dashboard' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                color: activeTab === 'dashboard' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'dashboard' ? '600' : '500',
                boxShadow: activeTab === 'dashboard' ? '0 4px 15px rgba(79, 70, 229, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => { if (activeTab !== 'dashboard') { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#ffffff'; } }}
              onMouseLeave={(e) => { if (activeTab !== 'dashboard') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              <i className="fa fa-chart-pie me-3 fs-5" style={{ width: '24px', color: activeTab === 'dashboard' ? '#ffffff' : '#64748b' }}></i>
              <span>Dashboard</span>
            </button>

            {/* 2. Live Session */}
            <button 
              onClick={() => { setActiveTab('live'); setIsSidebarOpen(false); }} 
              className="btn w-100 text-start py-3 px-3 rounded-4 d-flex align-items-center border-0" 
              style={{ 
                transition: 'all 0.25s', 
                background: activeTab === 'live' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                color: activeTab === 'live' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'live' ? '600' : '500',
                boxShadow: activeTab === 'live' ? '0 4px 15px rgba(79, 70, 229, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => { if (activeTab !== 'live') { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#ffffff'; } }}
              onMouseLeave={(e) => { if (activeTab !== 'live') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              <i className="fa fa-video me-3 fs-5" style={{ width: '24px', color: activeTab === 'live' ? '#ffffff' : '#64748b' }}></i>
              <span>Live Session</span>
            </button>

            {/* Collapsible LMS dropdown */}
            <div>
              <button 
                onClick={() => setIsLmsOpen(!isLmsOpen)} 
                className="btn w-100 text-start py-3 px-3 rounded-4 d-flex align-items-center justify-content-between border-0" 
                style={{ 
                  transition: 'all 0.25s', 
                  background: activeTab === 'lms' ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: activeTab === 'lms' ? '#ffffff' : '#94a3b8',
                  fontWeight: activeTab === 'lms' ? '600' : '500',
                }}
                onMouseEnter={(e) => { if (activeTab !== 'lms') { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#ffffff'; } }}
                onMouseLeave={(e) => { if (activeTab !== 'lms') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
              >
                <div className="d-flex align-items-center">
                  <i className="fa fa-graduation-cap me-3 fs-5" style={{ width: '24px', color: activeTab === 'lms' ? '#ffffff' : '#64748b' }}></i>
                  <span>LMS & Study Materials</span>
                </div>
                <i className={`fas fa-chevron-${isLmsOpen || activeTab === 'lms' ? 'down' : 'right'} ms-2`} style={{ fontSize: '11px' }}></i>
              </button>
              
              {(isLmsOpen || activeTab === 'lms') && (
                <div className="ps-3 mt-1 d-flex flex-column gap-1" style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', marginLeft: '24px' }}>
                  {/* Recorded sessions */}
                  <button 
                    onClick={() => { setActiveTab('lms'); setActiveLMSCategory('Recorded sessions'); setIsSidebarOpen(false); }} 
                    className="btn btn-sm text-start py-2 px-3 rounded-3 border-0" 
                    style={{ 
                      transition: 'all 0.2s', 
                      background: activeTab === 'lms' && activeLMSCategory === 'Recorded sessions' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                      color: activeTab === 'lms' && activeLMSCategory === 'Recorded sessions' ? '#ffffff' : '#94a3b8',
                      fontWeight: activeTab === 'lms' && activeLMSCategory === 'Recorded sessions' ? '600' : '400',
                      fontSize: '13px'
                    }}
                    onMouseEnter={(e) => { if (!(activeTab === 'lms' && activeLMSCategory === 'Recorded sessions')) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.color = '#ffffff'; } }}
                    onMouseLeave={(e) => { if (!(activeTab === 'lms' && activeLMSCategory === 'Recorded sessions')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
                  >
                    <i className="fa fa-play-circle me-2" style={{ width: '16px', color: activeTab === 'lms' && activeLMSCategory === 'Recorded sessions' ? '#ffffff' : '#64748b' }}></i>
                    <span>Recorded Sessions</span>
                  </button>

                  {/* Study Material */}
                  <button 
                    onClick={() => { setActiveTab('lms'); setActiveLMSCategory('Study Material'); setIsSidebarOpen(false); }} 
                    className="btn btn-sm text-start py-2 px-3 rounded-3 border-0" 
                    style={{ 
                      transition: 'all 0.2s', 
                      background: activeTab === 'lms' && activeLMSCategory === 'Study Material' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                      color: activeTab === 'lms' && activeLMSCategory === 'Study Material' ? '#ffffff' : '#94a3b8',
                      fontWeight: activeTab === 'lms' && activeLMSCategory === 'Study Material' ? '600' : '400',
                      fontSize: '13px'
                    }}
                    onMouseEnter={(e) => { if (!(activeTab === 'lms' && activeLMSCategory === 'Study Material')) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.color = '#ffffff'; } }}
                    onMouseLeave={(e) => { if (!(activeTab === 'lms' && activeLMSCategory === 'Study Material')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
                  >
                    <i className="fa fa-book me-2" style={{ width: '16px', color: activeTab === 'lms' && activeLMSCategory === 'Study Material' ? '#ffffff' : '#64748b' }}></i>
                    <span>Study Material</span>
                  </button>

                  {/* Question Bank */}
                  <button 
                    onClick={() => { setActiveTab('lms'); setActiveLMSCategory('Question Bank'); setIsSidebarOpen(false); }} 
                    className="btn btn-sm text-start py-2 px-3 rounded-3 border-0" 
                    style={{ 
                      transition: 'all 0.2s', 
                      background: activeTab === 'lms' && activeLMSCategory === 'Question Bank' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                      color: activeTab === 'lms' && activeLMSCategory === 'Question Bank' ? '#ffffff' : '#94a3b8',
                      fontWeight: activeTab === 'lms' && activeLMSCategory === 'Question Bank' ? '600' : '400',
                      fontSize: '13px'
                    }}
                    onMouseEnter={(e) => { if (!(activeTab === 'lms' && activeLMSCategory === 'Question Bank')) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.color = '#ffffff'; } }}
                    onMouseLeave={(e) => { if (!(activeTab === 'lms' && activeLMSCategory === 'Question Bank')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
                  >
                    <i className="fa fa-question-circle me-2" style={{ width: '16px', color: activeTab === 'lms' && activeLMSCategory === 'Question Bank' ? '#ffffff' : '#64748b' }}></i>
                    <span>Question Bank</span>
                  </button>
                </div>
              )}
            </div>

            {/* Test and Exam */}
            <button 
              onClick={() => { setActiveTab('test-series'); setIsSidebarOpen(false); }} 
              className="btn w-100 text-start py-3 px-3 rounded-4 d-flex align-items-center border-0" 
              style={{ 
                transition: 'all 0.25s', 
                background: activeTab === 'test-series' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                color: activeTab === 'test-series' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'test-series' ? '600' : '500',
                boxShadow: activeTab === 'test-series' ? '0 4px 15px rgba(79, 70, 229, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => { if (activeTab !== 'test-series') { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#ffffff'; } }}
              onMouseLeave={(e) => { if (activeTab !== 'test-series') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              <i className="fa fa-edit me-3 fs-5" style={{ width: '24px', color: activeTab === 'test-series' ? '#ffffff' : '#64748b' }}></i>
              <span>Test and Exam</span>
            </button>

            {/* Assignment */}
            <button 
              onClick={() => { setActiveTab('assignments'); setIsSidebarOpen(false); }} 
              className="btn w-100 text-start py-3 px-3 rounded-4 d-flex align-items-center border-0" 
              style={{ 
                transition: 'all 0.25s', 
                background: activeTab === 'assignments' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                color: activeTab === 'assignments' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'assignments' ? '600' : '500',
                boxShadow: activeTab === 'assignments' ? '0 4px 15px rgba(79, 70, 229, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => { if (activeTab !== 'assignments') { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#ffffff'; } }}
              onMouseLeave={(e) => { if (activeTab !== 'assignments') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              <i className="fa fa-tasks me-3 fs-5" style={{ width: '24px', color: activeTab === 'assignments' ? '#ffffff' : '#64748b' }}></i>
              <span>Assignment</span>
            </button>

            {/* Fees Receipt */}
            <button 
              onClick={() => { setActiveTab('payments'); setIsSidebarOpen(false); }} 
              className="btn w-100 text-start py-3 px-3 rounded-4 d-flex align-items-center border-0" 
              style={{ 
                transition: 'all 0.25s', 
                background: activeTab === 'payments' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                color: activeTab === 'payments' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'payments' ? '600' : '500',
                boxShadow: activeTab === 'payments' ? '0 4px 15px rgba(79, 70, 229, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => { if (activeTab !== 'payments') { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#ffffff'; } }}
              onMouseLeave={(e) => { if (activeTab !== 'payments') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              <i className="fa fa-receipt me-3 fs-5" style={{ width: '24px', color: activeTab === 'payments' ? '#ffffff' : '#64748b' }}></i>
              <span>Fees Receipt</span>
            </button>

            {/* Certificates */}
            <button 
              onClick={() => { setActiveTab('vault'); setIsSidebarOpen(false); }} 
              className="btn w-100 text-start py-3 px-3 rounded-4 d-flex align-items-center border-0" 
              style={{ 
                transition: 'all 0.25s', 
                background: activeTab === 'vault' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                color: activeTab === 'vault' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'vault' ? '600' : '500',
                boxShadow: activeTab === 'vault' ? '0 4px 15px rgba(79, 70, 229, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => { if (activeTab !== 'vault') { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#ffffff'; } }}
              onMouseLeave={(e) => { if (activeTab !== 'vault') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              <i className="fa fa-certificate me-3 fs-5" style={{ width: '24px', color: activeTab === 'vault' ? '#ffffff' : '#64748b' }}></i>
              <span>Certificates</span>
            </button>

            {/* Refer and Earn */}
            <button 
              onClick={() => { setActiveTab('refer-earn'); setIsSidebarOpen(false); }} 
              className="btn w-100 text-start py-3 px-3 rounded-4 d-flex align-items-center border-0" 
              style={{ 
                transition: 'all 0.25s', 
                background: activeTab === 'refer-earn' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                color: activeTab === 'refer-earn' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'refer-earn' ? '600' : '500',
                boxShadow: activeTab === 'refer-earn' ? '0 4px 15px rgba(79, 70, 229, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => { if (activeTab !== 'refer-earn') { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#ffffff'; } }}
              onMouseLeave={(e) => { if (activeTab !== 'refer-earn') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              <i className="fa fa-gift me-3 fs-5" style={{ width: '24px', color: activeTab === 'refer-earn' ? '#ffffff' : '#e11d48' }}></i>
              <span>Refer and Earn</span>
            </button>

            {/* 24/7 AI Doubt Solver */}
            <button 
              onClick={() => { setActiveTab('ai-tutor'); setIsSidebarOpen(false); }} 
              className="btn w-100 text-start py-3 px-3 rounded-4 d-flex align-items-center border-0" 
              style={{ 
                transition: 'all 0.25s', 
                background: activeTab === 'ai-tutor' ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' : 'transparent',
                color: activeTab === 'ai-tutor' ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === 'ai-tutor' ? '600' : '500',
                boxShadow: activeTab === 'ai-tutor' ? '0 4px 15px rgba(37, 99, 235, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => { if (activeTab !== 'ai-tutor') { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#ffffff'; } }}
              onMouseLeave={(e) => { if (activeTab !== 'ai-tutor') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              <i className="fa fa-robot me-3 fs-5" style={{ width: '24px', color: activeTab === 'ai-tutor' ? '#ffffff' : '#2563eb' }}></i>
              <span>24/7 AI Doubt Solver</span>
            </button>

            {/* Tools Gating (Vigithink Safety, Vigithink eTMF, Vigithink CDMS) */}
            <div className="my-2 p-3 rounded-4 border" style={{ borderColor: 'rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
              <small className="fw-bold text-white-50 px-2 d-block mb-2 text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Vigithink Tools</small>
              <a href="https://clinidea.in/vigithink/login" target="_blank" rel="noreferrer" className="d-flex align-items-center gap-2 p-2 rounded text-white text-decoration-none transition-all" style={{ fontSize: '13px' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                <i className="fa fa-shield-alt text-success"></i> Vigithink Safety
              </a>
              <a href="https://clinidea.in/vigithinketmf/login" target="_blank" rel="noreferrer" className="d-flex align-items-center gap-2 p-2 rounded text-white text-decoration-none transition-all" style={{ fontSize: '13px' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                <i className="fa fa-folder-open text-warning"></i> Vigithink eTMF
              </a>
              {enrolledBatches.some(e => e.courseName && e.courseName.toLowerCase().includes('data management')) && (
                <a href="https://clinidea.in/vigithinkcdms/login" target="_blank" rel="noreferrer" className="d-flex align-items-center gap-2 p-2 rounded text-white text-decoration-none transition-all" style={{ fontSize: '13px' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}>
                  <i className="fa fa-database text-primary"></i> Vigithink CDMS
                </a>
              )}
            </div>

          </div>

          <p className="text-white-50 small fw-bold text-uppercase px-3 mb-2 mt-4" style={{ letterSpacing: '0.8px', fontSize: '11px', opacity: 0.6 }}>Account</p>
          <div className="d-flex flex-column gap-1">
            <button 
              onClick={() => { setShowProfilePanel(true); setIsSidebarOpen(false); }} 
              className="btn w-100 text-start py-3 px-3 rounded-4 d-flex align-items-center border-0 text-white-50" 
              style={{ transition: 'all 0.25s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >
              <i className="fa fa-user-edit me-3 fs-5" style={{ width: '24px', color: '#6366f1' }}></i>
              <span>Profile Settings</span>
            </button>
            
            <button 
              onClick={handleLogout} 
              className="btn w-100 text-start py-3 px-3 rounded-4 d-flex align-items-center border-0 text-white-50 mt-1" 
              style={{ transition: 'all 0.25s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >
              <i className="fa fa-sign-out-alt me-3 fs-5" style={{ width: '24px', color: '#ef4444' }}></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div 
        className="flex-grow-1 d-flex flex-column w-100 sidebar-margin-responsive"
        style={{ transition: 'margin-left 0.3s ease-in-out', minWidth: 0 }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          .student-sidebar {
            width: 260px;
            position: fixed;
            top: 60px;
            bottom: 0;
            left: 0;
            z-index: 1040;
            border-right: 1px solid var(--color-border);
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
            background-color: #ffffff;
          }
          .student-sidebar.open {
            transform: translateX(0) !important;
          }
          @media (min-width: 768px) {
            .student-sidebar {
              transform: translateX(0) !important;
            }
            .sidebar-margin-responsive {
              margin-left: 260px !important;
            }
          }
          .hover-bg-light:hover { background-color: #f8fafc !important; }
        `}} />
        
        {/* Topbar */}
        <div className="shadow-sm px-4 py-2.5 d-flex justify-content-between align-items-center bg-white position-sticky" style={{ top: '60px', zIndex: 1000, borderBottom: '1px solid var(--color-border)' }}>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-light d-md-none p-2 border rounded" onClick={() => setIsSidebarOpen(true)}>
              <i className="fa fa-bars fs-5 text-dark"></i>
            </button>
            <div>
              <h4 className="heading-premium mb-0 d-none d-sm-block text-dark" style={{ fontSize: '1.25rem' }}>Welcome back, {userContext.fullName || 'Student'}!</h4>
              <h5 className="heading-premium mb-0 d-sm-none text-dark">Dashboard</h5>
              <p className="text-muted small mb-0 d-none d-md-block">Track your progress and access your learning materials.</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Notification Bell */}
            <div className="position-relative">
              <button className="btn btn-light rounded-circle shadow-sm position-relative" style={{ width: '40px', height: '40px' }} onClick={() => setShowNotifications(!showNotifications)}>
                <i className="fa fa-bell text-muted"></i>
                {notifications.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="card-premium position-absolute mt-2 p-0 shadow-lg" style={{ width: '300px', zIndex: 1050, maxHeight: '400px', overflowY: 'auto', right: '-10px' }}>
                  <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center p-3">
                    <h6 className="mb-0 fw-bold">Notifications</h6>
                    {notifications.length > 0 && (
                      <button className="btn btn-sm btn-link text-decoration-none p-0" onClick={handleMarkNotificationsRead}>Mark all read</button>
                    )}
                  </div>
                  <div className="list-group list-group-flush">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted small">No new notifications.</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="list-group-item p-3 border-0 border-bottom bg-light">
                          <div className="fw-bold mb-1" style={{ fontSize: '0.9rem' }}>{n.title}</div>
                          <div className="text-muted small">{n.message}</div>
                          <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>{new Date(n.createdAt).toLocaleTimeString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* User Avatar Placeholder */}
            <div className="bg-primary bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center border border-primary d-none d-sm-flex" style={{ width: '40px', height: '40px', cursor: 'pointer' }} onClick={() => setShowProfilePanel(true)} title="Profile Settings">
               <span className="text-primary fw-bold">{userContext.fullName ? userContext.fullName.charAt(0).toUpperCase() : 'S'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="p-3 p-md-3 py-3 flex-grow-1 w-100 mx-auto" style={{ maxWidth: '1400px' }}>
          
          {payments.some(p => p.paymentStatus === 'pending' && new Date(p.dueDate) < new Date()) && !isFeeBlocked && (
            <div className="alert alert-danger shadow-sm border-2 fw-bold d-flex justify-content-between align-items-center mb-4">
              <div>
                <i className="fa fa-exclamation-triangle me-2"></i>
                You have overdue fee installments! Please clear your dues immediately to avoid account blocking.
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => setActiveTab('payments')}>Pay Now</button>
            </div>
          )}

          {isFeeBlocked && activeTab !== 'payments' ? (
             <div className="card-premium h-100 text-center py-5 mt-4">
               <div className="card-body">
                 <i className="fa fa-lock text-danger mb-3" style={{ fontSize: '4rem' }}></i>
                 <h3 className="fw-bold text-danger">LMS Access Blocked</h3>
                 <p className="text-muted fs-5">{feeBlockMessage || 'Your access has been temporarily revoked due to pending fee installments.'}</p>
                 <button className="btn btn-danger btn-lg mt-3" onClick={() => setActiveTab('payments')}>
                   <i className="fa fa-receipt me-2"></i> View Dues & Pay Online
                 </button>
               </div>
             </div>
          ) : (
            <>

        {/* Tab Content: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card-premium h-100">
                <div className="card-header bg-white border-0 p-4" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                  <h4 className="heading-premium text-dark mb-0"><i className="fa fa-chart-line text-primary me-2"></i> Overall Course Progress</h4>
                </div>
                <div className="card-body p-4 bg-light">
                  <div className="row g-4">
                    <div className="col-md-4">
                      <div className="p-4 bg-white rounded-3 shadow-sm text-center border">
                        <i className="fa fa-user-check text-success fs-1 mb-3"></i>
                        <h5 className="fw-bold mb-1">Attendance</h5>
                        <p className="text-muted mb-0">85%</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-4 bg-white rounded-3 shadow-sm text-center border">
                        <i className="fa fa-tasks text-info fs-1 mb-3"></i>
                        <h5 className="fw-bold mb-1">Test Performance</h5>
                        <p className="text-muted mb-0">Awaiting Scores</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-4 bg-white rounded-3 shadow-sm text-center border">
                        <i className="fa fa-graduation-cap text-warning fs-1 mb-3"></i>
                        <h5 className="fw-bold mb-1">Course Progress</h5>
                        <p className="text-muted mb-0">In Progress</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white rounded shadow-sm border">
                    <p className="text-muted mb-0 text-center"><i className="fa fa-info-circle me-2"></i> Detailed analytics will be available as you complete more modules and tests.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: LMS */}
        {activeTab === 'lms' && (
          <div className="row g-4">

            {pendingEnrollments.length > 0 && (
              <div className="col-12">
                <div className="card border-warning border-2 shadow-sm mb-2" style={{ backgroundColor: '#fffbeb' }}>
                  <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div>
                      <h5 className="text-warning mb-1"><i className="fa fa-exclamation-circle me-2"></i>Pending Fees Notice</h5>
                      <p className="mb-0 text-dark">You have pending fees for your enrolled courses.</p>
                    </div>
                    <div className="d-flex flex-column gap-2 mt-3 mt-md-0 w-100" style={{ maxWidth: '400px' }}>
                      {pendingEnrollments.map(enr => (
                        <div key={enr.id} className="d-flex justify-content-between align-items-center bg-white p-2 border rounded shadow-sm">
                          <span className="fw-bold text-dark" style={{fontSize: '0.9rem'}}>{enr.courseName} <br/><span className="text-danger">₹{enr.feesPending} Pending</span></span>
                          <button onClick={() => handlePayPending(enr)} className="btn btn-sm text-white fw-bold shadow-sm" style={{ backgroundColor: '#4f46e5' }}>Pay Now</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="col-12">
              <div className="card-premium p-4 min-vh-50">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                  <h4 className="heading-premium text-dark mb-0"><i className={`fa ${getCategoryIcon(activeLMSCategory)} me-2`}></i> {activeLMSCategory}</h4>
                </div>
                
                {currentItems.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="bg-light rounded-circle d-flex justify-content-center align-items-center mb-4 mx-auto" style={{ width: '80px', height: '80px' }}>
                      <i className={`fa ${getCategoryIcon(activeLMSCategory)} fs-2 text-muted`}></i>
                    </div>
                    <h5 className="heading-premium text-muted">No content available in this category yet.</h5>
                  </div>
                ) : (
                  <div className="row g-3">
                    {currentItems.map(item => (
                      <div key={item.id} className="col-md-6 col-lg-4 col-xl-3">
                        <div 
                          className="card-premium h-100" 
                          style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                          onClick={() => {
                            let contentUrl = null;
                            if (item.localFileUrl) {
                              contentUrl = item.localFileUrl.startsWith('http') ? item.localFileUrl : `${BASE_URL}${item.localFileUrl}`;
                            } else if (item.driveWebViewLink) {
                              contentUrl = item.driveWebViewLink;
                            }
                            
                            if (contentUrl) {
                              const url = `/watch?link=${encodeURIComponent(contentUrl)}&title=${encodeURIComponent(item.title)}&type=${item.contentType}`;
                              navigate(url);
                            }
                          }}
                          onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.classList.add('shadow'); }}
                          onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.classList.remove('shadow'); }}
                          title="Click to open in new tab"
                        >
                          {/* LMS Video Thumbnail Area */}
                          <div 
                            className="position-relative w-100 border-bottom" 
                            style={{ 
                              aspectRatio: '16/9', 
                              background: item.contentType === 'video' ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center',
                              overflow: 'hidden'
                            }}
                          >
                            {/* Hover overlay for Play button animation */}
                            <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(0,0,0,0.1)', transition: 'background-color 0.3s' }}>
                              <div className="rounded-circle d-flex justify-content-center align-items-center play-btn-overlay" style={{ width: '54px', height: '54px', backgroundColor: item.contentType === 'video' ? 'rgba(255,255,255,0.25)' : 'rgba(15,23,42,0.15)', backdropFilter: 'blur(5px)', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                                <i className={`fa ${item.contentType === 'video' ? 'fa-play' : 'fa-file-alt'} fs-4`} style={{ color: item.contentType === 'video' ? '#fff' : '#0f172a', marginLeft: item.contentType === 'video' ? '4px' : '0' }}></i>
                              </div>
                            </div>

                            {/* Module Name / Topic Badge at Top Left */}
                            <div className="position-absolute" style={{ top: '12px', left: '12px', zIndex: 5 }}>
                              <span className="badge rounded-pill" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.7rem', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.1)', fontWeight: '600', letterSpacing: '0.5px' }}>
                                {item.moduleName || 'General Topic'}
                              </span>
                            </div>
                            
                            {/* Duration / Type indicator at Bottom Right */}
                            <div className="position-absolute" style={{ bottom: '8px', right: '8px', zIndex: 5 }}>
                              <span className="badge rounded bg-dark text-white opacity-75" style={{ fontSize: '0.65rem', padding: '4px 6px' }}>
                                {item.contentType === 'video' ? '1080p' : 'Doc'}
                              </span>
                            </div>
                          </div>

                          {/* Content Details Area */}
                          <div className="card-body p-3 d-flex flex-column bg-white h-100">
                            <h6 className="heading-premium text-dark mb-1 fw-bold" style={{ fontSize: '0.95rem', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {item.title}
                            </h6>
                            <p className="text-muted small mb-0 mt-1" style={{ fontSize: '0.8rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {item.description ? item.description : (item.contentType === 'video' ? 'Recorded Video Lecture' : 'Downloadable Study Material')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Live Sessions */}
        {activeTab === 'live' && (
          <div className="row">
            <div className="col-12">
              <div className="card-premium">
                <div className="card-header bg-white border-0 p-4" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                  <h4 className="heading-premium text-dark mb-0">Upcoming & Live Sessions</h4>
                  <p className="text-muted small mb-0 mt-1">Join your interactive classes via Clinidea Space.</p>
                </div>
                <div className="card-body p-4 bg-light">
                  {liveSessions.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="bg-white rounded-circle d-flex justify-content-center align-items-center mb-4 mx-auto shadow-sm" style={{ width: '80px', height: '80px' }}>
                        <i className="fa fa-calendar-times text-muted fs-2"></i>
                      </div>
                      <h5 className="heading-premium text-muted">No Live Sessions Found</h5>
                      <p className="text-muted small">You currently have no scheduled live classes.</p>
                    </div>
                  ) : (
                    <div className="row g-4">
                      {liveSessions.map(cls => (
                        <div key={cls.id} className="col-md-6 col-lg-4">
                          <div className="card-premium h-100 overflow-hidden" style={{ transition: 'transform 0.2s', border: cls.status === 'live' ? '2px solid #ef4444' : 'none' }} onMouseOver={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform='translateY(0)'}>
                            <div className="p-3" style={{ background: cls.status === 'live' ? '#ef4444' : 'var(--color-primary)' }}>
                              <h6 className="heading-premium mb-0 text-white d-flex justify-content-between align-items-center">
                                <span><i className="fa fa-video me-2"></i> {cls.title || 'Live Class'}</span>
                                {cls.status === 'live' && <span className="badge bg-white text-danger heartbeat rounded-pill" style={{ fontSize: '0.65rem' }}>LIVE NOW</span>}
                              </h6>
                            </div>
                            <div className="card-body p-4">
                              <div className="d-flex align-items-center mb-3">
                                <div className="bg-light rounded p-2 me-3"><i className="fa fa-calendar-day text-primary fs-5"></i></div>
                                <div>
                                  <small className="text-muted d-block lh-1">Date</small>
                                  <span className="fw-bold text-dark">{new Date(cls.sessionDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="d-flex align-items-center mb-4">
                                <div className="bg-light rounded p-2 me-3"><i className="fa fa-clock text-primary fs-5"></i></div>
                                <div>
                                  <small className="text-muted d-block lh-1">Time</small>
                                  <span className="fw-bold text-dark">{cls.sessionTime}</span>
                                </div>
                              </div>
                              <a 
                                href={`https://jitsi.belnet.be/Clinidea_LiveClass_Batch_${cls.batchId}_${cls.id}#userInfo.displayName="${encodeURIComponent(userContext.fullName || 'Student')}"&config.prejoinPageEnabled=false`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-premium w-100 text-center text-decoration-none d-block fw-bold shadow-sm" 
                                style={{ backgroundColor: cls.status === 'live' ? '#ef4444' : '#4f46e5', color: 'white', transition: 'all 0.2s' }}
                              >
                                {cls.status === 'live' ? 'Join Live Class' : 'Enter Meeting Space'} <i className="fa fa-external-link-alt ms-2"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Vault */}
        {activeTab === 'vault' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card-premium h-100">
                <div className="card-header bg-white border-0 p-4" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                  <h4 className="heading-premium text-dark mb-0"><i className="fa fa-certificate text-warning me-2"></i> My Certificates</h4>
                </div>
                <div className="card-body p-4 bg-light">
                  {certificates.length === 0 ? <p className="text-muted text-center py-4">No certificates issued yet.</p> : (
                    <div className="d-flex flex-column gap-3">
                      {certificates.map(cert => (
                        <div key={cert.id} className="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-white shadow-sm">
                          <div>
                            <h6 className="heading-premium mb-1 text-dark">{cert.course?.name || "Course"}</h6>
                            <span className="badge mb-1" style={{ background: '#fffbeb', color: '#f59e0b', border: '1px solid #fcd34d' }}>{cert.certificateType}</span>
                            <div className="small text-muted">ID: {cert.certificateId}</div>
                          </div>
                          <a href={`${BASE_URL}${cert.fileUrl}`} target="_blank" rel="noreferrer" className="btn-premium px-4 py-2 fw-bold shadow-sm" style={{ backgroundColor: '#4f46e5', color: 'white', fontSize: '0.85rem', transition: 'all 0.2s' }}>Download</a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Payments */}
        {activeTab === 'payments' && (
          <StudentPayments payments={payments} fetchDashboardData={fetchDashboardData} />
        )}

        {/* Tab Content: Assignment */}
        {activeTab === 'assignments' && (
          <StudentAssignments assignments={assignments} showMessage={(t, ty) => setMessage({text: t, type: ty})} fetchDashboardData={fetchDashboardData} />
        )}

        {/* Tab Content: Test Series */}
        {activeTab === 'test-series' && (
          <StudentExams exams={exams} showMessage={(t, ty) => setMessage({text: t, type: ty})} fetchDashboardData={fetchDashboardData} />
        )}

        {/* Tab Content: Refer and Earn */}
        {activeTab === 'refer-earn' && (
          <div className="row g-4">
            <div className="col-12">
              <div className="card-premium h-100">
                <div className="card-header bg-white border-0 p-4" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
                  <h4 className="heading-premium text-dark mb-0"><i className="fa fa-gift text-danger me-2"></i> Refer & Earn</h4>
                </div>
                <div className="card-body p-4 bg-light text-center">
                  <div className="py-4">
                    <i className="fa fa-users text-danger fs-1 mb-3"></i>
                    <h5 className="fw-bold text-dark">Refer your friends & earn rewards!</h5>
                    <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>Share your unique referral link with friends. When they enroll in a course, you both earn exciting rewards and discounts!</p>
                    <button className="btn btn-primary mt-3 px-4 py-2 rounded-pill fw-bold shadow-sm"><i className="fa fa-share-alt me-2"></i> Share Link</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
        )}
      </div>
      {/* End Main Content Wrapper */}
      </div>

      {/* Slide-Over Profile Panel */}
      {showProfilePanel && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040, background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowProfilePanel(false)}></div>
          <div className="bg-white shadow-lg overflow-auto" style={{ position: 'fixed', top: 0, right: 0, width: '450px', maxWidth: '100%', height: '100vh', zIndex: 1050, transition: 'transform 0.3s', borderLeft: '1px solid var(--color-border)' }}>
            <div className="p-4 d-flex justify-content-between align-items-center position-sticky top-0 bg-white" style={{ zIndex: 10, borderBottom: '1px solid var(--color-border)' }}>
              <h4 className="heading-premium mb-0 text-dark">Profile & Settings</h4>
              <button onClick={() => setShowProfilePanel(false)} className="btn text-muted"><i className="fa fa-times fs-4"></i></button>
            </div>
            
            <div className="p-4 bg-light min-vh-100">
              {message.text && <div className={`alert alert-${message.type} small fw-bold shadow-sm`}>{message.text}</div>}
              
              <div className="card-premium p-4 mb-4">
                <h6 className="heading-premium mb-3 text-primary"><i className="fa fa-cloud-upload-alt me-2"></i> Document Vault</h6>
                <form onSubmit={handleFileUpload} className="p-3 rounded-3 bg-light border">
                  <select className="input-premium bg-white mb-3" value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
                    <option value="photo">Passport Photo</option>
                    <option value="id_proof">Government ID / Aadhar</option>
                    <option value="education_certificate">Degree / Transcript</option>
                  </select>
                  <input type="file" className="input-premium bg-white mb-3" style={{ padding: '8px' }} onChange={(e) => setSelectedFile(e.target.files[0])} />
                  <button type="submit" disabled={uploading} className="btn w-100 py-2 text-white fw-bold shadow-sm bg-theme-secondary border-0" style={{ transition: 'all 0.2s' }}>
                    {uploading ? 'Uploading...' : 'Secure Upload'}
                  </button>
                </form>
                
                {documents.length > 0 && (
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    {documents.map(doc => (
                      <span key={doc.id} className="badge bg-white text-dark border px-3 py-2 rounded-pill shadow-sm"><i className="fa fa-lock me-1 text-success"></i> {doc.documentType.replace('_', ' ')}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="card-premium p-4 mb-4">
                <h6 className="heading-premium mb-3 text-primary"><i className="fa fa-user-edit me-2"></i> Demographics</h6>
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Date of Birth</label>
                    <input type="date" className="input-premium bg-light" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleProfileChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Gender</label>
                    <select className="input-premium bg-light" name="gender" value={profile.gender} onChange={handleProfileChange}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Address</label>
                    <input type="text" className="input-premium bg-light" name="address" value={profile.address} onChange={handleProfileChange} />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-12 col-sm-4">
                      <label className="form-label small fw-bold text-muted">City</label>
                      <input type="text" className="input-premium bg-light" name="city" value={profile.city} onChange={handleProfileChange} />
                    </div>
                    <div className="col-12 col-sm-4">
                      <label className="form-label small fw-bold text-muted">State</label>
                      <input type="text" className="input-premium bg-light" name="state" value={profile.state} onChange={handleProfileChange} />
                    </div>
                    <div className="col-12 col-sm-4">
                      <label className="form-label small fw-bold text-muted">Pin</label>
                      <input type="text" className="input-premium bg-light" name="pincode" value={profile.pincode} onChange={handleProfileChange} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Qualification</label>
                    <input type="text" className="input-premium bg-light" name="qualification" value={profile.qualification} onChange={handleProfileChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">College</label>
                    <input type="text" className="input-premium bg-light" name="collegeName" value={profile.collegeName} onChange={handleProfileChange} />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Grad Year</label>
                    <input type="text" className="input-premium bg-light" name="graduationYear" value={profile.graduationYear} onChange={handleProfileChange} />
                  </div>
                  
                  <button type="submit" disabled={saving} className="btn w-100 py-3 text-white fw-bold shadow-sm bg-theme-secondary border-0" style={{ transition: 'all 0.2s' }}>
                    {saving ? 'Saving...' : 'Save Profile Details'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        {activeTab === 'ai-tutor' && (
          <div className="row g-4">
            <div className="col-12">
              <StudentAITutor />
            </div>
          </div>
        )}
        </>
      )}

      {/* Student Absence Reason Modal (Strict Popup) */}
      {pendingAbsence && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-danger text-white border-bottom-0 rounded-top-4">
                <h5 className="modal-title fw-bold"><i className="fas fa-exclamation-triangle me-2"></i> Action Required: Absence Recorded</h5>
              </div>
              <div className="modal-body p-4 text-center">
                <p className="fs-5 mb-2">You were marked <strong>absent</strong> for the session on:</p>
                <div className="bg-light p-3 rounded-3 mb-4 d-inline-block fw-bold text-dark shadow-sm">
                  {new Date(pendingAbsence.session?.sessionDate).toLocaleDateString()} - {pendingAbsence.session?.title}
                </div>
                <p className="text-muted mb-4">Please provide a valid reason for your absence to continue using the portal.</p>
                
                <form onSubmit={handleAbsenceSubmit}>
                  <textarea 
                    className="form-control mb-4 bg-light" 
                    rows="3" 
                    required 
                    placeholder="Enter your reason here..."
                    value={absenceReasonText}
                    onChange={(e) => setAbsenceReasonText(e.target.value)}
                  ></textarea>
                  <button type="submit" className="btn btn-danger fw-bold rounded-pill w-100 py-2 fs-5 shadow">
                    Submit Reason & Continue
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
