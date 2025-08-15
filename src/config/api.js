/**
 * API Configuration Module for Agricultural Equipment Rental Platform
 *
 * This module provides a centralized configuration for all API endpoints
 * used throughout the frontend application. It handles dynamic port
 * configuration to support multiple user interfaces (user and provider).
 *
 * Key Features:
 * - Dynamic port detection for multi-interface support
 * - Centralized endpoint management
 * - Environment-based configuration
 * - Helper methods for URL construction
 *
 * Author: Development Team
 * Purpose: Streamlined API communication management
 */

import PORT_CONFIG from './portConfig';

// Production-Ready API configuration with environment detection
const API_CONFIG = {
  // Backend API Base URL - automatically detects deployment environment
  BASE_URL: (() => {
    // Priority order for API URL determination:
    // 1. Explicit environment variable for API URL
    // 2. Backend URL environment variable with /api suffix
    // 3. Development localhost fallback

    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }

    if (process.env.REACT_APP_BACKEND_URL) {
      return `${process.env.REACT_APP_BACKEND_URL}/api`;
    }

    // Development fallback
    return 'http://localhost:5000/api';
  })(),

  // Current frontend info
  CURRENT_PORT: PORT_CONFIG.getCurrentPort(),
  CURRENT_USER_TYPE: PORT_CONFIG.getUserTypeByPort(),
  
  // Authentication endpoints
  AUTH: {
    USER_SIGNUP: '/auth/user/signup',
    USER_SIGNIN: '/auth/user/signin',
    USER_ACTIVATE: '/auth/user/activate',
    PROVIDER_SIGNUP: '/auth/provider/signup',
    PROVIDER_SIGNIN: '/auth/provider/signin',
    PROVIDER_ACTIVATE: '/auth/provider/activate',
    FORGOT_PASSWORD: '/auth/password/forgot',
    RESET_PASSWORD: '/auth/password/reset'
  },
  
  // Data endpoints
  ENDPOINTS: {
    USERS: '/users',
    PROVIDERS: '/providers',
    EQUIPMENTS: '/equipments',
    REQUESTS: '/requests'
  },
  
  // Helper methods to build full URLs
  getAuthUrl: (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`,
  getDataUrl: (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`,
  
  // Specific URL builders
  getUserUrl: (id = '') => `${API_CONFIG.BASE_URL}/users${id ? `/${id}` : ''}`,
  getProviderUrl: (id = '') => `${API_CONFIG.BASE_URL}/providers${id ? `/${id}` : ''}`,
  getEquipmentUrl: (id = '') => `${API_CONFIG.BASE_URL}/equipments${id ? `/${id}` : ''}`,
  getRequestUrl: (id = '') => `${API_CONFIG.BASE_URL}/requests${id ? `/${id}` : ''}`,
  
  // Provider specific endpoints
  getProviderEquipmentUrl: (providerId) => `${API_CONFIG.BASE_URL}/providers/${providerId}/equipment`,
  getProviderRequestsUrl: (providerId) => `${API_CONFIG.BASE_URL}/providers/${providerId}/requests`
};

export default API_CONFIG;
