import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor untuk JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk handle error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
};

// Products API
export const productsAPI = {
  getAll: (page = 1) => api.get(`/products?page=${page}`),
  getById: (uuid) => api.get(`/products/${uuid}`),
  create: (data) => api.post('/products', data),
  update: (uuid, data) => api.put(`/products/${uuid}`, data),
  delete: (uuid) => api.delete(`/products/${uuid}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (uuid) => api.get(`/orders/${uuid}`),
  create: (data) => api.post('/orders', data),
  update: (uuid, data) => api.put(`/orders/${uuid}`, data),
  delete: (uuid) => api.delete(`/orders/${uuid}`),
};

export default api;
