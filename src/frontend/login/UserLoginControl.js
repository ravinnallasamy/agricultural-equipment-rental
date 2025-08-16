import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Designs/LoginControl.css';

import logoImage from '../../Assets/Logo.png';
export default function UserLoginControl() {
  const navigate = useNavigate();
  const userType = 'user';

  return (
    <div className="customer-page-container">
      {/* Background element */}
      <div 
        className="background-image"
        style={{ backgroundImage: `url(${logoImage})` }}
      ></div>
      
      {/* Circular logo in top-left corner */}
      <div className="global-logo">
        <img 
          src={logoImage} 
          alt="Agricultural Rental App Logo" 
          className="circular-logo"
        />
      </div>

      {/* Login Container */}
      <div className="customer-container">
        <h2 className="customer-title">Customer Access</h2>
        <div className="button-group">
          <button 
            onClick={() => navigate(`/signin/${userType}`)}
            className="customer-button signin-btn"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate(`/signup/${userType}`)}
            className="customer-button signup-btn"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}