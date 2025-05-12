// src/components/PremiumComponents/AdjustPremiumModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { adjustPremium } from '../../Resources/Apiservice';

const AdjustPremiumModal = ({ open, handleClose, premium, onSuccess }) => {
  const [adjustmentPercentage, setAdjustmentPercentage] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!adjustmentPercentage || !reason) {
      setError('Adjustment percentage and reason are required');
      return;
    }

    try {
      await adjustPremium(premium._id, {
        adjustmentPercentage: parseFloat(adjustmentPercentage),
        reason,
      });
      toast.success('Premium adjusted successfully', {
        style: { background: '#D4F4D4', color: '#1A4F1A' },
      });
      onSuccess();
      handleClose();
    } catch (err) {
      setError('Failed to adjust premium');
      toast.error('Failed to adjust premium', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white rounded-xl shadow-lg border border-appleGreen w-full max-w-md p-6 mx-4"
          >
            {/* Header */}
            <h2 className="text-2xl font-bold text-brown mb-4">Adjust Premium</h2>

            {/* User Info */}
            <div className="space-y-2 mb-4">
              <p className="text-gray-600">
                <span className="font-semibold text-brown">User:</span>{' '}
                {premium.premiumDetails?.userId?.personalInfo?.email || 'N/A'}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-brown">Current:</span>{' '}
                {premium.premiumDetails.finalPercentage}% (KES{' '}
                {premium.premiumDetails.finalAmount.toFixed(2)})
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center bg-red-100 text-red-900 p-3 rounded-lg mb-4"
              >
                <FiAlertCircle className="mr-2 text-lg" />
                {error}
              </motion.div>
            )}

            {/* Form Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-brown mb-1">
                  Adjustment Percentage
                </label>
                <input
                  type="number"
                  value={adjustmentPercentage}
                  onChange={(e) => setAdjustmentPercentage(e.target.value)}
                  className="w-full p-2 border border-appleGreen rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellowGreen"
                  placeholder="e.g., 2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border border-appleGreen rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellowGreen"
                  rows="4"
                  placeholder="Explain the reason for adjustment"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-fadeBrown text-white rounded-lg font-semibold hover:bg-brown hover:scale-105 transition-all duration-200"
              >
                <FiXCircle className="inline mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-appleGreen text-white rounded-lg font-semibold hover:bg-yellowGreen hover:scale-105 transition-all duration-200"
              >
                <FiCheckCircle className="inline mr-2" />
                Apply Adjustment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdjustPremiumModal;