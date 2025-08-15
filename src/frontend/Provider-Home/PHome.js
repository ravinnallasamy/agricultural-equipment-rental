import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../config/api';
import '../../Designs/PHome.css';
import logo from '../../Assets/Logo.png';

export default function PHome() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEquipment = useCallback(async () => {
    try {
      // Use API_CONFIG for proper environment handling
      const providerId = provider.id;

      // Try to get provider-specific equipment first
      try {
        const res = await axios.get(API_CONFIG.getProviderEquipmentUrl(providerId));
        setEquipmentList(res.data.data || res.data);
      } catch (providerErr) {
        // Fallback: get all equipment and filter by providerId
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
    <div className="provider-theme provider-home-page">
      <img src={logo} alt="Logo" className="provider-logo" />
      
      <div className="provider-header">
        <h1 className="welcome-title">Welcome, {provider.name}</h1>
        <div className="provider-info">
          <div className="location-badge">
            <p>Location:</p>
            <i className="fas fa-map-marker-alt"></i>
            {provider.address && typeof provider.address === 'object'
              ? `${provider.address.city || ''}, ${provider.address.state || ''}, ${provider.address.country || ''}`.replace(/^,\s*|,\s*$|,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '') || "Location not specified"
              : provider.address || "Location not specified"
            }
          </div>

          <div className="header-buttons">
            <button
  className="profile-button"
  onClick={() => {
    const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    const userType = localStorage.getItem('userType');

    if (user && userType) {
      const id = user._id || user.id;
      navigate(`/profile/${userType}/${id}`);
    } else {
      alert("User not logged in");
    }
  }}
>
  <i className="fas fa-user-circle"></i> Profile
</button>

            <button
              className="profile-button logout"
              onClick={() => navigate('/logout')}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="action-button primary"
          onClick={() => navigate(`/provider/requests`)}
        >
          <i className="fas fa-clipboard-list"></i> My Rental Requests
        </button>
        <button
          className="action-button secondary"
          onClick={() => navigate(`/provider/add-equipment`)}
        >
          <i className="fas fa-plus-circle"></i> Add Equipment
        </button>
        <button
          className="action-button info"
          onClick={() => navigate(`/provider/my-catalog`)}
        >
          <i className="fas fa-tractor"></i> My Catalog
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
                    <i className="fas fa-tags"></i> <strong>Type:</strong> {item.type}
                  </p>
                  <p className="equipment-detail">
                    <i className="fas fa-list"></i> <strong>Category:</strong> {item.category}
                  </p>
                  <p className="equipment-detail">
                    <i className="fas fa-rupee-sign"></i> <strong>Price/hr:</strong> ₹{item.price}
                  </p>
                  <p className="equipment-detail">
                    <i className={item.available ? "fas fa-check-circle" : "fas fa-times-circle"}></i> 
                    <strong>Available:</strong> {item.available ? "Yes" : "No"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}