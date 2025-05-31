import api from '../axiosConfig';

export const authService = {
  signup: async (credentials) => {
    try {
      const response = await api.post('/signup', credentials);
      // Extract success, message, and user from response data
      const { success, message, user } = response.data;
      if (!success) {
        // Throw error with backend message if signup failed
        throw new Error(message);
      }
      // Return user and message if signup succeeded
      return { user, message };
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      const { success, message, user } = response.data;
      if (!success) {
        throw new Error(message);
      }
      return { user, message };
    } catch (error) {
      throw error;
    }
  },
  
  validateToken: async () => {
    try {
      const response = await api.get('/check-auth');
      const { success, message, user } = response.data;
      if (!success) {
        throw new Error(message);
      }
      return { user, message };
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await api.post('/logout');
      const { success, message } = response.data;
      if (!success) {
        throw new Error(message);
      }
      return { message };
    } catch (error) {
      throw error;
    }
  },
};
