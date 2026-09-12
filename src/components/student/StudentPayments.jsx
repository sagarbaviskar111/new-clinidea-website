import React, { useState } from 'react';
import { BASE_URL } from '../../config';

const StudentPayments = ({ payments, fetchDashboardData }) => {
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handlePayment = async (payment) => {
    setProcessingId(payment.id);
    setMessage({ text: '', type: '' });
    try {
      const token = localStorage.getItem('userToken');
      // 1. Create Razorpay order
      const res = await fetch(`${BASE_URL}/api/student/pay-installment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentId: payment.id })
      });
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Failed to initiate payment');

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Clinidea Education',
        description: `Installment for ${payment.courseName}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch(`${BASE_URL}/api/student/verify-installment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                ...response,
                paymentId: orderData.paymentId
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.error || 'Verification failed');
            
            setMessage({ text: 'Payment successful!', type: 'success' });
            fetchDashboardData();
          } catch (err) {
            setMessage({ text: err.message, type: 'danger' });
          }
        },
        prefill: {
          name: orderData.userName,
          email: orderData.userEmail,
          contact: orderData.userPhone
        },
        theme: {
          color: '#4f46e5'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setMessage({ text: 'Payment failed: ' + response.error.description, type: 'danger' });
      });
      rzp.open();

    } catch (error) {
      setMessage({ text: error.message, type: 'danger' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDownloadReceipt = async (payment) => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${BASE_URL}/api/student/payment-receipt/${payment.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to download receipt');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt_${payment.receiptNumber || payment.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage({ text: err.message, type: 'danger' });
    }
  };

  const handleDownloadFileUrl = async (fileUrl, payment) => {
    try {
      const res = await fetch(`${BASE_URL}${fileUrl}`);
      if (!res.ok) throw new Error('Failed to download receipt');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt_${payment.transactionId || payment.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage({ text: "Could not download file. Please try again.", type: 'danger' });
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card-premium h-100">
          <div className="card-header bg-white border-0 p-4" style={{ borderBottom: '1px solid var(--color-border) !important' }}>
            <h4 className="heading-premium text-dark mb-0"><i className="fa fa-file-invoice-dollar text-success me-2"></i> Fees & Payments</h4>
          </div>
          <div className="card-body p-4 bg-light">
            
            {message.text && (
              <div className={`alert alert-${message.type} fw-bold shadow-sm`}>{message.text}</div>
            )}

            {payments.length === 0 ? <p className="text-muted text-center py-4">No payment history or pending dues.</p> : (
              <div className="d-flex flex-column gap-3">
                {payments.map(pay => {
                  const isOverdue = pay.paymentStatus === 'pending' && new Date(pay.dueDate) < new Date();
                  
                  return (
                    <div key={pay.id} className={`p-3 border rounded-3 d-flex flex-column flex-md-row justify-content-between align-items-center bg-white shadow-sm ${isOverdue ? 'border-danger' : ''}`}>
                      <div className="w-100 mb-3 mb-md-0">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6 className="heading-premium text-dark mb-0">₹{pay.amount}</h6>
                          {pay.paymentStatus === 'paid' ? (
                            <span className="badge bg-success">Paid</span>
                          ) : isOverdue ? (
                            <span className="badge bg-danger">Overdue</span>
                          ) : (
                            <span className="badge bg-warning text-dark">Pending</span>
                          )}
                        </div>
                        <div className="text-muted small fw-bold">{pay.courseName}</div>
                        {pay.paymentStatus === 'paid' ? (
                          <div className="small text-muted mt-1">Paid on: {new Date(pay.paymentDate).toLocaleDateString()} via {pay.paymentMethod || 'Online'}</div>
                        ) : (
                          <div className={`small mt-1 fw-bold ${isOverdue ? 'text-danger' : 'text-muted'}`}>
                            Due Date: {pay.dueDate ? new Date(pay.dueDate).toLocaleDateString() : 'N/A'}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0 ms-md-3 text-end w-100 w-md-auto">
                        {pay.paymentStatus === 'pending' ? (
                          <button 
                            className="btn btn-primary fw-bold w-100 w-md-auto"
                            onClick={() => handlePayment(pay)}
                            disabled={processingId === pay.id}
                          >
                            {processingId === pay.id ? 'Processing...' : 'Pay Securely'}
                          </button>
                        ) : (
                          <>
                            {/* If there's an uploaded fileUrl from old system, use it. Otherwise use new receipt logic */}
                            {pay.fileUrl ? (
                              <button onClick={() => handleDownloadFileUrl(pay.fileUrl, pay)} className="btn btn-outline-secondary btn-sm fw-bold w-100 w-md-auto">
                                <i className="fa fa-download me-1"></i> Download Receipt
                              </button>
                            ) : (
                              <button onClick={() => handleDownloadReceipt(pay)} className="btn btn-outline-success btn-sm fw-bold w-100 w-md-auto">
                                <i className="fa fa-download me-1"></i> Download Receipt
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPayments;
