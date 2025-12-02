import api from './axios';

export const adminApi = {
  // User Management
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUserDetails: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  addUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deactivateUser: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/deactivate`);
    return response.data;
  },

  // Event Management
  getAllEvents: async () => {
    const response = await api.get('/admin/events');
    return response.data;
  },

  deactivateEvent: async (eventId) => {
    const response = await api.patch(`/admin/events/${eventId}/deactivate`);
    return response.data;
  },

  // Manager Management
  getAllManagers: async () => {
    const response = await api.get('/admin/managers');
    return response.data;
  },

  getManagerEvents: async (managerId) => {
    const response = await api.get(`/admin/managers/${managerId}/events`);
    return response.data;
  }
};