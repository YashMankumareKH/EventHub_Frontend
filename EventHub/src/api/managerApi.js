import api from './axios';

export const managerApi = {
  // Create new event
  createEvent: async (managerId, eventData) => {
    const response = await api.post(`/manager/${managerId}`, eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (eventId, eventData) => {
    const response = await api.put(`/manager/event/${eventId}`, eventData);
    return response.data;
  },

  // Get all manager events
  getManagerEvents: async (managerId) => {
    const response = await api.get(`/manager/event/${managerId}`);
    return response.data;
  },

  // Delete event
  deleteEvent: async (eventId) => {
    const response = await api.patch(`/manager/event/${eventId}/delete`);
    return response.data;
  },

  // Get event registrations/attendees
  getEventAttendees: async (eventId) => {
    const response = await api.get(`/manager/event/${eventId}/attendees`);
    return response.data;
  },

  // Cancel user registration
  cancelUserRegistration: async (eventId, attendeeId) => {
    const response = await api.patch(`/manager/event/${eventId}/attendees/${attendeeId}`);
    return response.data;
  },

  // Cancel event
  cancelEvent: async (eventId) => {
    const response = await api.patch(`/manager/event/${eventId}`);
    return response.data;
  }
};