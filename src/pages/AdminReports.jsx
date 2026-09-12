import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import * as XLSX from 'xlsx';

const AdminReports = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState('student_performance');

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const reportOptions = [
    { id: 'student_performance', name: '1. Student Performance Report', icon: 'fa-user-graduate' },
    { id: 'student_attendance', name: '2. Student Attendance Report', icon: 'fa-user-check' },
    { id: 'student_fees', name: '3. Student Fees Report', icon: 'fa-wallet' },
    { id: 'student_assignments', name: '4. Student Assignments Report', icon: 'fa-tasks' },
    { id: 'student_exams', name: '5. Student Exams Report', icon: 'fa-file-alt' },
    { id: 'mentor_performance', name: '6. Mentor Performance Report', icon: 'fa-chalkboard-teacher' },
    { id: 'mentor_payments', name: '7. Mentor Payments Report', icon: 'fa-money-bill-wave' },
    { id: 'coordinator_performance', name: '8. Coordinator Performance Report', icon: 'fa-user-tie' },
    { id: 'coordinator_payments', name: '9. Coordinator Payments Report', icon: 'fa-hand-holding-usd' },
    { id: 'lead_conversion', name: '10. Lead Conversion Report', icon: 'fa-chart-line' },
    { id: 'batch_performance', name: '11. Batch Performance Report', icon: 'fa-layer-group' },
    { id: 'course_performance', name: '12. Course Performance Report', icon: 'fa-book-open' },
    { id: 'certificate_status', name: '13. Certificate Status Report', icon: 'fa-certificate' }
  ];

  const handleExportCSV = () => {
    alert(`Exporting ${activeReportTab.toUpperCase()} Report as CSV...`);
  };

  const handleExportExcel = () => {
    const sampleData = [
      { ID: 1, Name: 'Aarav Patel', Course: 'Clinical Research & PV', Batch: 'CR-PV-2026A', Status: 'Active', Metric: '95%' },
      { ID: 2, Name: 'Sneha Deshmukh', Course: 'Pharmacovigilance', Batch: 'PV-2026B', Status: 'Active', Metric: '88%' }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `Clinidea_${activeReportTab}_report.xlsx`);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="admin-content flex-grow-1 p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center">
            <button className="admin-mobile-toggle me-3 mb-0" onClick={() => setMobileOpen(true)}>
              <i className="fa fa-bars"></i>
            </button>
            <div>
              <h2 className="mb-0 fw-bold" style={{ color: 'var(--admin-primary)' }}>Reporting & Analytics Engine</h2>
              <p className="text-muted small mb-0">Server-side aggregated performance, fee, attendance & operations reports</p>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary rounded-pill px-3 py-2 fw-bold" onClick={handleExportCSV}>
              <i className="fas fa-file-csv me-1 text-success"></i> CSV
            </button>
            <button className="btn btn-outline-success rounded-pill px-3 py-2 fw-bold" onClick={handleExportExcel}>
              <i className="fas fa-file-excel me-1"></i> Excel (.xlsx)
            </button>
            <button className="btn btn-primary rounded-pill px-3 py-2 fw-bold" onClick={handleExportPDF}>
              <i className="fas fa-file-pdf me-1"></i> PDF Report
            </button>
          </div>
        </div>

        {/* Report Selector Dropdown & Filter Bar */}
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4" style={{ border: '1px solid #e2e8f0' }}>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-bold small text-muted text-uppercase">Select Active Report</label>
              <select 
                className="form-select form-select-lg rounded-3 fw-bold border-primary"
                value={activeReportTab}
                onChange={(e) => setActiveReportTab(e.target.value)}
              >
                {reportOptions.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold small text-muted text-uppercase">Start Date</label>
              <input type="date" className="form-control rounded-3" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold small text-muted text-uppercase">End Date</label>
              <input type="date" className="form-control rounded-3" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold small text-muted text-uppercase">Course</label>
              <select className="form-select rounded-3" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                <option value="all">All Courses</option>
                <option value="cr-pv">Clinical Research & PV</option>
                <option value="cr-pv-cdm">CR-PV-CDM Combo</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-bold small text-muted text-uppercase">Status Filter</label>
              <select className="form-select rounded-3" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Report Table Card */}
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4" style={{ border: '1px solid #e2e8f0' }}>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="fw-bold text-dark mb-0">
              <i className={`fas ${reportOptions.find(r => r.id === activeReportTab)?.icon} text-primary me-2`}></i>
              {reportOptions.find(r => r.id === activeReportTab)?.name}
            </h4>
            <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 rounded-pill">
              <i className="fas fa-database me-1"></i> Server-side Aggregated Data
            </span>
          </div>

          <div className="table-responsive">
            <table className="table align-middle table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Entity / ID</th>
                  <th>Primary Name</th>
                  <th>Batch / Module</th>
                  <th>Key Performance Metric</th>
                  <th>Financial / Fee Status</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fw-bold font-monospace">STU-1001</td>
                  <td className="fw-bold text-dark">Aarav Patel</td>
                  <td>CR-PV-2026A</td>
                  <td><span className="badge bg-primary">95% Attendance | 88% Exam Score</span></td>
                  <td className="fw-bold text-success">₹45,000 Paid (100%)</td>
                  <td><span className="badge bg-success">Active / Enrolled</span></td>
                </tr>
                <tr>
                  <td className="fw-bold font-monospace">STU-1002</td>
                  <td className="fw-bold text-dark">Sneha Deshmukh</td>
                  <td>PV-2026B</td>
                  <td><span className="badge bg-info">82% Attendance | 78% Exam Score</span></td>
                  <td className="fw-bold text-warning">₹25,000 Paid (Installment 2 Due)</td>
                  <td><span className="badge bg-success">Active / Enrolled</span></td>
                </tr>
                <tr>
                  <td className="fw-bold font-monospace">MTR-2001</td>
                  <td className="fw-bold text-dark">Prof. Ramesh Kumar</td>
                  <td>2 Assigned Batches</td>
                  <td><span className="badge bg-success">24 Sessions Taken | 1 Cancelled</span></td>
                  <td className="fw-bold text-primary">₹12,000 Pending Payout</td>
                  <td><span className="badge bg-info">Active Mentor</span></td>
                </tr>
                <tr>
                  <td className="fw-bold font-monospace">CRD-3001</td>
                  <td className="fw-bold text-dark">Priya Sharma</td>
                  <td>CRM Pipeline</td>
                  <td><span className="badge bg-warning text-dark">120 Contacts | 14 Enrolled (11.6%)</span></td>
                  <td className="fw-bold text-warning">₹3,500 Commission Pending</td>
                  <td><span className="badge bg-info">Active Coordinator</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
