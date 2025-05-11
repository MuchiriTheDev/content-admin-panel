// src/components/ContractsPageComponents/ChangeStatusModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import {  reviewInsuranceApplication } from '../../Resources/Apiservice';

const ChangeStatusModal = ({ isOpen, onClose, contractId, userName, onStatusUpdate }) => {
  const [status, setStatus] = useState('approve');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (status === 'Reject' && !reason.trim()) {
      newErrors.reason = 'Rejection reason is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please provide a rejection reason', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      return;
    }
    setLoading(true);
    try {
      const response = await reviewInsuranceApplication({
        userId: contractId,
        action: status,
        rejectionReason: status === 'Reject' ? reason : undefined,
      });
      onStatusUpdate(response.data.data);
      window.location.reload();
      toast.success('Contract status updated successfully', {
        style: { background: '#D1FAE5', color: '#065F46' },
        });
      onClose();

    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update contract status', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white rounded-xl max-w-md w-full shadow-2xl border-2 border-appleGreen bg-gradient-to-br from-white to-gray-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-appleGreen to-yellowGreen text-white rounded-t-xl">
              <h4 className="text-xl font-bold">Change Contract Status</h4>
              <button
                onClick={onClose}
                className="text-white hover:text-brown transition-colors duration-200"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Update the status for <strong>{userName}</strong>’s contract.
                </p>
                <label className="block text-sm font-medium mb-1 text-brown">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setErrors({}); // Clear errors on status change
                  }}
                  className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                  required
                >
                  <option value="approve">Approve</option>
                  <option value="reject">Reject</option>
                </select>
              </div>
              {status === 'Reject' && (
                <div>
                  <label className="block text-sm font-medium mb-1 text-brown">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setErrors({ ...errors, reason: '' });
                    }}
                    placeholder="Provide a reason for rejection"
                    className={`w-full p-3 border-2 border-appleGreen rounded-lg text-brown bg-white focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200 ${
                      errors.reason ? 'border-red-500' : ''
                    }`}
                    rows="4"
                    required={status === 'Reject'}
                  />
                  {errors.reason && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle /> {errors.reason}
                    </p>
                  )}
                </div>
              )}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <motion.button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gray-200 text-brown rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 shadow-md"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-yellowGreen to-appleGreen text-brown rounded-lg font-semibold disabled:opacity-50 transition-colors duration-300 shadow-md hover:shadow-yellowGreen/50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-brown"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiSave className="mr-2" />
                      Save Changes
                    </span>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChangeStatusModal;