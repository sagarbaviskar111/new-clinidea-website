import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../admin.css';

const websiteLinks = [
  { path: '/admin/courses', label: 'Course master', icon: 'fa-book' },
  { path: '/admin/review-videos', label: 'Review videos', icon: 'fa-play-circle' },
  { path: '/admin/testimonials', label: 'Student reviews', icon: 'fa-quote-left' },
  { path: '/admin/placements', label: 'Placement records', icon: 'fa-trophy' },
  { path: '/admin/events', label: 'Events', icon: 'fa-calendar' },
  { path: '/admin/blogs', label: 'Blogs', icon: 'fa-newspaper-o' },
  { path: '/admin/coupons', label: 'Coupons', icon: 'fa-ticket' },
  { path: '/admin/student-portfolios', label: 'Student Portfolios', icon: 'fa-id-card' }
];

const primaryLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'fa-home' },
  { path: '/admin/users', label: 'Register students', icon: 'fa-user-plus' },
  { path: '/admin/batches', label: 'Batch management', icon: 'fa-th-large' },
  { path: '/admin/mentor-management', label: 'Mentor management', icon: 'fa-users' },
  { path: '/admin/coordinator-management', label: 'Coordinator management', icon: 'fa-user' },
  { path: '/admin/reports', label: 'Reports', icon: 'fa-bar-chart' },
  { path: '/admin/finance', label: 'Fees management', icon: 'fa-credit-card' },
  { path: '/admin/certificates', label: 'Certificates', icon: 'fa-certificate' },
  { path: '/admin/roles', label: 'Role credentials', icon: 'fa-key' }
];

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const websiteIsActive = websiteLinks.some(({ path }) => path === location.pathname);
  const [websiteMgmtOpen, setWebsiteMgmtOpen] = useState(websiteIsActive);

  const closeMobileMenu = () => setMobileOpen(false);
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    navigate('/admin/login');
  };

  return (
    <>
      <aside className={`admin-sidebar ${mobileOpen ? 'show' : ''}`} aria-label="Admin navigation">
        <div className="admin-sidebar__header">
          <Link to="/admin/dashboard" className="admin-sidebar__brand" onClick={closeMobileMenu}>
            <span className="admin-sidebar__brand-mark"><i className="fa fa-plus" /></span>
            <span><strong>Clinidea</strong><small>Administration</small></span>
          </Link>
          <button type="button" className="admin-sidebar__close d-lg-none" onClick={closeMobileMenu} aria-label="Close navigation"><i className="fa fa-times" /></button>
        </div>

        <nav className="admin-sidebar__nav">
          <p className="admin-sidebar__label">Workspace</p>
          {primaryLinks.slice(0, 1).map((item) => <NavItem key={item.path} {...item} active={location.pathname === item.path} onClick={closeMobileMenu} />)}

          <div className={`admin-sidebar__group ${websiteIsActive ? 'is-active' : ''}`}>
            <button type="button" className="admin-sidebar__toggle" onClick={() => setWebsiteMgmtOpen((isOpen) => !isOpen)} aria-expanded={websiteMgmtOpen}>
              <span><i className="fa fa-globe" /> Website management</span><i className={`fa fa-angle-${websiteMgmtOpen ? 'up' : 'down'}`} />
            </button>
            {websiteMgmtOpen && <div className="admin-sidebar__submenu">{websiteLinks.map((item) => <NavItem key={item.path} {...item} sub active={location.pathname === item.path} onClick={closeMobileMenu} />)}</div>}
          </div>

          <p className="admin-sidebar__label admin-sidebar__label--academy">Learning operations</p>
          {primaryLinks.slice(1).map((item) => <NavItem key={item.path} {...item} active={location.pathname === item.path} onClick={closeMobileMenu} />)}
        </nav>

        <div className="admin-sidebar__footer"><button type="button" onClick={handleLogout} className="admin-sidebar__logout"><i className="fa fa-sign-out" /> Sign out</button></div>
      </aside>
      {mobileOpen && <button type="button" className="admin-sidebar__backdrop d-lg-none" aria-label="Close navigation" onClick={closeMobileMenu} />}
    </>
  );
};

const NavItem = ({ path, label, icon, active, onClick, sub = false }) => (
  <Link to={path} onClick={onClick} className={`admin-sidebar__link ${sub ? 'admin-sidebar__link--sub' : ''} ${active ? 'active' : ''}`}>
    <i className={`fa ${icon}`} /><span>{label}</span>
  </Link>
);

export default AdminSidebar;
