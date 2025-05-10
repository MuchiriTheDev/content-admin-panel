// src/services/api.js
import axios from 'axios';

const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/api` || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: backendUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllUsers = (params) => api.get('/admin-auth/admin/users', { params });
export const getAnalytics = (params) => api.get('/admin-auth/admin/analytics', { params });
export const generateUserReport = (params) =>
  api.get('/admin-auth/admin/report', { params, responseType: 'blob' });

export default api;