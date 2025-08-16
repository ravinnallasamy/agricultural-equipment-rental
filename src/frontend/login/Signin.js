import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../config/api';

import Signinimage from '../../Assets/Signin.png';

export default function Signin() {
  const { userType } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Use API_CONFIG for proper environment handling
      const endpoint = userType === 'user'
        ? API_CONFIG.getAuthUrl(API_CONFIG.AUTH.USER_SIGNIN)
        : API_CONFIG.getAuthUrl(API_CONFIG.AUTH.PROVIDER_SIGNIN);

      const loginData = { email, password };
      const response = await axios.post(endpoint, loginData);

      if (response.data && response.data.token) {
        // Store authentication data
        localStorage.setItem('userType', userType);
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('loggedUser', JSON.stringify(response.data.user));

        alert("Login successful");

        if (userType === 'user') {
          navigate('/user-home');
        } else {
          navigate('/provider-home');
        }
      } else {
        alert("Invalid response from server");
      }

    } catch (err) {
      const errorMessage = err.response?.data || "Login failed. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="login-page-container">
      <div 
        className="login-background"
        style={{ backgroundImage: `url(${Signinimage})` }}
      ></div>

      <div className="login-container">
        <h2 className="login-title">
          {userType === 'user' ? 'User' : 'Provider'} Login
        </h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
          <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
            <span
              style={{ color: '#0984e3', cursor: 'pointer', fontSize: '0.9rem' }}
              onClick={() => navigate(`/forgot-password/${userType}`)}
            >
              Forgot password?
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
