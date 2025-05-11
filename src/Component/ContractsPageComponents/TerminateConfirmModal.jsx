// src/components/ContractsComponents/TerminateConfirmModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { terminateContract } from '../../Resources/Apiservice';
import { useNavigate } from 'react-router-dom';

const TerminateConfirmModal = ({ isOpen, onClose, contractId, userName }) => {
  const navigate = useNavigate();
  const [reason, setReason] = useState('');

  const handleTerminate = async () => {
    if (!reason) {
      toast.error('Termination reason is required');
      return;
    }
    try {
      await terminateContract(contractId, { reason });
      toast.success('Contract terminated successfully');
      navigate('/contracts');
    } catch (err) {
      toast.error('Failed to terminate contract');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-brown">Terminate Contract</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-brown">
            <FaTimes />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Are you sure you want to terminate the contract for <strong>{userName}</strong>? This action cannot be undone.
        </p>
        <div className="mb-4">
          <label className="block text-sm text-gray-600">Reason for Termination</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for termination"
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleTerminate}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-400 text-white rounded-lg"
          >
            Terminate
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TerminateConfirmModal;