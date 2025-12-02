import api from './axios';

export const userApi = {
  // Get all published events
  getAllEvents: async () => {
    const response = await api.get('/user/listEvents');
    return response.data;
  },

  // Get event details by ID
  getEventById: async (eventId) => {
    const response = await api.get(`/user/event/${eventId}`);
    return response.data;
  },

  // Get user profile
  getUserProfile: async (userId) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (userId, data) => {
    const response = await api.patch(`/user/${userId}`, data);
    return response.data;
  },

  // Get upcoming events for user
  getUpcomingEvents: async (userId) => {
    const response = await api.get(`/user/${userId}/events/upcoming`);
    return response.data;
  },

  // Get completed events for user
  getCompletedEvents: async (userId) => {
    const response = await api.get(`/user/${userId}/events/completed`);
    return response.data;
  },

  // Register for an event
  registerForEvent: async (userId, eventId) => {
    const response = await api.post(`/user/${userId}/events/${eventId}/register`);
    return response.data;
  },

  // Cancel registration
  cancelRegistration: async (userId, eventId) => {
    const response = await api.patch(`/user/${userId}/events/${eventId}/register`);
    return response.data;
  }
};