import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const EnrollmentForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState(null);
  
  const [initialCourseSet, setInitialCourseSet] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Form State
  const initialParams = new URLSearchParams(window.location.search);
  const initialCourseUrl = initialParams.get('course') || '';

  const [profile, setProfile] = useState({
    fullName: '', email: '', phone: '', alternatePhone: '',
    dateOfBirth: '', gender: '', address: '', city: '', state: '', pincode: '',
    qualification: '', specialization: '', collegeName: '', graduationYear: '', cgpa: '',
    experienceStatus: '', companyName: '', jobRole: '', totalExperience: '',
    courseName: initialCourseUrl, paymentType: 'full'
  });

  // Files State
  const [files, setFiles] = useState({
    photo: null, id_proof: null, resume: null, edu_cert: null
  });

  const [dbCourses, setDbCourses] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialCourse = params.get('course') || '';
    if (initialCourse) {
      setInitialCourseSet(true);
    }

    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate(`/login?redirect=${encodeURIComponent('/enroll' + (initialCourse ? `?course=${initialCourse}` : ''))}`);
      return;
    }

    // Fetch profile to see if registered
    fetch(`${BASE_URL}/api/student/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(data => {
      if (data.profile) {
        setIsRegistered(!!data.profile.user?.registrationFeePaid);
        setProfile(prev => ({
          ...prev,
          courseName: initialCourse || prev.courseName,
          fullName: data.profile.user?.fullName || '',
          email: data.profile.user?.email || '',
          phone: data.profile.user?.phone || '',
          alternatePhone: data.profile.alternatePhone || '',
          dateOfBirth: data.profile.dateOfBirth ? data.profile.dateOfBirth.split('T')[0] : '',
          gender: data.profile.gender || '',
          address: data.profile.address || '',
          city: data.profile.city || '',
          state: data.profile.state || '',
          pincode: data.profile.pincode || '',
          qualification: data.profile.qualification || '',
          specialization: data.profile.specialization || '',
          collegeName: data.profile.collegeName || '',
          graduationYear: data.profile.graduationYear || '',
          cgpa: data.profile.cgpa || '',
          experienceStatus: data.profile.experienceStatus || '',
          companyName: data.profile.companyName || '',
          jobRole: data.profile.jobRole || '',
          totalExperience: data.profile.totalExperience || ''
        }));
      } else if (data.user) {
        // Fallback to user data if profile is not yet created
        setIsRegistered(!!data.user.registrationFeePaid);
        setProfile(prev => ({
          ...prev,
          courseName: initialCourse || prev.courseName,
          fullName: data.user.fullName || '',
          email: data.user.email || '',
          phone: data.user.phone || ''
        }));
      }
    }).catch(err => console.error(err));

    // Fetch live courses from DB for dynamic fees
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDbCourses(data);
        }
      })
      .catch(err => console.error("Failed to fetch courses:", err));

  }, [navigate]);

  const handleProfileChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e, type) => {
    setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
  };

  const getCalculatedFees = () => {
    if (!profile.courseName) return { totalFees: 0, amountPayingNow: 0, remainingFees: 0 };
    
    const selectedCourse = dbCourses.find(c => c.name === profile.courseName);
    const baseFee = selectedCourse && selectedCourse.fees ? selectedCourse.fees : 50000;
    const discount = isRegistered ? 10000 : 0;
    
    if (profile.paymentType === 'full') {
      const amountPayingNow = baseFee - discount;
      return { 
        baseFee, 
        totalFees: amountPayingNow, 
        amountPayingNow, 
        remainingFees: 0 
      };
    } else {
      const surcharge = 2000;
      const remainingBase = baseFee - discount;
      const totalInstallmentAmount = remainingBase + surcharge;
      const installmentAmount = totalInstallmentAmount / 2;
      const amountPayingNow = installmentAmount;
      const remainingFees = installmentAmount;
      return { 
        baseFee, 
        totalFees: totalInstallmentAmount, 
        amountPayingNow, 
        remainingFees 
      };
    }
  };

  const feesData = getCalculatedFees();

  const uploadSingleFile = async (file, type, token) => {
    if (!file) return;
    const fd = new FormData();
    fd.append('document_type', type);
    fd.append('file', file);
    const docRes = await fetch(`${BASE_URL}/api/student/upload-document`, {
      method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd
    });
    if(!docRes.ok) {
      const errData = await docRes.json();
      throw new Error(errData.error || `Failed to upload ${type}`);
    }
  };

  const handleProceedToPay = async () => {
    setLoading(true);
    setError('');

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setError("Failed to load Razorpay. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      
      // 1. Create Order
      const res = await fetch(`${BASE_URL}/api/enrollment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          course_name: profile.courseName,
          type: profile.paymentType
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: data.amount,
        currency: "INR",
        name: "Clinidea Education",
        description: `Enrollment: ${profile.courseName}`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch(`${BASE_URL}/api/enrollment/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                enrollmentId: data.enrollmentId
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error);
            
            setPaymentResult({
              transactionId: response.razorpay_payment_id,
              studentName: profile.fullName,
              courseName: profile.courseName,
              totalFees: feesData.totalFees,
              amountPaid: feesData.amountPayingNow,
              remainingFees: feesData.remainingFees
            });
            
            setStep(3); // Success Screen
            window.scrollTo(0,0);
          } catch (err) {
            setError(err.message);
          }
        },
        prefill: {
          name: profile.fullName,
          email: profile.email,
          contact: profile.phone
        },
        theme: { color: "#059669" }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        setError("Payment failed: " + response.error.description);
      });
      paymentObject.open();

    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to initialize payment.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.courseName) return setError("Please select a course.");
    if (!files.photo || !files.id_proof || !files.resume || !files.edu_cert) {
      return setError("Please upload all 4 mandatory documents.");
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('userToken');
      
      // 1. Upload Profile Files
      await uploadSingleFile(files.photo, 'photo', token);
      await uploadSingleFile(files.id_proof, 'id_proof', token);
      await uploadSingleFile(files.resume, 'education_certificate', token);
      await uploadSingleFile(files.edu_cert, 'education_certificate', token);

      // 2. Save Profile
      const profRes = await fetch(`${BASE_URL}/api/student/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profile)
      });
      if (!profRes.ok) throw new Error("Failed to save profile.");

      // Move to Payment Step
      await handleProceedToPay();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    const fileName = `receipt_${paymentResult.transactionId}.pdf`;
    window.location.href = `${BASE_URL}/uploads/receipts/${fileName}`;
  };

  return (
    <div className="container-fluid py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-9">
          
          <div className="text-center mb-4 mb-md-5">
            <h1 className="fw-bold" style={{ color: 'var(--color-primary)' }}>Secure Enrollment Portal</h1>
            <p className="text-muted">Complete your application and join Clinidea Education.</p>
          </div>

          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-3 p-sm-4 p-md-5">
              {error && <div className="alert alert-danger fw-bold rounded-3"><i className="fa fa-exclamation-triangle me-2"></i>{error}</div>}

              {/* STEP 1: Form & Payment */}
              {step === 1 && (
                <form onSubmit={handleSubmit}>
                  {/* Personal Details */}
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-4"><i className="fa fa-user me-2 text-primary"></i>Personal Details</h4>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6"><label className="form-label fw-bold">Full Name *</label><input type="text" className="form-control bg-light" name="fullName" value={profile.fullName} onChange={handleProfileChange} required/></div>
                    <div className="col-md-6"><label className="form-label fw-bold">Email ID *</label><input type="email" className="form-control bg-light" name="email" value={profile.email} onChange={handleProfileChange} required/></div>
                    <div className="col-md-6"><label className="form-label fw-bold">Mobile Number *</label><PhoneInput country={'in'} value={profile.phone} onChange={(value, country, e, formattedValue) => handleProfileChange({ target: { name: 'phone', value: formattedValue } })} inputClass="form-control bg-light border-0" buttonClass="bg-light border-0" containerClass="w-100" inputStyle={{ width: '100%', height: '38px', fontSize: '1rem', paddingLeft: '48px', borderRadius: '0.375rem' }} buttonStyle={{ borderRadius: '0.375rem 0 0 0.375rem', width: '40px', padding: '0 5px' }} /></div>
                    <div className="col-md-6"><label className="form-label fw-bold">Alternate Contact Number</label><PhoneInput country={'in'} value={profile.alternatePhone} onChange={(value, country, e, formattedValue) => handleProfileChange({ target: { name: 'alternatePhone', value: formattedValue } })} inputClass="form-control bg-light border-0" buttonClass="bg-light border-0" containerClass="w-100" inputStyle={{ width: '100%', height: '38px', fontSize: '1rem', paddingLeft: '48px', borderRadius: '0.375rem' }} buttonStyle={{ borderRadius: '0.375rem 0 0 0.375rem', width: '40px', padding: '0 5px' }} /></div>
                    <div className="col-md-6"><label className="form-label fw-bold">Date of Birth *</label><input type="date" className="form-control bg-light" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleProfileChange} required/></div>
                    <div className="col-md-6"><label className="form-label fw-bold">Gender *</label><select className="form-select bg-light" name="gender" value={profile.gender} onChange={handleProfileChange} required><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
                    <div className="col-12"><label className="form-label fw-bold">Full Address *</label><input type="text" className="form-control bg-light" name="address" value={profile.address} onChange={handleProfileChange} required/></div>
                    <div className="col-md-4"><label className="form-label fw-bold">City *</label><input type="text" className="form-control bg-light" name="city" value={profile.city} onChange={handleProfileChange} required/></div>
                    <div className="col-md-4"><label className="form-label fw-bold">State *</label><input type="text" className="form-control bg-light" name="state" value={profile.state} onChange={handleProfileChange} required/></div>
                    <div className="col-md-4"><label className="form-label fw-bold">Pincode *</label><input type="text" className="form-control bg-light" name="pincode" value={profile.pincode} onChange={handleProfileChange} required/></div>
                  </div>

                  {/* Educational Details */}
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-4 mt-5"><i className="fa fa-graduation-cap me-2 text-primary"></i>Educational Details</h4>
                  <div className="row g-3 mb-4">
                    <div className="col-md-6"><label className="form-label fw-bold">Highest Qualification *</label><input type="text" className="form-control bg-light" name="qualification" value={profile.qualification} onChange={handleProfileChange} required/></div>
                    <div className="col-md-6"><label className="form-label fw-bold">Specialization (e.g. B.Pharm) *</label><input type="text" className="form-control bg-light" name="specialization" value={profile.specialization} onChange={handleProfileChange} required/></div>
                    <div className="col-md-6"><label className="form-label fw-bold">University / College Name *</label><input type="text" className="form-control bg-light" name="collegeName" value={profile.collegeName} onChange={handleProfileChange} required/></div>
                    <div className="col-md-3"><label className="form-label fw-bold">Year of Passing *</label><input type="text" className="form-control bg-light" name="graduationYear" value={profile.graduationYear} onChange={handleProfileChange} required/></div>
                    <div className="col-md-3"><label className="form-label fw-bold">Percentage / CGPA *</label><input type="text" className="form-control bg-light" name="cgpa" value={profile.cgpa} onChange={handleProfileChange} required/></div>
                  </div>

                  {/* Professional Details */}
                  <h4 className="fw-bold text-dark border-bottom pb-2 mb-4 mt-5"><i className="fa fa-briefcase me-2 text-primary"></i>Professional Details</h4>
                  <div className="row g-3 mb-4">
                    <div className="col-md-12">
                      <label className="form-label fw-bold">Fresher or Experienced? *</label>
                      <select className="form-select bg-light" name="experienceStatus" value={profile.experienceStatus} onChange={handleProfileChange} required>
                        <option value="">Select Status</option><option value="Fresher">Fresher</option><option value="Experienced">Experienced</option>
                      </select>
                    </div>
                    {profile.experienceStatus === 'Experienced' && (
                      <>
                        <div className="col-md-4"><label className="form-label fw-bold">Company Name</label><input type="text" className="form-control bg-light" name="companyName" value={profile.companyName} onChange={handleProfileChange} required/></div>
                        <div className="col-md-4"><label className="form-label fw-bold">Job Role</label><input type="text" className="form-control bg-light" name="jobRole" value={profile.jobRole} onChange={handleProfileChange} required/></div>
                        <div className="col-md-4"><label className="form-label fw-bold">Total Experience</label><input type="text" className="form-control bg-light" name="totalExperience" value={profile.totalExperience} onChange={handleProfileChange} required/></div>
                      </>
                    )}
                  </div>

                  {/* Course & Documents */}
                  <div className="row g-4 mt-4">
                    <div className="col-md-6">
                      <h4 className="fw-bold text-dark border-bottom pb-2 mb-4"><i className="fa fa-book me-2 text-primary"></i>Course Selection</h4>
                      <label className="form-label fw-bold">Select Program *</label>
                      {initialCourseSet ? (
                        <input 
                          type="text" 
                          className="form-control bg-light py-2 mb-3 fw-bold" 
                          name="courseName" 
                          value={profile.courseName} 
                          readOnly 
                          title="Course is selected automatically based on your navigation."
                        />
                      ) : (
                        <select className="form-select bg-light py-2 mb-3" name="courseName" value={profile.courseName} onChange={handleProfileChange} required>
                          <option value="">Choose a Program</option>
                          {dbCourses.map(course => (
                            <option key={course.id} value={course.name}>{course.name}</option>
                          ))}
                        </select>
                      )}

                      <label className="form-label fw-bold">Payment Plan *</label>
                      <select className="form-select bg-light py-2" name="paymentType" value={profile.paymentType} onChange={handleProfileChange} required>
                        <option value="full">One-Time Payment</option>
                        <option value="installment">Installment Plan</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <h4 className="fw-bold text-dark border-bottom pb-2 mb-4"><i className="fa fa-upload me-2 text-primary"></i>Upload Documents</h4>
                      <div className="mb-2"><label className="form-label fw-bold small">Resume (PDF) *</label><input type="file" className="form-control form-control-sm" accept=".pdf" onChange={e => handleFileChange(e, 'resume')} required /></div>
                      <div className="mb-2"><label className="form-label fw-bold small">Educational Certificates *</label><input type="file" className="form-control form-control-sm" accept=".pdf,.jpg,.jpeg,.webp" onChange={e => handleFileChange(e, 'edu_cert')} required /></div>
                      <div className="mb-2"><label className="form-label fw-bold small">ID Proof (Aadhar/PAN) *</label><input type="file" className="form-control form-control-sm" accept=".pdf,.jpg,.jpeg,.webp" onChange={e => handleFileChange(e, 'id_proof')} required /></div>
                      <div className="mb-2"><label className="form-label fw-bold small">Passport Size Photo *</label><input type="file" className="form-control form-control-sm" accept="image/jpeg,image/png" onChange={e => handleFileChange(e, 'photo')} required /></div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  {profile.courseName && (
                    <div className="alert alert-info mt-5 p-4 rounded-3 border-info">
                      <h5 className="fw-bold mb-3"><i className="fa fa-calculator me-2"></i>Payment Summary</h5>
                      <div className="d-flex justify-content-between mb-2"><span>Base Fees:</span><span>₹{feesData.baseFee}</span></div>
                      {profile.paymentType === 'installment' && <div className="d-flex justify-content-between mb-2 text-warning"><span>Installment Surcharge:</span><span>+ ₹2000</span></div>}
                      {isRegistered && <div className="d-flex justify-content-between mb-2 text-success"><span>Registration Fee Auto-Adjustment:</span><span>- ₹10,000</span></div>}
                      <hr/>
                      <div className="d-flex justify-content-between mb-2 fw-bold"><span>Total Fees Payable:</span><span>₹{feesData.totalFees}</span></div>
                      <div className="d-flex justify-content-between mb-2 fs-5 text-dark fw-bold"><span>Amount Paying Now:</span><span>₹{feesData.amountPayingNow}</span></div>
                      {feesData.remainingFees > 0 && <div className="d-flex justify-content-between mb-2 text-danger"><span>Remaining Balance:</span><span>₹{feesData.remainingFees}</span></div>}
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="btn w-100 py-3 mt-4 fw-bold fs-5 rounded-3 shadow text-white" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span> Processing securely...</> : `Proceed to Pay ₹${feesData.amountPayingNow}`}
                  </button>
                </form>
              )}

        {step === 3 && paymentResult && (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="fa fa-check-circle text-success" style={{ fontSize: '80px' }}></i>
            </div>
            <h2 className="fw-bold text-dark mb-2">Enrollment Successful!</h2>
            <p className="text-muted fs-5 mb-3">Welcome to Clinidea Education, <strong>{paymentResult.studentName}</strong>.</p>
            
            <div className="alert alert-success fw-bold fs-6 mx-auto mb-5 shadow-sm" style={{maxWidth: '600px'}}>
              Your payment has been successfully processed. Your official payment slip and certificate (if applicable) will be emailed to you shortly.
            </div>
                  
                  <div className="card border-success border-2 shadow-sm mb-5 text-start mx-auto" style={{maxWidth: '500px'}}>
                    <div className="card-header bg-success text-white fw-bold py-3"><i className="fa fa-receipt me-2"></i>Transaction Details</div>
                    <div className="card-body p-4">
                      <p className="mb-2"><strong>Course:</strong> {paymentResult.courseName}</p>
                      <p className="mb-2"><strong>Transaction ID:</strong> {paymentResult.transactionId}</p>
                      <p className="mb-2"><strong>Total Fees:</strong> ₹{paymentResult.totalFees}</p>
                      <p className="mb-2 text-success fw-bold"><strong>Amount Paid:</strong> ₹{paymentResult.amountPaid}</p>
                      {paymentResult.remainingFees > 0 && <p className="mb-0 text-danger fw-bold"><strong>Remaining Balance:</strong> ₹{paymentResult.remainingFees}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button onClick={() => navigate('/dashboard')} className="btn btn-primary px-5 py-3 fw-bold rounded-pill shadow-lg">Go to Student Dashboard <i className="fa fa-arrow-right ms-1"></i></button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;
