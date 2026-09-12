import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', loading = false, disabled = false, ...props }) => {
  const baseStyle = 'fw-bold rounded-pill transition-all d-inline-flex align-items-center justify-content-center border-0';
  
  const variants = {
    primary: 'btn-primary shadow-sm text-white',
    secondary: 'btn-secondary text-white',
    success: 'btn-success text-white',
    danger: 'btn-danger text-white',
    outline: 'btn-outline-primary',
    light: 'btn-light text-dark border'
  };

  const sizes = {
    sm: 'px-3 py-1.5 fs-7',
    md: 'px-4 py-2.5 fs-6',
    lg: 'px-5 py-3 fs-5'
  };

  return (
    <button
      className={`btn ${baseStyle} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
      {children}
    </button>
  );
};

export default Button;
