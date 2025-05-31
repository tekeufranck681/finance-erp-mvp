import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:4500/api/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending/receiving cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from localStorage if you're not using cookies
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Optional, if you're using cookies this is not needed
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { logout } = useAuthStore.getState(); // ✅ access Zustand's logout

    if (error.response) {
      const status = error.response.status;
      const messageFromBackend = error.response.data?.message;

      switch (status) {
        case 401:
          toast.error(messageFromBackend || 'Session expired. Please login again.');
          logout(); // Logout the user on unauthorized error
          break;
        case 403:
          toast.error(messageFromBackend || 'You do not have permission to perform this action.');
          break;
        case 404:
          toast.error(messageFromBackend || 'Resource not found.');
          break;
        case 500:
          toast.error(messageFromBackend || 'Server error. Please try again later.');
          break;
        default:
          toast.error(messageFromBackend || 'An unexpected error occurred.');
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('Something went wrong. Please try again.');
    }

    return Promise.reject(error);
  }
);

export default api;
