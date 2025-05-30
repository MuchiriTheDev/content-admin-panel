// src/components/claims/ReviewClaimForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { reviewClaimManual } from '../../Resources/Apiservice';

const ReviewClaimForm = ({ isOpen, onClose, claimId, onSubmit, claim }) => {
  const [formData, setFormData] = useState({
    status: 'Approve', // 'Approve' or 'Reject'
    notes: '',
    payoutAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const maxPayout = claim?.claimDetails?.reportedEarningsLoss || 0;
  const aiAnalysis = claim?.evaluation?.aiAnalysis || {};

  const validateForm = () => {
    const newErrors = {};
    if (formData.status === 'Approve') {
      if (!formData.payoutAmount || formData.payoutAmount < 0) {
        newErrors.payoutAmount = 'Payout must be non-negative';
      } else if (formData.payoutAmount > maxPayout) {
        newErrors.payoutAmount = `Payout cannot exceed KES ${maxPayout.toFixed(2)}`;
      }
    }
    if (formData.status === 'Reject' && !formData.notes.trim()) {
      newErrors.notes = 'Notes required for rejection';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'payoutAmount' ? parseFloat(value) || 0 : value,
    });
    setErrors({ ...errors, [name]: '' });
  };

  const handleStatusChange = (status) => {
    setFormData({
      ...formData,
      status,
      payoutAmount: status === 'Reject' ? 0 : formData.payoutAmount,
    });
    setErrors({ ...errors, status: '', payoutAmount: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix form errors', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      return;
    }

    const confirmMessage =
      formData.status === 'Approve'
        ? `Approve claim with payout of KES ${formData.payoutAmount.toFixed(2)}?`
        : 'Reject claim? This action cannot be undone.';
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    try {
      const payload = {
        isValid: formData.status.toLowerCase() === 'approve',
        notes: formData.notes.trim() || undefined,
        payoutAmount: formData.status === 'Approve' ? formData.payoutAmount : 0,
      };
      await reviewClaimManual(claimId, payload);
      toast.success(`Claim ${formData.status.toLowerCase()}d successfully`, {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
      onSubmit();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to review claim';
      toast.error(errorMessage, {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!claim) {
    return null; // Prevent rendering if claim is missing
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 max-w-md w-full shadow-xl border border-appleGreen"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-brown">
                Review Claim (ID: {claimId.slice(-6)})
              </h4>
              <button
                onClick={onClose}
                className="text-brown hover:text-fadeBrown transition-colors"
                disabled={loading}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Claim Summary */}
            <div className="mb-4 p-3 bg-appleGreen/10 rounded-lg">
              <h5 className="text-sm font-semibold text-brown mb-1">Claim Summary</h5>
              <p className="text-xs text-gray-600">
                <strong>Reported Loss:</strong> KES {maxPayout.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600">
                <strong>AI Analysis:</strong> {aiAnalysis.isValid ? 'Valid' : 'Invalid'} (Confidence: {aiAnalysis.confidenceScore || 'N/A'}%)
              </p>
              {aiAnalysis.reasons?.length > 0 && (
                <p className="text-xs text-gray-600 truncate">
                  <strong>AI Notes:</strong> {aiAnalysis.reasons[0]}...
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Status Selection */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Claim Status</label>
                <div className="flex space-x-2">
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Approve"
                      checked={formData.status === 'Approve'}
                      onChange={() => handleStatusChange('Approve')}
                      className="text-appleGreen focus:ring-appleGreen h-4 w-4"
                      disabled={loading}
                    />
                    <span className="text-sm text-brown">Approve</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="Reject"
                      checked={formData.status === 'Reject'}
                      onChange={() => handleStatusChange('Reject')}
                      className="text-red-600 focus:ring-red-600 h-4 w-4"
                      disabled={loading}
                    />
                    <span className="text-sm text-brown">Reject</span>
                  </label>
                </div>
                {errors.status && (
                  <p className="text-xs text-red-600 mt-1 flex items-center">
                    <FiAlertCircle className="mr-1 h-3 w-3" /> {errors.status}
                  </p>
                )}
              </div>

              {/* Payout Amount */}
              <div>
                <label className="block text-xs font-medium text-gray-600">Payout Amount (KES)</label>
                <input
                  type="number"
                  name="payoutAmount"
                  value={formData.payoutAmount}
                  onChange={handleChange}
                  className={`w-full p-1.5 border rounded-lg text-sm text-brown focus:ring-2 focus:ring-appleGreen ${
                    errors.payoutAmount ? 'border-red-600' : 'border-appleGreen'
                  } ${formData.status === 'Reject' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  disabled={formData.status === 'Reject' || loading}
                  min="0"
                  step="0.01"
                />
                {errors.payoutAmount && (
                  <p className="text-xs text-red-600 mt-1 flex items-center">
                    <FiAlertCircle className="mr-1 h-3 w-3" /> {errors.payoutAmount}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-gray-600">
                  Notes {formData.status === 'Reject' && <span className="text-red-600">*</span>}
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className={`w-full p-1.5 border rounded-lg text-sm text-brown focus:ring-2 focus:ring-appleGreen ${
                    errors.notes ? 'border-red-600' : 'border-appleGreen'
                  }`}
                  rows={3}
                  disabled={loading}
                />
                {errors.notes && (
                  <p className="text-xs text-red-600 mt-1 flex items-center">
                    <FiAlertCircle className="mr-1 h-3 w-3" /> {errors.notes}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 bg-gray-200 text-brown rounded-lg text-xs font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg text-xs font-semibold hover:shadow-md hover:scale-105 transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-1 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Reviewing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiCheckCircle className="mr-1 h-4 w-4" />
                      Submit
                    </span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewClaimForm;