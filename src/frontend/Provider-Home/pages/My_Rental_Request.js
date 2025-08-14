import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../../config/api';
import '../../../Designs/PHome.css';
import logo from '../../../Assets/Logo.png';
import { FiUser, FiLogOut, FiCheckCircle, FiX } from 'react-icons/fi';
import { FaClipboardList } from 'react-icons/fa';

export default function MyRentalRequest() {
  const [requests, setRequests] = useState([]);
  const [providerId, setProviderId] = useState("");
  const [userMap, setUserMap] = useState({});
  const [equipmentMap, setEquipmentMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');

    if (user && user.id) {
      setProviderId(user.id);
    } else {
      alert("Please login as a provider.");
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      // Fetch requests & equipment
      const reqRes = await axios.get(API_CONFIG.getRequestUrl());
      const equipmentRes = await axios.get(API_CONFIG.getEquipmentUrl());

      // Create user map
      const reqUserMap = {};
      reqRes.data.forEach(r => {
        reqUserMap[String(r.customerId)] = {
          mobile: r.customerMobile,
          name: r.customerName
        };
      });
      setUserMap(reqUserMap);

      // Create equipment map
      const eqMap = {};
      equipmentRes.data.forEach(equip => {
        eqMap[equip.id] = equip;
      });
      setEquipmentMap(eqMap);

      // Filter requests for this provider
      const filtered = reqRes.data.filter(req => {
        return String(req.providerId) === String(providerId);
      });

      setRequests(filtered);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    if (providerId) {
      fetchData();
    }
  }, [providerId, fetchData]);

  const updateStatus = async (id, newStatus) => {
    try {
      // First, test if we can GET the request
      try {
        const getResponse = await axios.get(API_CONFIG.getRequestUrl(id));
      } catch (getError) {
        alert(`Cannot find request ${id}. Please check if backend is running.`);
        return;
      }

      // Step 1: Update the request status
      const updateData = {
        status: newStatus,
        responseDate: new Date().toISOString(),
        responseMessage: newStatus === "approved"
          ? "Your request has been approved. Equipment will be delivered as scheduled."
          : "Your request has been rejected. Please try another equipment or contact the provider."
      };

      // Use the correct status update endpoint
      const statusUpdateUrl = `${API_CONFIG.getRequestUrl(id)}/status`;
      await axios.patch(statusUpdateUrl, updateData);

      // Step 2: Find the request to get equipment ID
      const request = requests.find(req => req.id === id);
      if (!request) {
        alert("Request not found!");
        return;
      }

      // Step 3: Update equipment availability if equipment exists
      if (request.equipmentId) {
        const equipmentUpdateData = {
          available: newStatus === "approved" ? false : true
        };

        await axios.patch(
          API_CONFIG.getEquipmentUrl(request.equipmentId),
          equipmentUpdateData
        );
      }

      // Step 4: Update local state
      setRequests(prev =>
        prev.map(req =>
          req.id === id ? { ...req, status: newStatus, responseDate: updateData.responseDate, responseMessage: updateData.responseMessage } : req
        )
      );

      // Step 5: Show success message
      if (newStatus === "approved") {
        alert("Request approved successfully! Equipment is now unavailable for other customers.");
      } else if (newStatus === "rejected") {
        alert("Request rejected successfully! Equipment is now available for other customers.");
      }

    } catch (err) {
      alert(`Failed to update request status: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="provider-home-page">
      <img src={logo} alt="Logo" className="provider-logo" />

      <div className="provider-header">
        <h1 className="welcome-title">My Rental Requests</h1>
        <div className="provider-info">
          <div className="location-badge">
            <p>Manage Requests:</p>
            <FaClipboardList />
            {requests.length} Requests
          </div>

          <div className="header-buttons">
            <button
              className="profile-button profile"
              onClick={() => {
                const type = localStorage.getItem('userType') || 'provider';
                navigate(`/profile/${type}/${providerId}`);
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

      {/* Requests Container */}
      <div className="catalog-container">
        <div className="catalog-header">
          <h2 className="catalog-title">Rental Requests</h2>
          {isLoading ? (
            <p className="no-equipment">Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className="no-equipment">No rental requests found for your equipment.</p>
          ) : null}
        </div>

        {!isLoading && requests.length > 0 && (
          <div className="catalog-body">
            <div className="equipment-grid">
              {requests.map((req, index) => {
                const user = userMap[String(req.customerId)];
                const equipment = req.equipmentId ? equipmentMap[req.equipmentId] : null;

                return (
                  <div key={req.id || index} className="equipment-card">
                    <h3 className="equipment-name">{req.equipmentName}</h3>
                    {equipment && (
                      <p className="equipment-detail">
                        <strong>Equipment Status:</strong>{" "}
                        <span className={`status-badge ${equipment.available ? 'available' : 'unavailable'}`}>
                          {equipment.available ? 'Available' : 'Unavailable'}
                        </span>
                      </p>
                    )}
                    <p className="equipment-detail">
                      <strong>Customer Name:</strong> {req.customerName}
                    </p>
                    <p className="equipment-detail">
                      <strong>Mobile:</strong> {user?.mobile || req.customerMobile || 'Unknown'}
                    </p>
                    {req.equipmentId && (
                      <p className="equipment-detail">
                        <strong>Equipment ID:</strong> {req.equipmentId}
                      </p>
                    )}
                    <p className="equipment-detail">
                      <strong>Requested At:</strong> {new Date(req.requestedAt).toLocaleString()}
                    </p>
                    <p className="equipment-detail">
                      <strong>Request Status:</strong>{" "}
                      <span className={`status-badge ${req.status.toLowerCase()}`}>
                        {req.status}
                      </span>
                    </p>

                    {req.status === "pending" && (
                      <div className="action-buttons" style={{ marginTop: '1rem', gap: '0.5rem' }}>
                        <button
                          className="action-button primary"
                          onClick={() => updateStatus(req.id, "approved")}
                          style={{ minWidth: 'auto', padding: '0.5rem 1rem' }}
                        >
                          <FiCheckCircle /> Approve
                        </button>
                        <button
                          className="action-button info"
                          onClick={() => updateStatus(req.id, "rejected")}
                          style={{ minWidth: 'auto', padding: '0.5rem 1rem' }}
                        >
                          <FiX /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
