import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Automatically inject JWT access token into every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Process response errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If backend is unreachable (network error / connection refused)
    if (!error.response || error.code === 'ERR_NETWORK') {
      const networkMessage = 'Backend server is unreachable (localhost:5000)';
      console.warn('⚡ API Network Warning:', networkMessage);
      return Promise.reject(new Error(networkMessage));
    }

    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.warn('API Response Warning:', message);
    return Promise.reject(new Error(message));
  }
);

export default api;
