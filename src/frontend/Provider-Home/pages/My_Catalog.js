
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../../config/api';
import '../../../Designs/PHome.css';
import logo from '../../../Assets/Logo.png';
import { 
  FiUser, 
  FiLogOut, 
  FiEdit,
  FiTrash2,
  FiPlusCircle,
  FiTrendingUp,
  FiSettings,
  FiBarChart
} from 'react-icons/fi';
import { 
  FaTractor, 
  FaTools, 
  FaSeedling,
  FaLeaf,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBoxes
} from 'react-icons/fa';

export default function MyCatalog() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [providerId, setProviderId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    if (user && user.id) {
      setProviderId(user.id);
    } else {
      alert("Please login as a provider.");
      navigate("/signin/provider");
    }
  }, [navigate]);

  useEffect(() => {
    if (providerId) {
      fetchEquipment();
    }
  }, [providerId]);

  const fetchEquipment = async () => {
    try {
      // Use provider-specific equipment endpoint
      const response = await axios.get(API_CONFIG.getProviderEquipmentUrl(providerId));
      setEquipmentList(response.data.data || response.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching equipment:", err);
      setIsLoading(false);
    }
  };

  const handleDelete = async (equipmentId) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await axios.delete(API_CONFIG.getEquipmentUrl(equipmentId));
        alert("Equipment deleted successfully!");
        fetchEquipment(); // Refresh the list
      } catch (err) {
        console.error("Error deleting equipment:", err);
        const errorMessage = err.response?.data?.message || "Failed to delete equipment. Please try again.";
        alert(errorMessage);
      }
    }
  };

  const handleEdit = (equipment) => {
    // Navigate to edit page or open edit modal
    alert("Edit functionality will be implemented here");
  };

  const toggleAvailability = async (equipmentId, currentStatus) => {
    try {
      await axios.patch(API_CONFIG.getEquipmentUrl(equipmentId), {
        available: !currentStatus
      });
      alert(`Equipment ${!currentStatus ? 'made available' : 'made unavailable'} successfully!`);
      fetchEquipment(); // Refresh the list
    } catch (err) {
      console.error("Error updating equipment status:", err);
      const errorMessage = err.response?.data?.message || "Failed to update equipment status. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="provider-home-page">
      <img src={logo} alt="Logo" className="provider-logo" />
      
      <div className="provider-header">
        <h1 className="welcome-title">My Equipment Catalog</h1>
        <div className="provider-info">
          <div className="location-badge">
            <p>My Equipment:</p>
            <FaBoxes />
            {equipmentList.length} Items
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
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="action-button primary"
          onClick={() => navigate(`/provider/add-equipment/`)}
        >
          <FiPlusCircle /> Add New Equipment  
        </button>
        <button
          className="action-button secondary"
          onClick={() => navigate(`/provider/requests/`)}
        >
          <FaBoxes /> View Requests
        </button>
      </div>

      {/* Catalog Container */}
      <div className="catalog-container">
        <div className="catalog-header">
          <h2 className="catalog-title">My Equipment</h2>
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
                  <div className="equipment-header">
                    <h3 className="equipment-name">{item.name}</h3>
                    <span className={`availability-status ${item.available ? 'available' : 'unavailable'}`}>
                      {item.available ? '🟢 Available' : '🔴 Rented Out'}
                    </span>
                    <div className="equipment-actions">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(item)}
                        title="Edit Equipment"
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(item.id)}
                        title="Delete Equipment"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  
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
                    <strong>Location:</strong> {item.address || "Not specified"}
                  </p>
                  <p className="equipment-detail">
                    <strong>Status:</strong>{" "}
                    <span className={`status-badge ${item.available ? 'available' : 'unavailable'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </p>
                  
                  <div className="equipment-actions-bottom">
                    <button
                      className={`action-button ${item.available ? 'info' : 'primary'}`}
                      onClick={() => toggleAvailability(item.id, item.available)}
                      style={{ minWidth: 'auto', padding: '0.5rem 1rem' }}
                    >
                      {item.available ? 'Make Unavailable' : 'Make Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



  