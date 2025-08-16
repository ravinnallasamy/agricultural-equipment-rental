import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../Designs/Login.css';


export default function ForgotPassword() {
  const { userType } = useParams(); // 'user' or 'provider'
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(API_CONFIG.getAuthUrl(API_CONFIG.AUTH.FORGOT_PASSWORD), {
        email,
        userType
      });
      setSent(true);
    } catch (err) {
      // Always show success-like message to prevent enumeration differences
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        {!sent ? (
          <>
            <h2 className="login-title">Forgot Password ({userType})</h2>
            <form className="login-form" onSubmit={onSubmit}>
              <input
                type="email"
                className="login-input"
                placeholder="Enter your account email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="login-title">Check your email</h2>
            <p>We sent a reset link to {email}. If the email exists, you'll receive instructions shortly. The link is valid for 1 day.</p>
          </>
        )}
      </div>
    </div>
  );
}

