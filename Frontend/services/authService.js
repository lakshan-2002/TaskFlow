import apiClient from './api';

const AUTH_ENDPOINTS = {
  LOGIN: '/users/login',
  REGISTER: '/users/register',
};

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise} User data
 */
export const loginUser = async (credentials) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
  return response.data;
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise} User data
 */
export const registerUser = async (userData) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
  return response.data;
};

/**
 * Get user from localStorage
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

/**
 * Save user to localStorage
 * @param {Object} user - User object
 */
export const saveUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

/**
 * Remove user from localStorage
 */
export const removeUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};
