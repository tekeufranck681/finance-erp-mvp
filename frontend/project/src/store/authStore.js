import { create } from 'zustand';
import { authService } from '../api/services/authService';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isAuthLoading: true,
  error: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),

  signup: async (userInfo) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.signup(userInfo);
      const { user } = data;
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Signup failed',
      });
      throw error;
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(credentials);
      const { user } = data;
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Login failed',
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout(); // server clears cookie
    } catch (error) {
      console.error('Logout error:', error.message);
    }
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
  set({ isAuthLoading: true }); // start loading

  try {
    const data = await authService.validateToken(); // hits /check-auth
    set({ user: data.user, isAuthenticated: true, isAuthLoading: false });
    return true;
  } catch (error) {
    set({ user: null, isAuthenticated: false, isAuthLoading: false });
    return false;
  }
},


  clearError: () => set({ error: null }),
}));
