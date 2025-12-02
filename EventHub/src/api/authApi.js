import api from './axios';

export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    return response;
  },

  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  }
};