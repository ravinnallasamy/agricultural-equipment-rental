import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../Designs/PHome.css';
import logo from '../../Assets/Logo.png';
import { FiHome, FiUser, FiLogOut } from 'react-icons/fi';
import { FaClipboardList, FaPlusCircle, FaTractor } from 'react-icons/fa';

export default function PHome() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEquipment = useCallback(async () => {
    try {
      const providerId = provider.id;
      try {
        const res = await axios.get(API_CONFIG.getProviderEquipmentUrl(providerId));
        setEquipmentList(res.data.data || res.data);
      } catch (providerErr) {
        const res = await axios.get(API_CONFIG.getEquipmentUrl());
        const filtered = res.data.filter(item =>
          item.providerId === providerId ||
          item.providerId === providerId.toString()
        );
        setEquipmentList(filtered);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  }, [provider]);

  useEffect(() => {
    const logged = localStorage.getItem('loggedUser');
    if (logged) {
      const parsed = JSON.parse(logged);
      setProvider(parsed);
    } else {
      alert("Please login first");
      navigate("/signin/provider");
    }
  }, [navigate]);

  useEffect(() => {
    if (provider?.id) {
      fetchEquipment();
    }
  }, [provider, fetchEquipment]);

  if (!provider) return null;

  return (
    <div className="provider-home-page">
      {/* Fixed Hero Section */}
      <header className="provider-hero">
        <div className="hero-content">
          <div className="hero-logo">
            <img src={logo} alt="Logo" className="provider-logo" />
          </div>
          
          <div className="hero-info">
            <h1 className="welcome-title">Welcome, {provider.name}</h1>
            <div className="location-badge">
              <p>
                {provider.address && typeof provider.address === 'object'
                  ? `${provider.address.city || ''}, ${provider.address.state || ''}`.replace(/^,\s*|,\s*$|,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '') || "Location not specified"
                  : provider.address || "Location not specified"
                }
              </p>
            </div>
          </div>
          
          <div className="hero-actions">
            <button
              className="profile-button"
              onClick={() => {
                const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
                const userType = localStorage.getItem('userType');
                if (user && userType) {
                  const id = user._id || user.id;
                  navigate(`/profile/${userType}/${id}`);
                }
              }}
            >
              <FiUser /> Profile
            </button>
            <button
              className="profile-button logout"
              onClick={() => navigate('/logout')}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <main className="provider-content">
        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="action-button primary"
            onClick={() => navigate(`/provider/requests`)}
          >
            <FaClipboardList /> My Rental Requests
          </button>
          <button
            className="action-button secondary"
            onClick={() => navigate(`/provider/add-equipment`)}
          >
            <FaPlusCircle /> Add Equipment
          </button>
          <button
            className="action-button info"
            onClick={() => navigate(`/provider/my-catalog`)}
          >
            <FaTractor /> My Catalog
          </button>
        </div>

        {/* Catalog Section */}
        <div className="catalog-container">
          <div className="catalog-header">
            <h2 className="catalog-title">Equipment Catalog</h2>
            {isLoading ? (
              <p className="no-equipment">Loading equipment...</p>
            ) : equipmentList.length === 0 ? (
              <p className="no-equipment">No equipment found. Start by adding some equipment.</p>
            ) : null}
          </div>

          {!isLoading && equipmentList.length > 0 && (
            <div className="catalog-body">
              <div className="equipment-grid">
                {equipmentList.map((item, index) => (
                  <div key={index} className="equipment-card">
                    <h3 className="equipment-name">{item.name}</h3>
                    <p className="equipment-detail">
                      <strong>Type:</strong> {item.type}
                    </p>
                    <p className="equipment-detail">
                      <strong>Category:</strong> {item.category}
                    </p>
                    <p className="equipment-detail">
                      <strong>Price/hr:</strong> ₹{item.price}
                    </p>
                    <p className="equipment-detail">
                      <strong>Available:</strong> {item.available ? "Yes" : "No"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Home Button */}
      <button
        className="provider-home-fab"
        onClick={() => navigate('/provider-home')}
      >
        <FiHome />
      </button>
    </div>
  );
}