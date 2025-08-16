import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../Designs/Activation.css';


const ActivationSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  const email = searchParams.get('email');
  const userType = searchParams.get('userType');

  const handleSignInRedirect = useCallback(() => {
    if (userType) {
      navigate(`/signin/${userType}`);
    } else {
      navigate('/signin/user');
    }
  }, [userType, navigate]);

  useEffect(() => {
    // Countdown timer for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSignInRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSignInRedirect]);

  const handleHomeRedirect = () => {
    navigate('/');
  };

  return (
    <div className="activation-page">
      <div className="activation-container">
        <div className="activation-content">
          <div className="success-icon">✅</div>
          <h2>Account Activated Successfully!</h2>
          
          <div className="success-details">
            <p className="success-message">
              Congratulations! Your account has been successfully activated.
            </p>
            
            {email && (
              <div className="user-info">
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Account Type:</strong> {userType === 'provider' ? 'Provider' : 'Customer'}</p>
              </div>
            )}
            
            <div className="welcome-message">
              <h3>🎉 Welcome to UZHAVAN RENTALS!</h3>
              {userType === 'provider' ? (
                <div>
                  <p>As a provider, you can now:</p>
                  <ul>
                    <li>📋 List your agricultural equipment for rent</li>
                    <li>💼 Manage rental requests from customers</li>
                    <li>💰 Track your earnings and revenue</li>
                    <li>⭐ Build your reputation through customer reviews</li>
                    <li>📊 Access detailed analytics and reports</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <p>As a customer, you can now:</p>
                  <ul>
                    <li>🔍 Browse and search agricultural equipment</li>
                    <li>📝 Submit rental requests to providers</li>
                    <li>📈 Track your rental history</li>
                    <li>⭐ Rate and review equipment providers</li>
                    <li>💬 Communicate directly with providers</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="activation-actions">
            <button 
              onClick={handleSignInRedirect}
              className="btn-primary"
            >
              Sign In Now
            </button>
            <button 
              onClick={handleHomeRedirect}
              className="btn-secondary"
            >
              Go to Home
            </button>
          </div>
          
          <div className="auto-redirect">
            <p>You will be automatically redirected to the sign-in page in <strong>{countdown}</strong> seconds...</p>
          </div>
          
          <div className="help-section">
            <h4>Need Help?</h4>
            <p>If you have any questions or need assistance, please contact our support team.</p>
            <p>📧 Email: support@uzhavanrentals.com</p>
            <p>📞 Phone: +91 1234567890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationSuccess;
