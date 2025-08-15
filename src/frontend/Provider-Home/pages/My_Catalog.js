import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../../config/api';
import '../../../Designs/PHome.css';
import '../../../Designs/MyCatalog.css';
import logo from '../../../Assets/Logo.png';
import {
  FiUser,
  FiLogOut,
  FiEdit,
  FiTrash2,
  FiPlusCircle,
  FiX,
  FiCheck,
  FiDollarSign,
  FiMapPin,
  FiTag,
  FiLayers
} from 'react-icons/fi';
import { FaBoxes } from 'react-icons/fa';

// Reuse the same options as in Add Equipment
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

  const fetchEquipment = useCallback(async () => {
    try {
      const response = await axios.get(API_CONFIG.getProviderEquipmentUrl(providerId));
      setEquipmentList(response.data.data || response.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    if (providerId) {
      fetchEquipment();
    }
  }, [providerId, fetchEquipment]);

  const handleDelete = async (equipmentId) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await axios.delete(API_CONFIG.getEquipmentUrl(equipmentId));
        alert("Equipment deleted successfully!");
        fetchEquipment();
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to delete equipment. Please try again.";
        alert(errorMessage);
      }
    }
  };

  const [editItemId, setEditItemId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    type: '',
    price: '',
    address: '',
    available: true
  });

  const openEdit = (item) => {
    setEditItemId(item.id);
    setEditForm({
      name: item.name || '',
      category: item.category || '',
      type: item.type || '',
      price: item.price || '',
      address: item.address || '',
      available: !!item.available,
    });
  };

  const closeEdit = () => {
    setEditItemId(null);
  };

  const saveEdit = async () => {
    if (!editItemId) return;
    try {
      const payload = { ...editForm, price: parseFloat(editForm.price) };
      await axios.put(API_CONFIG.getEquipmentUrl(editItemId), payload);
      alert('Equipment updated successfully');
      closeEdit();
      fetchEquipment();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update equipment';
      alert(msg);
    }
  };

  const handleEdit = (item) => openEdit(item);

  const toggleAvailability = async (equipmentId, currentStatus) => {
    try {
      await axios.patch(API_CONFIG.getEquipmentUrl(equipmentId), {
        available: !currentStatus
      });
      alert(`Equipment ${!currentStatus ? 'made available' : 'made unavailable'} successfully!`);
      fetchEquipment();
    } catch (err) {
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
                <div key={index} className={`equipment-card ${editItemId === item.id ? 'card-editing' : ''}`}>
                  <div className="equipment-header">
                    {editItemId === item.id ? (
                      <div className="edit-title-container">
                        <h3 className="editing-title">Editing Equipment</h3>
                        <div className="edit-actions">
                          <button className="action-btn save" onClick={saveEdit} title="Save">
                            <FiCheck />
                          </button>
                          <button className="action-btn cancel" onClick={closeEdit} title="Cancel">
                            <FiX />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="equipment-name">{item.name}</h3>
                        <span className={`availability-status ${item.available ? 'available' : 'unavailable'}`}>
                          {item.available ? '🟢 Available' : '🔴 Rented Out'}
                        </span>
                      </>
                    )}

                    {editItemId !== item.id && (
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
                    )}
                  </div>

                  {editItemId === item.id ? (
                    <div className="edit-form-container">
                      <div className="form-group">
                        <label className="form-label">
                          <FiTag className="input-icon" />
                          Equipment Name
                        </label>
                        <input
                          className="form-input"
                          value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Enter equipment name"
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">
                            <FiLayers className="input-icon" />
                            Type
                          </label>
                          <select
                            className="form-input"
                            value={editForm.type}
                            onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                          >
                            <option value="">Select Type</option>
                            {types.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">
                            <FiLayers className="input-icon" />
                            Category
                          </label>
                          <select
                            className="form-input"
                            value={editForm.category}
                            onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                          >
                            <option value="">Select Category</option>
                            {categories.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">
                            <FiDollarSign className="input-icon" />
                            Price (₹/hr)
                          </label>
                          <input
                            className="form-input"
                            type="number"
                            min="0"
                            step="0.01"
                            value={editForm.price}
                            onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                            placeholder="Enter price"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">
                            <FiMapPin className="input-icon" />
                            Location
                          </label>
                          <input
                            className="form-input"
                            value={editForm.address}
                            onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                            placeholder="Enter location"
                          />
                        </div>
                      </div>

                      <div className="form-group availability-toggle">
                        <label className="toggle-label">
                          <span className="toggle-text">Availability</span>
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={editForm.available}
                              onChange={e => setEditForm({ ...editForm, available: e.target.checked })}
                            />
                            <span className="slider round" />
                          </label>
                          <span className={`status-text ${editForm.available ? 'available' : 'unavailable'}`}>
                            {editForm.available ? 'Available' : 'Unavailable'}
                          </span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="equipment-details">
                        <div className="detail-row">
                          <FiLayers className="detail-icon" />
                          <span className="detail-label">Type:</span>
                          <span className="detail-value">{item.type}</span>
                        </div>
                        <div className="detail-row">
                          <FiLayers className="detail-icon" />
                          <span className="detail-label">Category:</span>
                          <span className="detail-value">{item.category}</span>
                        </div>
                        <div className="detail-row">
                          <FiDollarSign className="detail-icon" />
                          <span className="detail-label">Price/hr:</span>
                          <span className="detail-value">₹{item.price}</span>
                        </div>
                        <div className="detail-row">
                          <FiMapPin className="detail-icon" />
                          <span className="detail-label">Location:</span>
                          <span className="detail-value">{item.address || 'Not specified'}</span>
                        </div>
                      </div>

                      <div className="equipment-footer">
                        <button
                          className={`availability-toggle-btn ${item.available ? 'make-unavailable' : 'make-available'}`}
                          onClick={() => toggleAvailability(item.id, item.available)}
                        >
                          {item.available ? 'Mark as Unavailable' : 'Mark as Available'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}