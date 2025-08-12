import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_CONFIG from '../../../config/api';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaRupeeSign,
  FaFilter,
  FaSyncAlt,
  FaLeaf
} from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import '../../../Designs/Customer/Requests.css';

export default function Requests() {
  const [equipments, setEquipments] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_CONFIG.getEquipmentUrl());
        const availableEquipments = res.data.filter(e => e.available === true);
        setEquipments(availableEquipments);
        setFiltered(availableEquipments);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const result = equipments.filter(equip => {
      const matchSearch = equip.name.toLowerCase().includes(search.toLowerCase()) ||
                         equip.category.toLowerCase().includes(search.toLowerCase()) ||
                         equip.type.toLowerCase().includes(search.toLowerCase());
      const matchLocation = location === "" || (equip.address && equip.address.toLowerCase().includes(location.toLowerCase()));
      const matchCategory = selectedCategory === "all" || equip.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchSearch && matchLocation && matchCategory;
    });
    setFiltered(result);
  }, [search, location, equipments, selectedCategory]);

  const handleRequest = async (equipment) => {
    if (!equipments.some(e => e.id === equipment.id)) {
      alert("Equipment not found. Cannot submit request.");
      return;
    }

    if (!equipment.providerId) {
      alert("Invalid equipment data: providerId missing.");
      return;
    }

    // Get user data from localStorage if user prop is not available
    let currentUser = user;
    if (!currentUser || (!currentUser.id && !currentUser._id)) {
      try {
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
          currentUser = JSON.parse(storedUser);
          console.log('Using stored user data:', currentUser);
        }
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }

    console.log('User data for request:', currentUser);
    console.log('Equipment data:', equipment);

    // Get user ID consistently
    const userId = currentUser?._id || currentUser?.id;
    console.log('Using user ID for request:', userId);

    if (!userId) {
      alert("Please log in to submit a request. User ID not found.");
      return;
    }

    const requestData = {
      customerId: userId,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      customerMobile: currentUser.phone || currentUser.mobile,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      providerId: equipment.providerId,
      requestedAt: new Date().toISOString(),
      status: "pending"
    };

    try {
      // Create request object for backend
      const requestPayload = {
        customerId: userId, // Use the same userId variable
        customerEmail: currentUser.email,
        customerName: currentUser.name,
        customerMobile: currentUser.phone || currentUser.mobile,
        equipmentId: equipment.id,
        equipmentName: equipment.name,
        providerId: equipment.providerId?.id || equipment.providerId,
        providerEmail: equipment.providerEmail,
        providerName: equipment.providerName || 'Provider',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalDays: 7,
        pricePerDay: equipment.price,
        totalAmount: equipment.price * 7,
        message: `Request for ${equipment.name}`, // This is required by backend
        urgency: 'Medium', // Must match enum: Low, Medium, High, Urgent
        deliveryRequired: false,
        operatorRequired: false,
        specialRequirements: ''
      };

      console.log('Request payload:', requestPayload);

      const response = await axios.post(API_CONFIG.getRequestUrl(), requestPayload);
      console.log('Request submitted successfully:', response.data);
      alert("Request submitted successfully!");
      navigate(`/user/My-Request`);
    } catch (err) {
      console.error("Error submitting request:", err);
      console.error("Error details:", err.response?.data);

      const errorMessage = err.response?.data?.message ||
                          err.response?.data?.error ||
                          "Failed to submit request. Please try again.";
      alert(`Error: ${errorMessage}`);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setSelectedCategory("all");
  };

  const categories = [...new Set(equipments.map(item => item.category))];

  return (
    <div className="requests-scroll-container">
      <div className="requests-container">
        {/* Header */}
        <div className="requests-header-container">
          <FaLeaf className="header-icon" />
          <h1 className="requests-header">Available Equipment Rentals</h1>
          <div className="total-count">
            {filtered.length} {filtered.length === 1 ? 'Item' : 'Items'} Available
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filter-container">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, category or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="search-input-container">
            <FaMapMarkerAlt className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Filter by location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="category-filter">
            <BiCategory className="filter-icon" />
            <select 
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <button 
            className="reset-filters-btn"
            onClick={resetFilters}
          >
            <FaSyncAlt className="reset-icon" /> Reset
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading equipment...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="no-results">
            <FaFilter className="no-results-icon" />
            <p>No equipment matched your search criteria.</p>
            <button 
              className="refresh-button"
              onClick={resetFilters}
            >
              <FaSyncAlt className="refresh-icon" /> Reset Filters
            </button>
          </div>
        ) : (
          <div className="equipment-grid">
            {filtered.map((item, index) => (
              <div 
                key={item.id} 
                className="equipment-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <h3>{item.name}</h3>
                  <div className={`availability ${item.available ? 'available' : 'unavailable'}`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
                <div className="card-body">
                  <div className="card-detail">
                    <BiCategory className="detail-icon" />
                    <span>{item.category}</span>
                  </div>
                  <div className="card-detail">
                    <FaMapMarkerAlt className="detail-icon" />
                    <span>{item.address || "Location not specified"}</span>
                  </div>
                  <div className="card-detail price-detail">
                    <FaRupeeSign className="detail-icon" />
                    <span className="price">₹{item.price}/hr</span>
                  </div>
                  <button 
                    className="request-button"
                    onClick={() => handleRequest(item)}
                  >
                    Request Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}