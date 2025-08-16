import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../Assets/Logo.png';
import { FiHome, FiUser, FiLogOut } from 'react-icons/fi';
import '../../../Designs/PHome.css';

export default function ProviderHero({ title }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
  const userType = localStorage.getItem('userType') || 'provider';

  const name = user?.name || 'Provider';
  // Build a human-friendly location string (supports string or object address)
  let locationText = 'Location not specified';
  const addr = user?.address;
  if (addr) {
    if (typeof addr === 'string') {
      locationText = addr;
    } else if (typeof addr === 'object') {
      const parts = [addr.city, addr.state, addr.country].filter(Boolean);
      if (parts.length > 0) locationText = parts.join(', ');
    }
  }

  const handleProfile = () => {
    const id = user?._id || user?.id;
    if (id) navigate(`/profile/${userType}/${id}`);
  };

  return (
    <header className="provider-hero">
      <div className="hero-content">
        <div className="hero-logo">
          <img src={logo} alt="Logo" className="provider-logo" />
        </div>

        <div className="hero-info">
          <h1 className="welcome-title">{title || `Welcome, ${name}`}</h1>
          <div className="location-badge">
            <p>{locationText}</p>
          </div>
        </div>

        <div className="hero-actions">
          <button
            className="hero-home-btn"
            aria-label="Provider Home"
            title="Provider Home"
            onClick={() => navigate('/provider-home')}
          >
            <FiHome />
          </button>
          <button className="profile-button" onClick={handleProfile}>
            <FiUser /> Profile
          </button>
          <button className="profile-button logout" onClick={() => navigate('/logout')}>
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </header>
  );
}

