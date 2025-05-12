// src/components/PremiumComponents/BulkAdjustForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { bulkAdjustPremiums } from '../../Resources/Apiservice';

const BulkAdjustForm = ({ open, handleClose, premiums, onSuccess }) => {
  const [selectedPremiums, setSelectedPremiums] = useState([]);
  const [adjustmentPercentage, setAdjustmentPercentage] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSelect = (premiumId) => {
    setSelectedPremiums((prev) =>
      prev.includes(premiumId) ? prev.filter((id) => id !== premiumId) : [...prev, premiumId]
    );
  };

  const handleSubmit = async () => {
    if (!adjustmentPercentage || !reason || selectedPremiums.length === 0) {
      setError('All fields and at least one premium are required');
      return;
    }

    try {
      const adjustments = selectedPremiums.map((premiumId) => ({
        premiumId,
        adjustmentPercentage: parseFloat(adjustmentPercentage),
        reason,
      }));
      await bulkAdjustPremiums({ adjustments });
      toast.success('Premiums adjusted successfully', {
        style: { background: '#D4F4D4', color: '#1A4F1A' },
      });
      onSuccess();
      handleClose();
    } catch (err) {
      setError('Failed to adjust premiums');
      toast.error('Failed to adjust premiums', {
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
            className="bg-white rounded-xl shadow-lg border border-appleGreen w-full max-w-2xl p-6 mx-4 max-h-[80vh] overflow-auto"
          >
            <h2 className="text-2xl font-bold text-brown mb-4">Bulk Adjust Premiums</h2>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center bg-red-100 text-red-900 p-3 rounded-lg mb-4"
              >
                <FiAlertCircle className="mr-2 text-lg" />
                {error}
              </motion.div>
            )}
            <div className="overflow-x-auto mb-4">
              <div className="grid grid-cols-4 gap-4 p-4 bg-appleGreen text-white font-semibold text-sm">
                <div>Select</div>
                <div>Email</div>
                <div className="text-center">Current %</div>
                <div className="text-center">Amount (KES)</div>
              </div>
              <div className="divide-y divide-gray-200">
                {premiums?.map((premium) => (
                  <div
                    key={premium._id}
                    className="grid grid-cols-4 gap-4 p-4 hover:bg-fadeBrown transition-colors"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPremiums.includes(premium._id)}
                        onChange={() => handleSelect(premium._id)}
                        className="h-5 w-5 text-appleGreen border-gray-300 rounded focus:ring-yellowGreen"
                      />
                    </div>
                    <div className="text-gray-600 truncate">
                      {premium.premiumDetails?.userId?.personalInfo?.email || 'N/A'}
                    </div>
                    <div className="text-center text-brown">
                      {premium.premiumDetails.finalPercentage}%
                    </div>
                    <div className="text-center text-brown">
                      {premium.premiumDetails.finalAmount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                Apply Adjustments
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BulkAdjustForm;