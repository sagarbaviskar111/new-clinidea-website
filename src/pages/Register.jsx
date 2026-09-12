import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { BASE_URL } from '../config';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    course: '',
    city: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [receiptUrl, setReceiptUrl] = useState(null);
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

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialCourse = params.get('course');
    if (initialCourse) {
      setFormData(prev => ({ ...prev, course: initialCourse }));
      setInitialCourseSet(true);
    }
  }, []);

  const handleProceedToPay = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Front-end validation checks
    if(formData.phone.length < 10) {
       setError("Please enter a valid phone number.");
       return;
    }
    if(formData.password.length < 6) {
       setError("Password must be at least 6 characters.");
       return;
    }
    if(!formData.course) {
       setError("Please select a course.");
       return;
    }

    setLoading(true);
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setError("Failed to load Razorpay. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order
      const res = await fetch(`${BASE_URL}/api/auth/register-fee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 2. Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: data.amount,
        currency: "INR",
        name: "Clinidea Education",
        description: "Registration Fee",
        order_id: data.orderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch(`${BASE_URL}/api/auth/verify-registration`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userDetails: data.userDetails
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error);
            
            setSuccess(true);
            setStep(3);
            window.scrollTo(0,0);
          } catch (err) {
            setError(err.message);
          }
        },
        prefill: {
          name: formData.full_name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: "#4f46e5"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        setError("Payment failed: " + response.error.description);
      });
      paymentObject.open();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="d-flex align-items-center justify-content-center py-5 mt-5" style={{ minHeight: '100vh', background: 'var(--color-bg-light)' }}>
      <Helmet>
        <title>Student Registration | Clinidea Education</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="p-4 p-md-5 bg-white rounded-4 shadow-lg mx-3" style={{ maxWidth: '500px', width: '100%' }}>
        
        {step === 1 && !success && (
          <>
            <div className="text-center mb-4">
              <h2 style={{ fontWeight: '800', color: 'var(--color-primary)' }}>Register Now</h2>
              <p className="text-muted">Start your educational journey with Clinidea</p>
            </div>
            
            {error && <div className="alert alert-danger p-3 text-center fw-bold">{error}</div>}
            
            <form onSubmit={handleProceedToPay}>
              <div className="mb-3">
                <label className="form-label fw-bold">Full Name</label>
                <input 
                  type="text" 
                  name="full_name"
                  className="form-control p-3 bg-light border-0" 
                  placeholder="e.g. Jane Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-control p-3 bg-light border-0" 
                  placeholder="jane@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Mobile Number</label>
                <PhoneInput
                  country={'in'}
                  value={formData.phone}
                  onChange={(value, country, e, formattedValue) => setFormData({ ...formData, phone: formattedValue })}
                  inputClass="form-control bg-light border-0"
                  buttonClass="bg-light border-0"
                  containerClass="w-100"
                  inputStyle={{ width: '100%', height: '58px', fontSize: '1rem', paddingLeft: '48px', borderRadius: '0.375rem' }}
                  buttonStyle={{ borderRadius: '0.375rem 0 0 0.375rem', width: '40px', padding: '0 5px' }}
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Select Course</label>
                {initialCourseSet ? (
                  <input 
                    type="text"
                    name="course" 
                    className="form-control p-3 bg-light border-0 fw-bold" 
                    value={formData.course} 
                    readOnly
                    title="Course is automatically selected based on navigation."
                  />
                ) : (
                  <select 
                    name="course" 
                    className="form-select p-3 bg-light border-0" 
                    value={formData.course} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="" disabled>Select a Course</option>
                    <option value="Clinical Research & Pharmacovigilance">Clinical Research & Pharmacovigilance</option>
                    <option value="Clinical Research & Data Management">Clinical Research & Data Management</option>
                    <option value="Clinical Research, Pharmacovigilance & Data Management">Clinical Research, Pharmacovigilance & Data Management</option>
                    <option value="Clinical Research & Regulatory Affairs">Clinical Research & Regulatory Affairs</option>
                    <option value="Clinical Research & Medical Writing">Clinical Research & Medical Writing</option>
                    <option value="Clinical Research and Medical Coding">Clinical Research and Medical Coding</option>
                  </select>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">City</label>
                <input 
                  type="text" 
                  name="city"
                  className="form-control p-3 bg-light border-0" 
                  placeholder="e.g. Pune"
                  value={formData.city}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-bold">Set Password</label>
                <input 
                  type="password" 
                  name="password"
                  className="form-control p-3 bg-light border-0" 
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="alert alert-info border-0 rounded-3 text-center mb-4">
                <h6 className="fw-bold mb-1">Registration Fee: ₹10,000</h6>
                <p className="small mb-0 text-muted">Complete this one-time payment to confirm your seat securely.</p>
              </div>

              <button 
                type="submit" 
                className="btn w-100 py-3 fw-bold fs-5 text-white shadow-sm" 
                style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', border: 'none' }} 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Pay ₹10,000'}
              </button>

              <div className="text-center mt-4">
                <p className="text-muted">Already have an account? <Link to="/login" className="fw-bold text-decoration-none" style={{color: 'var(--color-secondary)'}}>Login here</Link></p>
              </div>
            </form>
          </>
        )}

        {step === 3 && success && (
          <div className="text-center py-4">
            <div className="mb-4">
              <div className="d-inline-flex align-items-center justify-content-center bg-theme-secondary text-white rounded-circle mb-3 shadow-sm" style={{ width: '80px', height: '80px' }}>
                <i className="fa fa-check fa-3x"></i>
              </div>
              <h2 className="fw-bold text-dark">Registration Successful!</h2>
            </div>

            <div className="alert alert-success border-0 bg-light rounded-4 text-center p-4 mb-4 shadow-sm">
              <p className="mb-0 fw-bold text-dark">Welcome to Clinidea Education.</p>
              <p className="mb-0 mt-2 text-muted small">Your payment has been successfully processed and your account is active.</p>
            </div>

            <div className="card border-0 bg-light rounded-4 text-start p-3 mb-4 shadow-sm small">
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-muted fw-bold">Student Name:</span>
                <span className="fw-bold">{formData.full_name}</span>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-muted fw-bold">Amount Paid:</span>
                <span className="fw-bold text-theme-secondary">₹10,000</span>
              </div>
            </div>

            <button 
              onClick={() => {
                const text = encodeURIComponent(`Hi Clinidea, I have successfully registered and paid! My name is ${formData.full_name}.`);
                window.open(`https://wa.me/918999213129?text=${text}`, '_blank');
                setTimeout(() => navigate('/login'), 500);
              }}
              className="btn w-100 py-3 fw-bold fs-5 mb-3" 
              style={{ borderRadius: '12px', border: '2px solid #25D366', color: '#25D366', background: 'transparent', transition: 'all 0.3s ease' }}
            >
              Say Hi on WhatsApp <i className="fa fa-whatsapp ms-2"></i>
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="btn w-100 py-3 fw-bold fs-5 text-white shadow-sm" 
              style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', border: 'none' }}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
