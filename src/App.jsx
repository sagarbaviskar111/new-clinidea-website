import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './portal-theme.css';

const About = lazy(() => import('./pages/About'));
const ClinicalResearchCrPvDm = lazy(() => import('./pages/ClinicalResearchCrPvDm'));
const ClinicalResearchMedicalWriting = lazy(() => import('./pages/ClinicalResearchMedicalWriting'));
const ClinicalResearchPharmacovigilance = lazy(() => import('./pages/ClinicalResearchPharmacovigilance'));
const ClinicalResearchRegulatoryAffairs = lazy(() => import('./pages/ClinicalResearchRegulatoryAffairs'));
const Contact = lazy(() => import('./pages/Contact'));
const ClinicalResearchDataManagement = lazy(() => import('./pages/ClinicalResearchDataManagement'));
const ClinicalResearchMedicalCoding = lazy(() => import('./pages/ClinicalResearchMedicalCoding'));
const HomePage = lazy(() => import('./pages/HomePage'));
const Program = lazy(() => import('./pages/Program'));
const ThankYou = lazy(() => import('./pages/ThankYou'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLeads = lazy(() => import('./pages/AdminLeads'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminStudents = lazy(() => import('./pages/AdminStudents'));
const AdminCourses = lazy(() => import('./pages/AdminCourses'));
const AdminBatches = lazy(() => import('./pages/AdminBatches'));
const AdminSessions = lazy(() => import('./pages/AdminSessions'));
const AdminEnrollments = lazy(() => import('./pages/AdminEnrollments'));
const AdminEvents = lazy(() => import('./pages/AdminEvents'));
const AdminFinance = lazy(() => import('./pages/AdminFinance'));
const AdminBlogs = lazy(() => import('./pages/AdminBlogs'));
const AdminCoupons = lazy(() => import('./pages/AdminCoupons'));
const AdminStudentPortfolios = lazy(() => import('./pages/AdminStudentPortfolios'));
const AdminTestimonials = lazy(() => import('./pages/AdminTestimonials'));
const AdminPlacements = lazy(() => import('./pages/AdminPlacements'));
const AdminReviewVideos = lazy(() => import('./pages/AdminReviewVideos'));
const AdminCMS = lazy(() => import('./pages/AdminCMS'));
const AdminHREmailAccounts = lazy(() => import('./pages/AdminHREmailAccounts'));
const AdminHRDatabase = lazy(() => import('./pages/AdminHRDatabase'));
const AdminHRCampaigns = lazy(() => import('./pages/AdminHRCampaigns'));
const AdminHRCampaignDetail = lazy(() => import('./pages/AdminHRCampaignDetail'));
const AdminLMS = lazy(() => import('./pages/AdminLMS'));
const AdminRoleManagement = lazy(() => import('./pages/AdminRoleManagement'));
const AdminStudentManagement = lazy(() => import('./pages/AdminStudentManagement'));
const AdminMentorManagement = lazy(() => import('./pages/AdminMentorManagement'));
const AdminCoordinatorManagement = lazy(() => import('./pages/AdminCoordinatorManagement'));
const AdminReports = lazy(() => import('./pages/AdminReports'));
const AdminCertificates = lazy(() => import('./pages/AdminCertificates'));
const Register = lazy(() => import('./pages/Register'));
const StudentPortfolioEdit = lazy(() => import('./pages/StudentPortfolioEdit'));
const PublicStudentPortfolio = lazy(() => import('./pages/PublicStudentPortfolio'));
const Login = lazy(() => import('./pages/Login'));
const EnrollmentForm = lazy(() => import('./pages/EnrollmentForm'));
const MentorLogin = lazy(() => import('./pages/MentorLogin'));
const MentorDashboard = lazy(() => import('./pages/MentorDashboard'));
const CoordinatorLogin = lazy(() => import('./pages/CoordinatorLogin'));
const CoordinatorDashboard = lazy(() => import('./pages/CoordinatorDashboard'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const CertificateVerification = lazy(() => import('./pages/CertificateVerification'));

const Events = lazy(() => import('./pages/Events'));
const TakeQuiz = lazy(() => import('./pages/TakeQuiz'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const PlacementsPage = lazy(() => import('./pages/PlacementsPage'));

const RegisterInstructions = lazy(() => import('./pages/RegisterInstructions'));

import ScrollToTop from './components/ScrollToTop';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MentorRoute from './components/MentorRoute';
import CoordinatorRoute from './components/CoordinatorRoute';
import GlobalPopups from './components/GlobalPopups';
import Layout from './components/Layout';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
      <Suspense fallback={<div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',fontSize:'1.5rem',color:'#667eea',fontFamily:'sans-serif'}}>Loading Clinical Programs...</div>}>
        <GlobalPopups />
        <Layout>
          <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/clinical-research-cr-pv-dm-course" element={<ClinicalResearchCrPvDm />} />
          <Route path="/clinical-research-medical-writing-course" element={<ClinicalResearchMedicalWriting />} />
          <Route path="/clinical-research-pharmacovigilance-course" element={<ClinicalResearchPharmacovigilance />} />
          <Route path="/clinical-research-regulatory-affairs-course" element={<ClinicalResearchRegulatoryAffairs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/clinical-research-data-management-course" element={<ClinicalResearchDataManagement />} />
          <Route path="/clinical-research-medical-coding-course" element={<ClinicalResearchMedicalCoding />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/index" element={<HomePage />} />
          <Route path="/index.html" element={<HomePage />} />
          <Route path="/program" element={<Program />} />
          <Route path="/thank-you" element={<ThankYou />} />

          <Route path="/events" element={<Events />} />
          <Route path="/take-quiz/:id" element={<TakeQuiz />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/placements" element={<PlacementsPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/Login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/leads" element={<AdminRoute><AdminLeads /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/students-management" element={<AdminRoute><AdminStudentManagement /></AdminRoute>} />
          <Route path="/admin/students" element={<AdminRoute><AdminStudents /></AdminRoute>} />
          <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
          <Route path="/admin/batches" element={<AdminRoute><AdminBatches /></AdminRoute>} />
          <Route path="/admin/sessions" element={<Navigate to="/admin/lms" replace />} />
          <Route path="/admin/enrollments" element={<AdminRoute><AdminEnrollments /></AdminRoute>} />
          <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
          <Route path="/admin/finance" element={<AdminRoute><AdminFinance /></AdminRoute>} />
          <Route path="/admin/blogs" element={<AdminRoute><AdminBlogs /></AdminRoute>} />
          <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
          <Route path="/admin/student-portfolios" element={<AdminRoute><AdminStudentPortfolios /></AdminRoute>} />
          <Route path="/admin/testimonials" element={<AdminRoute><AdminTestimonials /></AdminRoute>} />
          <Route path="/admin/placements" element={<AdminRoute><AdminPlacements /></AdminRoute>} />
          <Route path="/admin/review-videos" element={<AdminRoute><AdminReviewVideos /></AdminRoute>} />
          <Route path="/admin/cms" element={<AdminRoute><AdminCMS /></AdminRoute>} />
          <Route path="/admin/hr-email-accounts" element={<AdminRoute><AdminHREmailAccounts /></AdminRoute>} />
          <Route path="/admin/hr-database" element={<AdminRoute><AdminHRDatabase /></AdminRoute>} />
          <Route path="/admin/hr-campaigns" element={<AdminRoute><AdminHRCampaigns /></AdminRoute>} />
          <Route path="/admin/hr-campaigns/:id" element={<AdminRoute><AdminHRCampaignDetail /></AdminRoute>} />
          <Route path="/admin/lms" element={<AdminRoute><AdminLMS /></AdminRoute>} />
          <Route path="/admin/roles" element={<AdminRoute><AdminRoleManagement /></AdminRoute>} />
          <Route path="/admin/mentor-management" element={<AdminRoute><AdminMentorManagement /></AdminRoute>} />
          <Route path="/admin/coordinator-management" element={<AdminRoute><AdminCoordinatorManagement /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
          <Route path="/admin/certificates" element={<AdminRoute><AdminCertificates /></AdminRoute>} />
          
          <Route path="/mentor/login" element={<MentorLogin />} />
          <Route path="/mentor/Login" element={<MentorLogin />} />
          <Route path="/mentor/dashboard" element={<MentorRoute><MentorDashboard /></MentorRoute>} />
          
          <Route path="/studentcoordinator/login" element={<CoordinatorLogin />} />
          <Route path="/studentcoordinator/Login" element={<CoordinatorLogin />} />
          <Route path="/studentcoordinator/dashboard" element={<CoordinatorRoute><CoordinatorDashboard /></CoordinatorRoute>} />

          <Route path="/certificate/verify/:certificateId" element={<CertificateVerification />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student/portfolio" element={<ProtectedRoute><StudentPortfolioEdit /></ProtectedRoute>} />
          <Route path="/student-portfolio/:studentId" element={<PublicStudentPortfolio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student/Login" element={<Login />} />
          <Route path="/student/login" element={<Login />} />
          <Route path="/register-instructions" element={<ProtectedRoute><RegisterInstructions /></ProtectedRoute>} />
          <Route path="/enroll" element={<ProtectedRoute><EnrollmentForm /></ProtectedRoute>} />
        </Routes>
        </Layout>
      </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;
