// src/components/claims/ReviewClaimForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { reviewClaimManual } from '../../services/api';

const ReviewClaimForm = ({ isOpen, onClose, claimId, onSubmit }) => {
  const [formData, setFormData] = useState({
    isValid: true,
    notes: '',
    payoutAmount: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reviewClaimManual(claimId, formData);
      toast.success('Claim reviewed successfully', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
      onSubmit();
      onClose();
    } catch (err) {
      toast.error('Failed to review claim', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    } finally {
      setLoading(false);
    }
  };

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
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-appleGreen"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold text-brown">Review Claim</h4>
              <button onClick={onClose} className="text-brown hover:text-fadeBrown">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Valid Claim</label>
                <input
                  type="checkbox"
                  name="isValid"
                  checked={formData.isValid}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Payout Amount (KES)</label>
                <input
                  type="number"
                  name="payoutAmount"
                  value={formData.payoutAmount}
                  onChange={handleChange}
                  className="w-full p-2 border border-appleGreen rounded-lg text-brown"
                  disabled={!formData.isValid}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full p-2 border border-appleGreen rounded-lg text-brown"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-gray-200 text-brown rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold hover:bg-brown disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Reviewing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiCheckCircle className="mr-2" />
                      Submit Review
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