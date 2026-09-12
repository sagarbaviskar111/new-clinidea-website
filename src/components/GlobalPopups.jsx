import React from 'react';
import { useLocation } from 'react-router-dom';
import FloatingContact from './FloatingContact';
import PopupEnquiryForm from './PopupEnquiryForm';
import EventPopup from './EventPopup';

const GlobalPopups = () => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  // Routes where popups should NOT be shown
  const isRestrictedRoute = 
    path.startsWith('/admin') ||
    path.startsWith('/register') ||
    path.startsWith('/enroll') ||
    path.startsWith('/login') ||
    path.startsWith('/student') ||
    path.startsWith('/dashboard') ||
    path.startsWith('/live');

  if (isRestrictedRoute) {
    return null;
  }

  return (
    <>
      <FloatingContact />
      <EventPopup />
      <PopupEnquiryForm />
    </>
  );
};

export default GlobalPopups;
