import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_CONFIG from '../../../config/api';
import {
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBoxOpen,
  FaLeaf
} from 'react-icons/fa';
import '../../../Designs/Customer/MyRequest.css';

export default function MyRequest() {
  const [myRequests, setMyRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState({});

  const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      // Prevent infinite fetching
      if (!user?.id && !user?._id) {
        console.log('No user ID available, skipping fetch');
        setIsLoading(false);
        return;
      }

      try {
        const requestsRes = await axios.get(API_CONFIG.getRequestUrl());
        const customerId = user?.id || user?._id;

        console.log('Current user ID:', customerId);
        console.log('Total requests found:', requestsRes.data.length);

        // Debug each request to see the customerId format
        requestsRes.data.forEach((req, index) => {
          console.log(`Request ${index}: customerId="${req.customerId}" (type: ${typeof req.customerId})`);
          if (req.customerId && typeof req.customerId === 'object') {
            console.log(`Request ${index}: customerId._id="${req.customerId._id}"`);
          }
        });

        const customerRequests = requestsRes.data.filter(req => {
          // Handle both string and ObjectId formats
          let reqCustomerId;
          if (req.customerId && typeof req.customerId === 'object') {
            // If customerId is an object (populated), get the _id
            reqCustomerId = req.customerId._id || req.customerId.toString();
          } else {
            // If customerId is a string
            reqCustomerId = String(req.customerId);
          }

          const userCustomerId = String(customerId);
          const match = reqCustomerId === userCustomerId;

          if (match) {
            console.log(`✅ MATCH: Request customerId="${reqCustomerId}" === User ID="${userCustomerId}"`);
          }

          return match;
        });

        console.log('My requests found:', customerRequests.length);
        console.log('My requests:', customerRequests);
        setMyRequests(customerRequests);
        setProviders({});
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a valid user
    if (user && (user.id || user._id)) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user?.id, user?._id]); // Only depend on user ID, not entire user object

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this request?")) {
      // Use backend API URL instead of frontend port
      const deleteUrl = `http://localhost:5000/api/requests/${id}`;
      console.log('Deleting request:', deleteUrl);

      axios.delete(deleteUrl)
        .then(() => {
          console.log('Request deleted successfully');
          setMyRequests(prev => prev.filter(req => req._id !== id && req.id !== id));
        })
        .catch(err => {
          console.error("Delete failed:", err);
          alert("Failed to delete request. Please try again.");
        });
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <FaCheckCircle className="status-icon" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  return (
    <div className="my-requests-scroll-container">
      <div className="my-requests-container">
        <div className="my-requests-header">
          <FaLeaf className="header-icon" />
          <h1>My Equipment Requests</h1>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your requests...</p>
          </div>
        ) : myRequests.length === 0 ? (
          <div className="no-requests">
            <FaBoxOpen className="empty-icon" />
            <p>You haven't made any equipment requests yet.</p>
            <p>Browse our equipment catalog to make your first request!</p>
          </div>
        ) : (
          <div className="requests-grid">
            {myRequests.map((req, index) => (
              <div 
                key={req.id} 
                className="request-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="request-card-header">
                  <h3>{req.equipmentName}</h3>
                </div>
                <div className="request-card-body">
                  <div className="request-details">
                    <p><strong>Requested At:</strong> {new Date(req.requestedAt).toLocaleString()}</p>
                    <p>
                      <strong>Status:</strong> 
                      <span className={`status ${getStatusClass(req.status)}`}>
                        {getStatusIcon(req.status)} {req.status}
                      </span>
                    </p>
                    {providers[req.providerId] ? (
                      <div className="provider-info">
                        <p><strong>Provider:</strong> {providers[req.providerId].name}</p>
                        <p><strong>Mobile:</strong> {providers[req.providerId].mobile}</p>
                        <p><strong>Address:</strong> {providers[req.providerId].address}</p>
                      </div>
                    ) : (
                      <p><strong>Provider ID:</strong> {req.providerId}</p>
                    )}
                  </div>
                  
                  <div className="request-actions">
  <button
    className="delete-btn outline-green"
    onClick={() => handleDelete(req.id)}
  >
    <FaTrash className="action-icon" /> Delete Request
  </button>
</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}