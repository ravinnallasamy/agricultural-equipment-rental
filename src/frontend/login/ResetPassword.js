import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../Designs/Login.css';


export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const decodeUserType = (t) => {
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      if (payload && (payload.userType === 'user' || payload.userType === 'provider')) {
        return payload.userType;
      }
    } catch (_) {}
    return 'user';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(API_CONFIG.getAuthUrl(API_CONFIG.AUTH.RESET_PASSWORD), {
        token,
        password
      });
      if (res.status === 200) {
        setSuccess(true);
        const ut = decodeUserType(token);
        setTimeout(() => navigate(`/signin/${ut}`), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Reset link is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        {!success ? (
          <>
            <h2 className="login-title">Set a new password</h2>
            <form className="login-form" onSubmit={onSubmit}>
              <input
                type="password"
                className="login-input"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <input
                type="password"
                className="login-input"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
              />
              {error && <div style={{ color: 'crimson' }}>{error}</div>}
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Saving...' : 'Update Password'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="login-title">Password updated</h2>
            <p>Redirecting to home...</p>
          </>
        )}
      </div>
    </div>
  );
}

