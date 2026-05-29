import axios from 'axios';
import { API_URL } from '../config/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

// Products APIs
export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// Categories APIs
export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Bookings APIs
export const bookingService = {
  getAll: () => api.get('/bookings'),
  create: (data) => api.post('/bookings', data),
  getById: (id) => api.get(`/bookings/${id}`),
  delete: (id) => api.delete(`/bookings/${id}`),
};

// Contact APIs
export const contactService = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  delete: (id) => api.delete(`/contact/${id}`),
};

export default api;
