import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../../config/api';


export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPasswordVerification, setShowPasswordVerification] = useState(false);
  const navigate = useNavigate();

  // Check if user is authenticated
  const isAuthenticated = () => {
    const loggedUser = localStorage.getItem('loggedUser');
    const userType = localStorage.getItem('userType');
    try {
      const userData = JSON.parse(loggedUser || '{}');
      return loggedUser !== null && userData.id && userType;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check authentication using localStorage
        if (!isAuthenticated()) {
          navigate('/signin/user');
          return;
        }

        const userData = JSON.parse(localStorage.getItem('loggedUser') || '{}');
        const userType = localStorage.getItem('userType') || 'user';
        const userId = userData.email || userData.id;

        if (!userData || !userId) {
          setError("No user data found. Please log in again.");
          navigate('/signin/user');
          return;
        }

        try {
          let currentUser = null;

          // Fetch user data from backend based on userType
          try {
            const endpoint = userType === 'provider'
              ? API_CONFIG.getProviderUrl(userData.id)
              : API_CONFIG.getUserUrl(userData.id);

            const response = await axios.get(endpoint);
            if (response.data) {
              currentUser = response.data;
            }
          } catch (fetchErr) {
          }

          if (currentUser) {
            setUser(currentUser);

            // Set form with proper field mapping
            const formData = {
              name: currentUser.name || '',
              email: currentUser.email || '',
              phone: currentUser.phone || '',
              address: currentUser.address || '',
              businessName: currentUser.businessName || '',
              businessType: currentUser.businessType || '',
              licenseNumber: currentUser.licenseNumber || ''
            };
            setForm(formData);

            // Update localStorage with fresh data
            localStorage.setItem('loggedUser', JSON.stringify({
              id: currentUser._id || currentUser.id,
              _id: currentUser._id || currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
              phone: currentUser.phone,
              address: currentUser.address,
              userType: currentUser.userType || userType
            }));
          } else {
            // Fallback to localStorage data
            setUser(userData);
            setForm(userData);
          }
        } catch (err) {
          // Fallback to localStorage data if json-server is not available
          setUser(userData);
          setForm(userData);
        }
      } catch (err) {
        setError("Failed to load profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const verifyCurrentPassword = async (password) => {
    try {
      const userData = JSON.parse(localStorage.getItem('loggedUser') || '{}');
      const userType = localStorage.getItem('userType') || 'user';
      if (!userData.email || !password || !userType) {
        return false;
      }

      // Use backend password verification endpoint
      const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/verify-password`, {
        email: userData.email,
        password: password.trim(),
        userType: userType
      });

      return response.data.success && response.data.isValid;
    } catch (err) {
      return false;
    }
  };

  const handleSaveClick = () => {
    // Show password verification dialog
    setShowPasswordVerification(true);
  };

  const handleUpdate = async () => {
    try {
      // First verify the current password
      if (!currentPassword) {
        alert("Please enter your current password to save changes.");
        return;
      }

      const isPasswordValid = await verifyCurrentPassword(currentPassword);
      if (!isPasswordValid) {
        alert("Current password is incorrect. Please try again.");
        setCurrentPassword('');
        return;
      }

      const userData = JSON.parse(localStorage.getItem('loggedUser') || '{}');
      const userType = localStorage.getItem('userType') || 'user';

      // Get the correct user ID - use multiple sources
      const userId = user?._id || user?.id || userData._id || userData.id;
      if (!userId) {
        alert("User ID not found. Please log in again.");
        navigate('/signin/user');
        return;
      }

      // Prepare updated data
      const updatedData = {
        ...user,
        ...form
      };

      // Update in backend database
      let updateSuccess = false;

      try {
        const endpoint = userType === 'provider'
          ? API_CONFIG.getProviderUrl(userId)
          : API_CONFIG.getUserUrl(userId);

        const response = await axios.patch(endpoint, updatedData);

        if (response.data && response.data.success) {
          updateSuccess = true;
          // Access the actual user data from response.data.data
          const userData = response.data.data;
          // Update localStorage with new data - preserve the original user ID
          const updatedUserData = {
            id: userId, // Use the same userId we used for the update
            _id: userId, // Ensure both id and _id are set
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            userType: userData.userType || userType
          };
          // Add business fields for providers
          if (userType === 'provider') {
            updatedUserData.businessName = userData.businessName;
            updatedUserData.businessType = userData.businessType;
            updatedUserData.licenseNumber = userData.licenseNumber;
          }

          localStorage.setItem('loggedUser', JSON.stringify(updatedUserData));

          // Update both user state and form state immediately
          setUser(userData); // Use userData instead of response.data

          // Update form with the actual user data
          const newFormData = {
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || '',
            businessName: userData.businessName || '',
            businessType: userData.businessType || '',
            licenseNumber: userData.licenseNumber || ''
          };
          setForm(newFormData);
        }
      } catch (updateErr) {
        const errorMessage = updateErr.response?.data?.message || "Failed to update profile";
        alert(errorMessage);
      }

      if (updateSuccess) {
        setEditMode(false);
        setShowPasswordVerification(false);
        setCurrentPassword('');

        // Show success message
        alert("Profile updated successfully!");

        // Simply refresh the form with the updated data - no additional fetch needed
      } else {
        alert("Failed to update profile in database. Please try again.");
      }
    } catch (err) {
      alert("Failed to update profile. Try again.");
    }
  };

  const handleCancelPasswordVerification = () => {
    setShowPasswordVerification(false);
    setCurrentPassword('');
  };

  if (isLoading) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-container">
          <p className="loading-text">
            <span className="loading-spinner"></span>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-container">
          <p className="error-text">{error}</p>
          <button 
            className="profile-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page-wrapper">
        <div className="profile-container">
          <p>User not found. Please log in again.</p>
          <button
            className="profile-button"
            onClick={() => navigate('/signin/user')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Get userType from localStorage or URL params for flexibility
  const urlUserType = window.location.pathname.includes('provider') ? 'provider' : 'user';
  const storageUserType = localStorage.getItem('userType');
  const userType = storageUserType || urlUserType || 'user';

  const profileTitle = userType === 'provider'
    ? 'Provider Profile'
    : 'User Profile';

  return (
    <div className="profile-page">
      <div className="profile-page-wrapper">
        <div className="profile-container" data-user-type={userType}>
          <h1 className="profile-header">{profileTitle}</h1>

          {editMode ? (
            <form className="profile-form">
              {/* Common Fields */}
              <div>
                <label className="profile-label">Name</label>
                <input
                  className="profile-input"
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="profile-label">Phone</label>
                <input
                  className="profile-input"
                  name="phone"
                  value={form.phone || form.mobile || ""}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="profile-label">Email</label>
                <input
                  className="profile-input"
                  name="email"
                  value={form.email || ""}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              <div>
                <label className="profile-label">Address</label>
                <input
                  className="profile-input"
                  name="address"
                  value={form.address || ""}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>

              {/* Provider-specific Fields - Only show if user is provider or has provider data */}
              {(userType === 'provider' || user?.businessName) && (
                <>
                  <div className="profile-section-divider">
                    <h4>Business Information (Optional)</h4>
                  </div>
                  <div>
                    <label className="profile-label">Business Name</label>
                    <input
                      className="profile-input"
                      name="businessName"
                      value={form.businessName || ""}
                      onChange={handleChange}
                      placeholder="Enter business name (optional)"
                    />
                  </div>
                  <div>
                    <label className="profile-label">Business Type</label>
                    <select
                      className="profile-input"
                      name="businessType"
                      value={form.businessType || ""}
                      onChange={handleChange}
                    >
                      <option value="">Select business type</option>
                      <option value="Equipment Rental">Equipment Rental</option>
                      <option value="Farm Services">Farm Services</option>
                      <option value="Agricultural Contractor">Agricultural Contractor</option>
                      <option value="Equipment Dealer">Equipment Dealer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="profile-label">New Password</label>
                <input
                  className="profile-input"
                  name="password"
                  value={form.password || ""}
                  onChange={handleChange}
                  placeholder="Enter new password (leave blank to keep current)"
                  type="password"
                />
              </div>
              <div className="button-group">
                <button
                  type="button"
                  className="profile-button save-button"
                  onClick={handleSaveClick}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="profile-button cancel-button"
                  onClick={() => {
                    setEditMode(false);
                    setShowPasswordVerification(false);
                    setCurrentPassword('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="profile-details">
                {/* Common Profile Information */}
                <div className="profile-detail">
                  <span className="profile-label">Name</span>
                  <span className="profile-value">{user.name}</span>
                </div>
                <div className="profile-detail">
                  <span className="profile-label">Phone</span>
                  <span className="profile-value">{user.phone || user.mobile || "Not specified"}</span>
                </div>
                <div className="profile-detail">
                  <span className="profile-label">Email</span>
                  <span className="profile-value">{user.email}</span>
                </div>
                <div className="profile-detail">
                  <span className="profile-label">Address</span>
                  <span className="profile-value">
                    {user.address && typeof user.address === 'object'
                      ? `${user.address.street || ''}, ${user.address.city || ''}, ${user.address.state || ''} ${user.address.zipCode || ''}, ${user.address.country || ''}`
                          .replace(/^,\s*|,\s*$|,\s*,/g, '')
                          .replace(/^,\s*/, '')
                          .replace(/,\s*$/, '') || "Not specified"
                      : user.address || "Not specified"
                    }
                  </span>
                </div>

                {/* Additional Information - Show if available */}
                {(user.businessName || user.businessType || user.createdAt) && (
                  <>
                    <div className="profile-section-divider">
                      <h3>{userType === 'provider' ? 'Business Information' : 'Account Information'}</h3>
                    </div>

                    {/* Business info - only show if exists */}
                    {user.businessName && (
                      <div className="profile-detail">
                        <span className="profile-label">Business Name</span>
                        <span className="profile-value">{user.businessName}</span>
                      </div>
                    )}
                    {user.businessType && (
                      <div className="profile-detail">
                        <span className="profile-label">Business Type</span>
                        <span className="profile-value">{user.businessType}</span>
                      </div>
                    )}

                    {/* Account info - show for all users */}
                    <div className="profile-detail">
                      <span className="profile-label">Account Type</span>
                      <span className="profile-value" data-account-type="true">
                        {userType === 'provider' ? 'Provider Account' : 'Customer Account'}
                      </span>
                    </div>
                    {user.createdAt && (
                      <div className="profile-detail">
                        <span className="profile-label">Member Since</span>
                        <span className="profile-value">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="button-group">
                <button
                  className="profile-button edit-button"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}

          {/* Password Verification Modal */}
          {showPasswordVerification && (
            <div className="password-verification-overlay">
              <div className="password-verification-modal">
                <h3>Verify Your Identity</h3>
                <p>Please enter your current password to save changes:</p>
                <div className="password-input-group">
                  <input
                    type="password"
                    className="profile-input"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdate();
                      }
                    }}
                    autoFocus
                  />
                </div>
                <div className="password-verification-buttons">
                  <button
                    type="button"
                    className="profile-button save-button"
                    onClick={handleUpdate}
                    disabled={!currentPassword}
                  >
                    Confirm & Save
                  </button>
                  <button
                    type="button"
                    className="profile-button cancel-button"
                    onClick={handleCancelPasswordVerification}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}