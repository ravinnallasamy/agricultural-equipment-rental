
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
  FiPlusCircle
} from 'react-icons/fi';
import {
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

  const fetchEquipment = useCallback(async () => {
    try {
      // Use provider-specific equipment endpoint
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
        fetchEquipment(); // Refresh the list
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to delete equipment. Please try again.";
        alert(errorMessage);
      }
    }
  };

  const [editItemId, setEditItemId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', category: '', type: '', price: '', address: '', available: true });

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
      fetchEquipment(); // Refresh the list
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
                <div key={index} className={`equipment-card ${editItemId === item.id ? 'card-editable' : ''}`}>
                  <div className="equipment-header">
                    {editItemId === item.id ? (
                      <input
                        className="card-edit-input"
                        value={editForm.name}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Name"
                      />
                    ) : (
                      <h3 className="equipment-name">{item.name}</h3>
                    )}

                    <span className={`availability-status ${item.available ? 'available' : 'unavailable'}`}>
                      {item.available ? '🟢 Available' : '🔴 Rented Out'}
                    </span>

                    <div className="equipment-actions">
                      {editItemId === item.id ? (
                        <>
                          <button className="action-btn edit" onClick={saveEdit} title="Save">💾</button>
                          <button className="action-btn delete" onClick={closeEdit} title="Cancel">✖</button>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  </div>

                  {editItemId === item.id ? (
                    <>
                      <div className="card-edit-row">
                        <div className="card-edit-field">
                          <label>Type</label>
                          <input className="card-edit-input" value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })} />
                        </div>
                        <div className="card-edit-field">
                          <label>Category</label>
                          <input className="card-edit-input" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} />
                        </div>
                      </div>
                      <div className="card-edit-row">
                        <div className="card-edit-field">
                          <label>Price (₹/hr)</label>
                          <input className="card-edit-input" type="number" min="0" step="0.01" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} />
                        </div>
                        <div className="card-edit-field">
                          <label>Location</label>
                          <input className="card-edit-input" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} />
                        </div>
                      </div>
                      <div className="toggle-field">
                        <label className="switch">
                          <input type="checkbox" checked={editForm.available} onChange={e => setEditForm({ ...editForm, available: e.target.checked })} />
                          <span className="slider" />
                        </label>
                        <span>Available</span>
                      </div>

                      <div className="card-edit-actions">
                        <button className="action-button save-button" onClick={saveEdit}>Save</button>
                        <button className="action-button cancel-button" onClick={closeEdit}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
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
                        <strong>Location:</strong> {item.address || 'Not specified'}
                      </p>
                      <p className="equipment-detail">
                        <strong>Status:</strong>{' '}
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
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inline modal removed: editing happens directly on the card */}
      </div>
    </div>
  );
}

