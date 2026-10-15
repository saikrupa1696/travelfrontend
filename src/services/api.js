import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('travelmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.fieldErrors) {
      message = Object.values(error.response.data.fieldErrors).join(', ');
    } else if (error.message) {
      message = error.message;
    }

    if (error.response?.status === 401) {
      // Clear token if expired or invalid
      localStorage.removeItem('travelmate_token');
      localStorage.removeItem('travelmate_user');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register') && !window.location.pathname.startsWith('/shared')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getCurrentUser: () => api.get('/api/auth/me'),
};

export const userApi = {
  updateProfile: (data) => api.put('/api/users/me', data),
  changePassword: (data) => api.put('/api/users/me/password', data),
};

export const tripsApi = {
  create: (data) => api.post('/api/trips', data),
  getAll: (destination, travelType) => {
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (travelType) params.append('travelType', travelType);
    return api.get(`/api/trips?${params.toString()}`);
  },
  getById: (id) => api.get(`/api/trips/${id}`),
  update: (id, data) => api.put(`/api/trips/${id}`, data),
  delete: (id) => api.delete(`/api/trips/${id}`),
  share: (id) => api.post(`/api/trips/${id}/share`),
  revokeShare: (id) => api.post(`/api/trips/${id}/revoke-share`),
};

export const itineraryApi = {
  generate: (tripId) => api.post(`/api/trips/${tripId}/itinerary/generate`),
  get: (tripId) => api.get(`/api/trips/${tripId}/itinerary`),
  update: (tripId, data) => api.put(`/api/trips/${tripId}/itinerary`, data),
  modify: (tripId, data) => api.post(`/api/trips/${tripId}/itinerary/modify`, data),
  regenerate: (tripId) => api.post(`/api/trips/${tripId}/itinerary/regenerate`),
};

export const placesApi = {
  search: (destination) => api.get(`/api/places/search?destination=${encodeURIComponent(destination || '')}`),
  geocode: (query) => api.get(`/api/places/geocode?query=${encodeURIComponent(query || '')}`),
};

export const sharedApi = {
  getTrip: (token) => api.get(`/api/shared/${token}`),
  getItinerary: (token) => api.get(`/api/shared/${token}/itinerary`),
};

export default api;
