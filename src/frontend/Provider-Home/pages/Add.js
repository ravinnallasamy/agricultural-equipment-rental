import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../../config/api';
import '../../../Designs/PHome.css';
import logo from '../../../Assets/Logo.png';
import {
  FiUser,
  FiLogOut,
  FiSave,
  FiX
} from 'react-icons/fi';
import {
  FaPlus
} from 'react-icons/fa';

export default function Add() {
  // Form state management - stores all equipment information entered by the provider
  const [formData, setFormData] = useState({
    name: '',        // Equipment name (e.g., "John Deere Tractor")
    category: '',    // Equipment category (e.g., "Tractors", "Harvesters")
    type: '',        // Specific type within category
    price: '',       // Daily rental price in dollars
    address: '',     // Equipment location address
    available: true  // Equipment availability status
  });

  // Provider identification - links equipment to the logged-in provider
  const [providerId, setProviderId] = useState("");

  // Loading state for form submission
  const [isLoading, setIsLoading] = useState(false);



  // Navigation hook for redirecting after successful equipment addition
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');

    // Try both id and _id fields
    const userId = user?.id || user?._id;

    if (userId) {
      setProviderId(userId);
    } else {
      alert("Please login as a provider.");
      navigate("/signin/provider");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.type || !formData.price) {
      alert("Please fill in all required fields (name, category, type, price).");
      return;
    }

    // Get provider info from localStorage
    const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');

    // Check if address is available from form or user profile
    if (!formData.address && !user.address) {
      alert("Address is required. Please add an address to your profile or specify equipment location.");
      return;
    }

    // Check if providerId is available
    if (!providerId) {
      alert("Provider ID not found. Please refresh the page and try again.");
      return;
    }

    const equipmentData = {
      ...formData,
      providerId: providerId,
      providerEmail: user.email,
      providerName: user.name,
      price: parseFloat(formData.price),
      address: formData.address || user.address || 'Not specified', // Add required address field
      available: true,
      createdAt: new Date().toISOString(),
      specifications: {},
      images: []
    };

    try {
      setIsLoading(true);
      const response = await axios.post(API_CONFIG.getEquipmentUrl(), equipmentData);
      if (response.data) {
        alert("Equipment added successfully!");
        navigate(`/provider/my-catalog`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to add equipment. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Equipment categories - matches backend schema
  const categories = [
    'Tractors',
    'Harvesters',
    'Planters',
    'Tillage Equipment',
    'Irrigation Equipment',
    'Hay Equipment',
    'Tools',
    'Spraying Equipment',
    'Fertilizer Equipment',
    'Livestock Equipment',
    'Other'
  ];

  // Equipment types - matches backend schema
  const types = [
    // Tractor Types
    'Utility Tractor',
    'Compact Tractor',
    'Row Crop Tractor',
    'Garden Tractor',

    // Harvesting Equipment
    'Combine Harvester',
    'Forage Harvester',
    'Potato Harvester',
    'Sugar Beet Harvester',

    // Planting Equipment
    'Seed Drill',
    'Planter',
    'Transplanter',
    'Broadcasting Equipment',

    // Tillage Equipment
    'Plow',
    'Cultivator',
    'Harrow',
    'Rotary Tiller',
    'Subsoiler',

    // Irrigation Equipment
    'Irrigation Systems',
    'Sprinkler Systems',
    'Drip Irrigation',
    'Center Pivot',

    // Hay Equipment
    'Mower',
    'Rake',
    'Baler',
    'Tedder',

    // General Categories
    'Heavy Equipment',
    'Light Equipment',
    'Hand Tools',
    'Power Tools',
    'Other'
  ];

  return (
    <div className="provider-home-page">
      <img src={logo} alt="Logo" className="provider-logo" />

      <div className="provider-header">
        <h1 className="welcome-title">Add New Equipment</h1>
        <div className="provider-info">
          <div className="location-badge">
            <p>Add Equipment:</p>
            <FaPlus />
            New Equipment
          </div>

          <div className="header-buttons">
            <button
              className="profile-button profile"
              onClick={() => {
                const userType = localStorage.getItem('userType') || 'provider';
                navigate(`/profile/${userType}/${providerId}`);
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

          {/* Fixed Home (FAB) */}
          <button
            className="provider-home-fab"
            aria-label="Go to Provider Home"
            title="Provider Home"
            onClick={() => navigate('/provider-home')}
          >
            🏠
          </button>

        </div>
      </div>

      {/* Form Container */}
      <div className="catalog-container">
        <div className="catalog-header">
          <h2 className="catalog-title">Equipment Details</h2>
          <p className="form-subtitle">Fill in the details to add new equipment to your catalog</p>
        </div>

        <div className="catalog-body">
          <form onSubmit={handleSubmit} className="equipment-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Equipment Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter equipment name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="type">Type *</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price per Hour (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price per hour"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Location/Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter equipment location"
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Equipment is available for rent
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="action-button primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <FiSave /> Add Equipment
                  </>
                )}
              </button>

              <button
                type="button"
                className="action-button info"
                onClick={() => navigate(`/provider/my-catalog/${providerId}`)}
              >
                <FiX /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}