import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

const CheckoutPanel = ({ courseName }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (type) => {
    setError(null);
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert("You must be logged in to securely reserve your seat.");
      navigate('/login');
      return;
    }

    setLoading(true);
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setError("Failed to connect to secure payment gateway. Check your connection.");
      setLoading(false);
      return;
    }

    try {
      // Backend mapping to create the explicit order block (seat or full)
      const url = `${BASE_URL}/api/enrollment/create-order`;
      const payload = { course_name: courseName, type: type };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || "Failed to initialize payment");
      }

      // Initialize Razorpay UI overlay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.key, // Use VITE env or payload key
        amount: orderData.order.amount,
        currency: "INR",
        name: "Clinidea Education",
        description: `Enrollment: ${courseName}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verifyUrl = `${BASE_URL}/api/enrollment/verify-payment`;
            const verifyRes = await fetch(verifyUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                enrollment_id: orderData.enrollmentId
              })
            });
            
            if (verifyRes.ok) {
              setSuccess(true);
              
              // WhatsApp Automation for Payment
              const text = encodeURIComponent(`Hi Clinidea, I have successfully completed my payment for the ${courseName} course! My payment reference is ${response.razorpay_payment_id}.`);
              window.open(`https://wa.me/918999213129?text=${text}`, '_blank');

              // Trigger explicit redirect to complete form footprint
              setTimeout(() => {
                navigate('/enroll-process');
              }, 1500);
            } else {
              setError("Signature validation failed! Payment could not be secured.");
            }
          } catch (err) {
            setError("Network error occurred during verification.");
          }
        },
        prefill: {
          name: "Student Profile",
          email: "student@clinidea.local"
        },
        theme: {
          color: "var(--color-primary)"
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        setError(`Payment Failed: ${response.error.description}`);
      });

      paymentObject.open();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-lg border-0 rounded-4 bg-white p-5 text-center mt-5 mb-5 mx-auto" style={{ maxWidth: '800px' }}>
      <h3 className="fw-bold mb-3" style={{ color: 'var(--color-primary)' }}>Secure Your Enrollment</h3>
      <p className="text-muted mb-4 fs-5">Fast-track your career by reserving your seat in our upcoming clinical cohort immediately.</p>
      
      {error && <div className="alert alert-danger p-3 fw-bold">{error}</div>}
      {success && <div className="alert alert-success p-4 fw-bold fs-5 shadow-sm">Setup Complete! Your payment was verified cryptographically. Welcome to Clinidea!</div>}
      
      {!success && (
        <div className="d-flex flex-column flex-md-row gap-4 justify-content-center mt-3">
          <button 
            onClick={() => handlePayment('seat')}
            disabled={loading}
            className="btn btn-lg fw-bold px-5 py-3 shadow-sm border"
            style={{ borderRadius: '12px', background: '#e0e7ff', color: 'var(--color-secondary)' }}
          >
            {loading ? 'Routing...' : 'Reserve Seat (₹10,000)'}
          </button>
          
          <button 
            onClick={() => handlePayment('full')}
            disabled={loading}
            className="btn btn-lg text-white mx-0 fw-bold px-5 py-3 shadow-sm border-0"
            style={{ borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent) 100%)' }}
          >
            {loading ? 'Routing...' : 'Enroll Now (Full Payment)'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPanel;
