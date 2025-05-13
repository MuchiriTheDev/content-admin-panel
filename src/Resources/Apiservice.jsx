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

// PREMIUMS RELATED
export const getAllPremiums = async (filters) => api.get('/premiums/admin/all', { params: filters });
export const getOverduePremiums = async () => api.get('/premiums/overdue');
export const generatePremiumReport = async (filters) =>
  api.post('/admin-premiums/admin/report', filters, { responseType: 'blob' });
export const bulkAdjustPremiums = async (data) => api.post('/admin-premiums/admin/bulk-adjust', data);
export const sendPaymentReminders = async (data) => api.post('/admin-premiums/admin/reminders', data);
export const auditPremiumsWithAI = async (data) => api.post('/admin-premiums/admin/audit', data);
export const getPremiumHistory = async (premiumId) => api.get(`/admin-premiums/admin/${premiumId}/history`);
export const adjustPremium = async (premiumId, data) => api.put(`/premiums/admin/${premiumId}/adjust`, data);
export const retryPayment = async (data) => api.post('/premiums/retry-payment', data);
export const getPremiumAnalytics = async (filters) => api.get('/premiums/admin/analytics', { params: filters });

// ADMIN INSURANCE-RELATED ENDPOINTS
export const reviewInsuranceApplication = (data) => api.post('/insurance/admin/review', data);
export const getAllInsuranceContracts = (params) => api.get('/insurance/admin/contracts', { params });
export const getInsuranceAnalytics = (params) => api.get('/insurance/admin/analytics', { params });
export const bulkReviewApplications = (data) => api.post('/admin/insurance/bulk-review', data);
export const manageContractRenewals = (data) => api.post('/admin-insurance/admin/renewals', data);
export const getContractById = (userId) => api.get(`/admin-insurance/admin/contract/${userId}`);
export const analyzeContract = (userId) => api.post(`/admin-insurance/admin/contract/${userId}/analyze`);
export const updateContract = (userId, data) => api.put(`/admin-insurance/admin/contract/${userId}`, data);
export const terminateContract = (userId, data) =>
  api.post(`/admin-insurance/admin/contract/${userId}/terminate`, data);
export const getContractHistory = (userId) => api.get(`/admin-insurance/admin/contract/${userId}/history`);
export const generateContractReport = (params) =>
  api.get('/admin-insurance/admin/report', { params, responseType: 'blob' });

// USERS RELATED
export const getUserDetails = (userId) => api.get(`/admin-auth/admin/users/${userId}`);
export const updateUser = (userId, data) => api.put(`/admin-auth/admin/users/${userId}`, data);
export const deactivateUser = (userId) => api.delete(`/admin-auth/admin/users/${userId}`);
export const getAllUsers = (params) => api.get('/admin-auth/admin/users', { params });
export const getAnalytics = (params) => api.get('/admin-auth/admin/analytics', { params });
export const generateUserReport = (params) =>
  api.get('/admin-auth/admin/report', { params, responseType: 'blob' });

// CLAIMS-RELATED ADMIN ENDPOINTS

// Get all claims (claimsController.js)
// GET /api/claims/all
export const getAllClaims = async (params) =>
  api.get('/claims/admin/all', { params });
// params: { status, platform, startDate, endDate, page, limit }

// Get claims nearing 72-hour deadline (claimsController.js)
// GET /api/claims/pending-deadline
export const getPendingDeadlineClaims = async () =>
  api.get('/claims/admin/pending-deadline');

// Get a single claim by ID (claimsController.js)
// GET /api/claims/:id
export const getClaimById = async (claimId) =>
  api.get(`/claims/admin/${claimId}`);

// AI evaluate a claim (claimsController.js)
// POST /api/claims/:id/evaluate-ai
export const evaluateClaimAI = async (claimId) =>
  api.post(`/claims/admin/${claimId}/evaluate-ai`);

// Manually review a claim (claimsController.js)
// POST /api/claims/:id/review-manual
export const reviewClaimManual = async (claimId, data) =>
  api.post(`/claims/admin/${claimId}/review-manual`, data);
// data: { isValid, notes, payoutAmount }

// Mark claim as paid (claimsController.js)
// POST /api/claims/:id/paid
export const markClaimPaid = async (claimId) =>
  api.post(`/claims/admin/${claimId}/paid`);

// Get claim analytics with AI insights (claimsController.js)
// GET /api/claims/analytics
export const getClaimAnalytics = async (params) =>
  api.get('/claims/admin/analytics', { params });
// params: { startDate, endDate }

// Generate claim report with AI insights (claimsController.js)
// GET /api/claims/report
export const generateClaimReport = async (params) =>
  api.get('/claims/admin/report', { params, responseType: 'blob' });
// params: { startDate, endDate, platform }

// Bulk review claims (adminClaimsController.js)
// POST /api/admin-claims/admin/bulk-review
export const bulkReviewClaims = async (data) =>
  api.post('/admin-claims/admin/bulk-review', data);
// data: { reviews: [{ claimId, isValid, notes, payoutAmount }, ...] }

// Audit claims with AI (adminClaimsController.js)
// POST /api/admin-claims/admin/audit
export const auditClaimsWithAI = async (data) =>
  api.post('/admin-claims/admin/audit', data);
// data: { claimIds: [claimId1, claimId2, ...] }

// Get claim history (adminClaimsController.js)
// GET /api/admin-claims/admin/:id/history
export const getClaimHistory = async (claimId) =>
  api.get(`/admin-claims/admin/${claimId}/history`);

// Flag high-risk creators (adminClaimsController.js)
// GET /api/admin-claims/admin/high-risk-creators
export const flagHighRiskCreators = async (params) =>
  api.get('/admin-claims/admin/high-risk-creators', { params });
// params: { startDate, endDate, minClaims }

export default api;