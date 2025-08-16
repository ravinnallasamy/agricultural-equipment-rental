import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../../config/api';
import '../../../Designs/PHome.css';
import { FiSave, FiX } from 'react-icons/fi';
import ProviderHero from '../components/ProviderHero';

export default function Add() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    type: '',
    price: '',
    address: '',
    available: true
  });

  const [providerId, setProviderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');  // Fixed missing parenthesis
    const userId = user?.id || user?._id;

    if (userId) {
      setProviderId(userId);
    } else {
      alert("Please login as a provider.");
      navigate("/signin/provider");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Equipment name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (formData.price && isNaN(formData.price)) newErrors.price = "Price must be a number";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    if (!formData.address && !user.address) {
      alert("Address is required. Please add an address to your profile or specify equipment location.");
      return;
    }

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
      address: formData.address || user.address || 'Not specified',
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

  const types = [
    'Utility Tractor',
    'Compact Tractor',
    'Row Crop Tractor',
    'Garden Tractor',
    'Combine Harvester',
    'Forage Harvester',
    'Potato Harvester',
    'Sugar Beet Harvester',
    'Seed Drill',
    'Planter',
    'Transplanter',
    'Broadcasting Equipment',
    'Plow',
    'Cultivator',
    'Harrow',
    'Rotary Tiller',
    'Subsoiler',
    'Irrigation Systems',
    'Sprinkler Systems',
    'Drip Irrigation',
    'Center Pivot',
    'Mower',
    'Rake',
    'Baler',
    'Tedder',
    'Heavy Equipment',
    'Light Equipment',
    'Hand Tools',
    'Power Tools',
    'Other'
  ];

  return (
    <div className="provider-home-page">
      <ProviderHero title="Add New Equipment" />

      <main className="provider-content">
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
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={errors.category ? 'input-error' : ''}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <span className="error-message">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="type">Type *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className={errors.type ? 'input-error' : ''}
                  >
                    <option value="">Select Type</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.type && <span className="error-message">{errors.type}</span>}
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
                    className={errors.price ? 'input-error' : ''}
                  />
                  {errors.price && <span className="error-message">{errors.price}</span>}
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
                  onClick={() => navigate('/provider-home')}
                >
                  <FiX /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}