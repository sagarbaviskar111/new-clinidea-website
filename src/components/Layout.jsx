import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const isInternalRoute = 
    path.startsWith('/admin') || 
    path.startsWith('/mentor') || 
    path.startsWith('/dashboard') || 
    path.startsWith('/student/lms') || 
    path.startsWith('/studentcoordinator') ||
    path.startsWith('/watch') || 
    path.startsWith('/live') ||
    path.startsWith('/login') ||
    path.startsWith('/student/login') ||
    path.startsWith('/register') ||
    path.startsWith('/enroll');

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isInternalRoute && <Navbar />}
      
      <main className="main-content" style={{ flexGrow: 1 }}>
        {children}
      </main>

      {!isInternalRoute && <Footer />}
    </div>
  );
};

export default Layout;
