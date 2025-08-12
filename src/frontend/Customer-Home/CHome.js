import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Designs/Customer/CustomerHome.css';
import logoImage from '../../Assets/Logo.png';
import farmImage from '../../Assets/Farm.png';
import equipment1 from '../../Assets/Logo.png';
import equipment2 from '../../Assets/img1.png';
import equipment3 from '../../Assets/img2.png';
import equipment4 from '../../Assets/img3.png';
import { 
  FiUser, 
  FiLogOut, 
  FiShoppingCart, 
  FiPlusCircle, 
  FiList,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiShield
} from 'react-icons/fi';
import { 
  FaTractor, 
  FaTools, 
  FaSeedling,
  FaLeaf,
  FaWater,
  FaWarehouse
} from 'react-icons/fa';
import { GiFarmer, GiPlantWatering } from 'react-icons/gi';
import { MdPrecisionManufacturing, MdLocalShipping } from 'react-icons/md';

export default function CHome() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    { 
      src: equipment1, 
      alt: "Premium Tractors", 
      description: "High-performance tractors for all your farming needs",
      icon: <FaTractor className="slide-icon" />
    },
    { 
      src: equipment2, 
      alt: "Harvesting Equipment", 
      description: "Efficient harvesters to maximize your yield",
      icon: <GiFarmer className="slide-icon" />
    },
    { 
      src: equipment3, 
      alt: "Planting Tools", 
      description: "Precision planting equipment for optimal growth",
      icon: <FaSeedling className="slide-icon" />
    },
    { 
      src: equipment4, 
      alt: "Irrigation Systems", 
      description: "Advanced irrigation solutions for your fields",
      icon: <GiPlantWatering className="slide-icon" />
    }
  ];

  const features = [
    { icon: <FaTractor className="feature-icon" size={40} />, title: "Wide Selection", text: "Hundreds of agricultural equipment options" },
    { icon: <MdPrecisionManufacturing className="feature-icon" size={40} />, title: "Quality Assurance", text: "All equipment is professionally maintained" },
    { icon: <FiDollarSign className="feature-icon" size={40} />, title: "Affordable Rates", text: "Competitive pricing for all budgets" },
    { icon: <MdLocalShipping className="feature-icon" size={40} />, title: "Fast Delivery", text: "Quick equipment delivery to your farm" },
    { icon: <FiShield className="feature-icon" size={40} />, title: "Insurance", text: "All rentals include damage protection" },
    { icon: <FiCheckCircle className="feature-icon" size={40} />, title: "Easy Booking", text: "Simple online reservation system" }
  ];

  const quickActions = [
    { 
      icon: <FiPlusCircle className="action-icon" size={32} />, 
      title: "Request Equipment", 
      text: "Browse and request farming tools", 
      action: () => navigate(`/user/request-item`)
    },
    {
      icon: <FiList className="action-icon" size={32} />,
      title: "My Rentals",
      text: "View your current and past rentals",
      action: () => navigate(`/user/My-Request`)
    },
    {
      icon: <FiClock className="action-icon" size={32} />,
      title: "Rental History",
      text: "Check your equipment rental timeline",
      action: () => navigate(`/user/rental-history`)
    }
  ];

  useEffect(() => {
    const stored = localStorage.getItem('loggedUser');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      alert("Please login first");
      navigate("/signin/Users");
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (!user) return null;

  return (
    <div className="customer-home-scroll-container">

      <div className="customer-home-container">
        <div
          className="customer-home-background"
          style={{ backgroundImage: `url(${farmImage})` }}
        />
        
        {/* Header */}
        <header className="customer-home-header">
          <div className="header-content">
            <div className="logo-container">
              <img 
                src={logoImage} 
                alt="Agricultural Rental App Logo" 
                className="logo-img"
              />
              <span className="logo-text">Uzhavan Rentals</span>
            </div>
            
            <div className="user-actions">
  <button 
    className="header-button"
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
    <FiUser size={18} /> Profile
  </button>
              <button 
                className="header-button logout"
                onClick={() => navigate('/logout')}
              >
                <FiLogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </header>

      {/* Main Content */}
      <main className="customer-home-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Welcome, {user.name}!</h1>
            <p className="welcome-message">Find the perfect agricultural tools for your farming needs at competitive rates</p>
            
            <div className="action-buttons">
              <button
                className="primary-btn"
                onClick={() => navigate(`/user/My-Request`)}
              >
                <FiList size={18} /> My Rentals
              </button>
              <button
                className="secondary-btn"
                onClick={() => navigate(`/user/request-item`)}
              >
                <FiPlusCircle size={18} /> Request Equipment
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Why Choose Uzhavan Rentals?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                {feature.icon}
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Equipment Carousel */}
        <section className="equipment-carousel">
          <h2>Featured Equipment</h2>
          <div className="carousel-container">
            <div className="carousel-track" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
              {images.map((image, index) => (
                <div className="carousel-slide" key={index}>
                  <img src={image.src} alt={image.alt} />
                  <div className="slide-overlay">
                    <div className="slide-icon-container">
                      {image.icon}
                    </div>
                    <h3>{image.alt}</h3>
                    <p>{image.description}</p>
                    <button
                      className="explore-btn"
                      onClick={() => navigate(`/user/request-item`)}
                    >
                      Explore Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="carousel-nav">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="customer-home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src={logoImage} alt="AgriRent Logo" className="footer-logo" />
            <h3>Uzhavan Rentals</h3>
            <p>Your trusted agricultural equipment rental partner</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Services</h4>
              <a href="#">Equipment Rental</a>
              <a href="#">Maintenance</a>
              <a href="#">Delivery</a>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
            </div>
            <div className="link-group">
              <h4>Support</h4>
              <a href="#">Contact Us</a>
              <a href="#">FAQs</a>
              <a href="#">Help Center</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Uzhavan Rentals. All rights reserved.</p>
          <div className="legal-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
  );
}