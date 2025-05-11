// src/services/api.js
import axios from 'axios';

const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/api` || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: backendUrl,
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Admin Insurance-Related Endpoints

// Review a single insurance application (approve or reject)
// POST /api/insurance/admin/review
export const reviewInsuranceApplication = (data) =>
  api.post('/insurance/admin/review', data);

// Get all insurance contracts
// GET /api/insurance/admin/contracts
export const getAllInsuranceContracts = (params) =>
  api.get('/insurance/admin/contracts', { params });

// Get insurance analytics with AI insights
// GET /api/insurance/admin/analytics
export const getInsuranceAnalytics = (params) =>
  api.get('/insurance/admin/analytics', { params });

// Bulk review insurance applications
// POST /api/admin/insurance/bulk-review
export const bulkReviewApplications = (data) =>
  api.post('/admin/insurance/bulk-review', data);

// Manage contract renewals (remind or renew)
// POST /api/admin/insurance/renewals
export const manageContractRenewals = (data) =>
  api.post('/admin-insurance/admin/renewals', data);

// Get contract details by user ID
// GET /api/admin/insurance/contract/:id
export const getContractById = (userId) =>
  api.get(`/admin-insurance/admin/contract/${userId}`);

// Analyze a contract with AI insights
// POST /api/admin/insurance/contract/:id/analyze
export const analyzeContract = (userId) =>
  api.post(`/admin-insurance/admin/contract/${userId}/analyze`);

// Update contract details
// PUT /api/admin/insurance/contract/:id
export const updateContract = (userId, data) =>
  api.put(`/admin-insurance/admin/contract/${userId}`, data);

// Terminate a contract
// POST /api/admin/insurance/contract/:id/terminate
export const terminateContract = (userId, data) =>
  api.post(`/admin-insurance/admin/contract/${userId}/terminate`, data);

// Get contract history
// GET /api/admin/insurance/contract/:id/history
export const getContractHistory = (userId) =>
  api.get(`/admin-insurance/admin/contract/${userId}/history`);

// Generate insurance contract report with AI insights
// GET /api/admin/insurance/report
export const generateContractReport = (params) =>
  api.get('/admin-insurance/admin/contract/report', { params, responseType: 'blob' });

// Existing User-Related Admin Endpoints (retained for completeness)
export const getUserDetails = (userId) => api.get(`/admin-auth/admin/users/${userId}`);
export const updateUser = (userId, data) => api.put(`/admin-auth/admin/users/${userId}`, data);
export const deactivateUser = (userId) => api.delete(`/admin-auth/admin/users/${userId}`);
export const getAllUsers = (params) => api.get('/admin-auth/admin/users', { params });
export const getAnalytics = (params) => api.get('/admin-auth/admin/analytics', { params });
export const generateUserReport = (params) =>
  api.get('/admin-auth/admin/report', { params, responseType: 'blob' });

export default api;