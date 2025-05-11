// src/Component/HomePageComponents/DeactivateConfirmModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { deactivateUser } from '../../Resources/Apiservice';

const DeactivateConfirmModal = ({ isOpen, onClose, userId, userName }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeactivate = async () => {
    setLoading(true);
    try {
      await deactivateUser(userId);
      toast.success('User deactivated successfully', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to deactivate user', {
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
            className="bg-white rounded-lg p-6 max-w-lg w-full shadow-2xl  border-appleGreen"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-brown">Deactivate User</h4>
              <button onClick={onClose} className="text-brown hover:text-fadeBrown">
                <FiX size={24} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to deactivate <strong>{userName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-gray-200 text-brown rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                disabled={loading}
                className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-400 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Deactivating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FiTrash2 className="mr-2" />
                    Deactivate
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeactivateConfirmModal;