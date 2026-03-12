import apiClient from './api';

const TASK_ENDPOINTS = {
  BASE: '/tasks',
};

/**
 * Get all tasks for a user
 * @param {number} userId - User ID
 * @returns {Promise} Array of tasks
 */
export const getAllTasks = async (userId) => {
  const response = await apiClient.get(`${TASK_ENDPOINTS.BASE}/${userId}`);
  return response.data;
};

/**
 * Get a single task by ID
 * @param {number} taskId - Task ID
 * @returns {Promise} Task object
 */
export const getTaskById = async (taskId) => {
  const response = await apiClient.get(`${TASK_ENDPOINTS.BASE}/${taskId}`);
  return response.data;
};

/**
 * Create a new task
 * @param {Object} taskData - Task data including user object
 * @returns {Promise} Created task
 */
export const createTask = async (taskData) => {
  const response = await apiClient.post(TASK_ENDPOINTS.BASE, taskData);
  return response.data;
};

/**
 * Update an existing task
 * @param {number} taskId - Task ID
 * @param {Object} taskData - Updated task data
 * @returns {Promise} Updated task
 */
export const updateTask = async (taskId, taskData) => {
  const response = await apiClient.put(`${TASK_ENDPOINTS.BASE}/${taskId}`, taskData);
  return response.data;
};

/**
 * Delete a task
 * @param {number} taskId - Task ID
 * @returns {Promise}
 */
export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(`${TASK_ENDPOINTS.BASE}/${taskId}`);
  return response.data;
};

/**
 * Get tasks filtered by status
 * @param {number} userId - User ID
 * @param {string} status - Task status ('pending', 'completed', etc.)
 * @returns {Promise} Array of filtered tasks
 */
export const getTasksByStatus = async (userId, status) => {
  const allTasks = await getAllTasks(userId);
  return allTasks.filter(task => task.status?.toLowerCase() === status.toLowerCase());
};

/**
 * Get completed tasks for a user
 * @param {number} userId - User ID
 * @returns {Promise} Array of completed tasks
 */
export const getCompletedTasks = async (userId) => {
  return getTasksByStatus(userId, 'completed');
};

/**
 * Get pending tasks for a user
 * @param {number} userId - User ID
 * @returns {Promise} Array of pending tasks
 */
export const getPendingTasks = async (userId) => {
  return getTasksByStatus(userId, 'pending');
};
