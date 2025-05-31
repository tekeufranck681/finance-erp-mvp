import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'http://localhost:4500/api/download'; // Updated base URL for expenses

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Keep if your backend uses cookies for auth/session
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Optional if you use cookies instead
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { logout } = useAuthStore.getState();

    if (error.response) {
      const status = error.response.status;
      const messageFromBackend = error.response.data?.message;

      switch (status) {
        case 401:
          toast.error(messageFromBackend || 'Session expired. Please login again.');
          logout(); // Log out user on unauthorized
          break;
        case 403:
          toast.error(messageFromBackend || 'You do not have permission to perform this action.');
          break;
        case 404:
          toast.error(messageFromBackend || 'Expense not found.');
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
