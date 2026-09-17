import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1';

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

// Helper to upload single/multiple image files to Cloudinary via backend
export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('files', file);

    const response: any = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const urls = response.data || response || [];
    if (Array.isArray(urls) && urls.length > 0) {
      return urls[0];
    }
    return '';
  } catch (err: any) {
    console.warn('Cloudinary upload warning, using local file preview:', err.message);
    return URL.createObjectURL(file);
  }
};

