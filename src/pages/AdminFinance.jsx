import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../config';
import AdminSidebar from '../components/AdminSidebar';

const AdminFinance = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState({ summary: {}, expenses: [], additionalIncomes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [expenseForm, setExpenseForm] = useState({ title: '', category: 'Salary', amount: '', description: '' });
  const [incomeForm, setIncomeForm] = useState({ title: '', amount: '', description: '' });

  const categories = ['Salary', 'Marketing & Ads', 'Server & Hosting', 'Software Subscriptions', 'Office Rent', 'Miscellaneous'];

  const fetchFinanceData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/finance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setError(json.error || "Failed to load finance data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/finance/expense`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expenseForm)
      });
      const json = await res.json();
      if (json.success) {
        setShowExpenseModal(false);
        setExpenseForm({ title: '', category: 'Salary', amount: '', description: '' });
        fetchFinanceData();
      } else {
        alert(json.error || "Failed to add expense");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${BASE_URL}/api/admin/finance/income`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(incomeForm)
      });
      const json = await res.json();
      if (json.success) {
        setShowIncomeModal(false);
        setIncomeForm({ title: '', amount: '', description: '' });
        fetchFinanceData();
      } else {
        alert(json.error || "Failed to add income");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="p-5 text-center text-danger"><h5>{error}</h5></div>;

  const { summary, expenses, additionalIncomes } = data;

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content">
        <div className="finance-header-block d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div>
              <div className="d-flex align-items-center mb-4">
          <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
            <i className="fa fa-bars"></i>
          </button>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--admin-primary)', fontFamily: 'Outfit, sans-serif' }}>Financial Dashboard</h2>
        </div>
              <p className="text-muted mb-3 mb-md-0">Manage and track your institute's finances</p>
            </div>
            <div className="d-flex gap-3">
              <button className="btn btn-premium-success fw-bold px-4 py-2" onClick={() => setShowIncomeModal(true)}>
                <i className="fa fa-plus me-2"></i> Add Income
              </button>
              <button className="btn btn-premium-danger fw-bold px-4 py-2" onClick={() => setShowExpenseModal(true)}>
                <i className="fa fa-minus me-2"></i> Add Expense
              </button>
            </div>
          </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="finance-stat-card p-4 h-100 text-white" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
            <i className="fa fa-arrow-trend-up finance-icon-bg"></i>
            <h5 className="finance-stat-title">Total Revenue</h5>
            <h2 className="finance-stat-value mb-1">₹{summary?.totalIncome?.toLocaleString('en-IN') || 0}</h2>
            <div className="mt-3 opacity-75 small fw-semibold">
              <div className="d-flex justify-content-between border-bottom border-light border-opacity-25 pb-1 mb-1">
                <span>Registrations</span> <span>₹{summary?.registrationIncome?.toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom border-light border-opacity-25 pb-1 mb-1">
                <span>Enrollments</span> <span>₹{summary?.enrollmentIncome?.toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Additional</span> <span>₹{summary?.additionalIncomeTotal?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="finance-stat-card p-4 h-100 text-white" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}>
            <i className="fa fa-arrow-trend-down finance-icon-bg"></i>
            <h5 className="finance-stat-title">Total Expenses</h5>
            <h2 className="finance-stat-value mb-1">₹{summary?.expenseTotal?.toLocaleString('en-IN') || 0}</h2>
            <div className="mt-3 opacity-75 small fw-semibold">
              <p className="mb-0">Based on manually logged expenses inside the system.</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="finance-stat-card p-4 h-100 text-white" style={{ background: (summary?.netProfit >= 0) ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)' }}>
            <i className="fa fa-wallet finance-icon-bg"></i>
            <h5 className="finance-stat-title">Net {summary?.netProfit >= 0 ? 'Profit' : 'Loss'}</h5>
            <h2 className="finance-stat-value mb-1">₹{Math.abs(summary?.netProfit || 0).toLocaleString('en-IN')}</h2>
            <div className="mt-3 opacity-75 small fw-semibold">
              <p className="mb-0">Current Financial Standing overall.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Expenses Table */}
        <div className="col-lg-6">
          <div className="modern-table-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>Recent Expenses</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="ps-4">Title & Category</th>
                      <th>Date</th>
                      <th className="text-end pe-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.length === 0 ? (
                      <tr><td colSpan="3" className="text-center text-muted py-4">No expenses recorded yet.</td></tr>
                    ) : expenses.map(exp => (
                      <tr key={exp.id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center">
                            <div className="avatar-icon bg-soft-danger">
                              <i className="fa fa-minus"></i>
                            </div>
                            <div>
                              <div className="fw-bold text-dark">{exp.title}</div>
                              <div className="small text-muted fw-medium">{exp.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted fw-medium">{new Date(exp.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="text-end pe-4 fw-bold text-danger">- ₹{exp.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Income Table */}
        <div className="col-lg-6">
          <div className="modern-table-card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#0F172A', fontFamily: 'Outfit, sans-serif' }}>Additional Income</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="ps-4">Title</th>
                      <th>Date</th>
                      <th className="text-end pe-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {additionalIncomes.length === 0 ? (
                      <tr><td colSpan="3" className="text-center text-muted py-4">No additional income recorded yet.</td></tr>
                    ) : additionalIncomes.map(inc => (
                      <tr key={inc.id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center">
                            <div className="avatar-icon bg-soft-success">
                              <i className="fa fa-plus"></i>
                            </div>
                            <div>
                              <div className="fw-bold text-dark">{inc.title}</div>
                              {inc.description && <div className="small text-muted fw-medium text-truncate" style={{ maxWidth: '150px' }}>{inc.description}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="text-muted fw-medium">{new Date(inc.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="text-end pe-4 fw-bold text-success">+ ₹{inc.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="modal show d-block modal-premium" style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-white border-bottom text-dark">
                <h5 className="modal-title fw-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>Log New Expense</h5>
                <button type="button" className="btn-close" onClick={() => setShowExpenseModal(false)}></button>
              </div>
              <form onSubmit={handleAddExpense}>
                <div className="modal-body bg-white">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Expense Title</label>
                    <input type="text" className="form-control" placeholder="e.g. Server Invoice May" value={expenseForm.title} onChange={e => setExpenseForm({...expenseForm, title: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Category</label>
                    <select className="form-select" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})} required>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Amount (₹)</label>
                    <input type="number" className="form-control" placeholder="0" min="1" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Description (Optional)</label>
                    <textarea className="form-control" rows="2" placeholder="Any specific details..." value={expenseForm.description} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary px-4 fw-bold" onClick={() => setShowExpenseModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-premium-danger px-4 fw-bold" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Income Modal */}
      {showIncomeModal && (
        <div className="modal show d-block modal-premium" style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-white border-bottom text-dark">
                <h5 className="modal-title fw-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>Log Additional Income</h5>
                <button type="button" className="btn-close" onClick={() => setShowIncomeModal(false)}></button>
              </div>
              <form onSubmit={handleAddIncome}>
                <div className="modal-body bg-white">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Income Source / Title</label>
                    <input type="text" className="form-control" placeholder="e.g. Offline Consultation" value={incomeForm.title} onChange={e => setIncomeForm({...incomeForm, title: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Amount (₹)</label>
                    <input type="number" className="form-control" placeholder="0" min="1" value={incomeForm.amount} onChange={e => setIncomeForm({...incomeForm, amount: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Description (Optional)</label>
                    <textarea className="form-control" rows="2" placeholder="Any specific details..." value={incomeForm.description} onChange={e => setIncomeForm({...incomeForm, description: e.target.value})}></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary px-4 fw-bold" onClick={() => setShowIncomeModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-premium-success px-4 fw-bold" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Income'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminFinance;
