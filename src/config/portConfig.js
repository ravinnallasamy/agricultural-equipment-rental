// Dynamic port configuration for frontend
const PORT_CONFIG = {
  // Default ports for different user types
  USER_PORT: 3000,
  PROVIDER_PORT: 3001,
  ADMIN_PORT: 3002,
  
  // Get current port from window location or environment
  getCurrentPort() {
    if (typeof window !== 'undefined') {
      return window.location.port || '3000';
    }
    return process.env.PORT || '3000';
  },
  
  // Determine user type based on current port
  getUserTypeByPort(port = null) {
    const currentPort = port || this.getCurrentPort();
    
    switch (currentPort.toString()) {
      case '3000':
        return 'user';
      case '3001':
        return 'provider';
      case '3002':
        return 'admin';
      default:
        // Default to user if port is unknown
        return 'user';
    }
  },
  
  // Get the appropriate frontend URL for current context
  getFrontendUrl(port = null) {
    const currentPort = port || this.getCurrentPort();
    return `http://localhost:${currentPort}`;
  },
  
  // Get all possible frontend URLs
  getAllFrontendUrls() {
    return [
      `http://localhost:${this.USER_PORT}`,
      `http://localhost:${this.PROVIDER_PORT}`,
      `http://localhost:${this.ADMIN_PORT}`
    ];
  },
  
  // Check if current port is for providers
  isProviderPort(port = null) {
    const currentPort = port || this.getCurrentPort();
    return currentPort.toString() === this.PROVIDER_PORT.toString();
  },
  
  // Check if current port is for users
  isUserPort(port = null) {
    const currentPort = port || this.getCurrentPort();
    return currentPort.toString() === this.USER_PORT.toString();
  },
  
  // Get redirect URL for specific user type
  getRedirectUrl(userType) {
    switch (userType) {
      case 'user':
        return `http://localhost:${this.USER_PORT}`;
      case 'provider':
        return `http://localhost:${this.PROVIDER_PORT}`;
      case 'admin':
        return `http://localhost:${this.ADMIN_PORT}`;
      default:
        return `http://localhost:${this.USER_PORT}`;
    }
  }
};

export default PORT_CONFIG;
