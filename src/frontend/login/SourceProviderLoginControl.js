import { useNavigate } from 'react-router-dom';
import '../../Designs/LoginControl.css';

import logoImage from '../../Assets/Logo.png';

export default function SourceProviderLoginControl() {
  const navigate = useNavigate();
  const userType = 'provider';

  return (
    <div className="provider-page-container">
      <div 
        className="background-image"
        style={{ backgroundImage: `url(${logoImage})` }}
      ></div>
      
      <div className="global-logo">
        <img 
          src={logoImage} 
          alt="Agricultural Rental App Logo" 
          className="circular-logo"
        />
      </div>

      <div className="provider-container">
        <h2 className="provider-title">Provider Access</h2>
        <div className="button-group">
          <button 
            onClick={() => navigate(`/signin/${userType}`)}
            className="provider-button signin-btn"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate(`/signup/${userType}`)}
            className="provider-button signup-btn"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}