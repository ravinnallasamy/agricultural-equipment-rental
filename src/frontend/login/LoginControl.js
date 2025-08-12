import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Designs/LoginControl.css';
import logoImage from '../../Assets/Logo.png'; 

export default function LoginControl() {
  const navigate = useNavigate();

  return (
    <div className="login-page-container">
      <div 
        className="background-image"
        style={{
          backgroundImage: `url(${logoImage})`,
        }}
      ></div>
      
      <div className="global-logo">
        <img 
          src={logoImage} 
          alt="Agricultural Rental App Logo" 
          className="circular-logo"
        />
      </div>

      <div className="login-container">
        <h2 className="login-title">UZHAVAN RENTALS</h2>
        <div className="button-group">
          <button
            onClick={() => navigate('/user')}
            className="login-button btn-customer"
          >
            User
          </button>
          <button 
            onClick={() => navigate('/provider')}
            className="login-button btn-provider"
          >
            Provider
          </button>
        </div>
      </div>
    </div>
  );
}