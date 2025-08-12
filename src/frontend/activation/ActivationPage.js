import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Designs/Activation.css';

const ActivationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const activateAccount = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid activation link. No token provided.');
        return;
      }

      try {

        
        // Use backend activation endpoint
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/user/activate/${token}`);
        

        
        setStatus('success');
        setMessage(response.data.message);
        setUserInfo({
          email: response.data.email,
          userType: response.data.userType,
          id: response.data.id
        });

        // Auto-redirect to signin after 5 seconds
        setTimeout(() => {
          navigate(`/signin/${response.data.userType}`);
        }, 5000);

      } catch (error) {

        
        setStatus('error');
        
        if (error.response?.status === 400) {
          setMessage(error.response.data.message || 'Invalid or expired activation token.');
        } else if (error.response?.status === 500) {
          setMessage('Server error during activation. Please try again later.');
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
          setMessage('Unable to connect to the server. Please check your internet connection.');
        } else {
          setMessage('An unexpected error occurred during activation.');
        }
      }
    };

    activateAccount();
  }, [token, navigate]);

  const handleSignInRedirect = () => {
    if (userInfo) {
      navigate(`/signin/${userInfo.userType}`);
    } else {
      navigate('/');
    }
  };

  const handleHomeRedirect = () => {
    navigate('/');
  };

  return (
    <div className="activation-page">
      <div className="activation-container">
        <div className="activation-content">
          {status === 'loading' && (
            <>
              <div className="loading-spinner"></div>
              <h2>Activating Your Account...</h2>
              <p>Please wait while we activate your account.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="success-icon">✅</div>
              <h2>Account Activated Successfully!</h2>
              <p className="success-message">{message}</p>
              
              {userInfo && (
                <div className="user-info">
                  <p><strong>Email:</strong> {userInfo.email}</p>
                  <p><strong>Account Type:</strong> {userInfo.userType === 'provider' ? 'Provider' : 'Customer'}</p>
                </div>
              )}
              
              <div className="activation-actions">
                <button 
                  onClick={handleSignInRedirect}
                  className="btn-primary"
                >
                  Sign In Now
                </button>
                <p className="auto-redirect">You will be automatically redirected to the sign-in page in a few seconds...</p>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="error-icon">❌</div>
              <h2>Activation Failed</h2>
              <p className="error-message">{message}</p>
              
              <div className="error-actions">
                <button 
                  onClick={handleHomeRedirect}
                  className="btn-secondary"
                >
                  Go to Home
                </button>
                <button 
                  onClick={() => navigate('/signup/user')}
                  className="btn-primary"
                >
                  Sign Up Again
                </button>
              </div>
              
              <div className="help-text">
                <p>If you continue to have issues, please:</p>
                <ul>
                  <li>Check if you clicked the correct activation link</li>
                  <li>Ensure the link hasn't expired (valid for 3 days)</li>
                  <li>Contact support if the problem persists</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivationPage;
