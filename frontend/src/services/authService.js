import api from './api';

export const authService = {
  // Register new user — returns { message, userId } (backend doesn't issue token on register)
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  },

  // Login user — returns { message, token, user }
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  },
};

export default authService;
