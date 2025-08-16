/**
 * User Registration Component
 *
 * This component handles the registration process for both regular users (farmers)
 * and equipment providers. It provides a dynamic form that adapts based on the
 * user type, collecting appropriate information for each role.
 *
 * Features:
 * - Dynamic form fields based on user type
 * - Input validation and error handling
 * - Password confirmation
 * - Business information collection for providers
 * - Integration with backend authentication API
 *
 * Author: Development Team
 * Purpose: User onboarding and account creation
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../Designs/Signup.css';

import bgImage from '../../Assets/Signup.png';

const SuccessMessage = ({ userType, navigate }) => (
  <div className="activation-message">
    <h2>🎉 Account Created!</h2>
    <p>Please check your email to activate your account.</p>
    <button onClick={() => navigate(`/signin/${userType}`)} className="signin-button">
      Sign In Now
    </button>
  </div>
);

export default function Signup() {
  const { userType } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const signupData = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        address: form.address,
        userType,
        createdAt: new Date().toISOString()
      };

      // Add business fields for providers
      if (userType === 'provider') {
        signupData.businessName = form.businessName || '';
        signupData.businessType = form.businessType || 'Equipment Rental';
        signupData.licenseNumber = form.licenseNumber || '';
      }

      // Use API_CONFIG for proper environment handling
      const endpoint = userType === 'provider'
        ? API_CONFIG.getAuthUrl(API_CONFIG.AUTH.PROVIDER_SIGNUP)
        : API_CONFIG.getAuthUrl(API_CONFIG.AUTH.USER_SIGNUP);

      const response = await axios.post(endpoint, signupData);

      if (response.status === 201) {
        // Backend returns success message and email
        alert(`Account created successfully! Please check your email (${form.email}) to activate your account.`);
        setSignupSuccess(true);
        // Redirect to signin page after a delay
        setTimeout(() => {
          navigate(`/signin/${userType}`);
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || 'Signup failed. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="signup-page-container">
      <div
        className="signup-background"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      <div className="signup-form-container">
        {!signupSuccess ? (
          <>
            <h2>{userType === 'user' ? 'User' : 'Provider'} Signup</h2>
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
              <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} required />
              <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />

              {/* Business fields for providers */}
              {userType === 'provider' && (
                <div className="business-fields">
                  <h3>Business Information</h3>
                  <input
                    name="businessName"
                    placeholder="Business Name"
                    value={form.businessName || ''}
                    onChange={handleChange}
                  />
                  <select
                    name="businessType"
                    value={form.businessType || 'Equipment Rental'}
                    onChange={handleChange}
                  >
                    <option value="Equipment Rental">Equipment Rental</option>
                    <option value="Farm Services">Farm Services</option>
                    <option value="Agricultural Contractor">Agricultural Contractor</option>
                    <option value="Equipment Dealer">Equipment Dealer</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    name="licenseNumber"
                    placeholder="License Number (Optional)"
                    value={form.licenseNumber || ''}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Password fields */}
              <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required minLength="6" />
              <input name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />

              <button type="submit">Create {userType === 'user' ? 'User' : 'Provider'} Account</button>
            </form>
          </>
        ) : (
          <SuccessMessage userType={userType} navigate={navigate} />
        )}
      </div>
    </div>
  );
}
