// src/components/ContractsComponents/ContractReportForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { generateContractReport } from '../../Resources/Apiservice';

const ContractReportForm = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    platform: '',
    status: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const validationErrors = validateForm();
    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   toast.error('Please fix the form errors', {
    //     style: { background: '#FECACA', color: '#7F1D1D' },
    //   });
    //   return;
    // }

    setLoading(true);
    try {
      const response = await generateContractReport(filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CCI_Contract_Report.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report downloaded successfully', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate report', {
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
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white rounded-2xl p-8 max-w-xl w-full shadow-2xl border-2 border-appleGreen bg-gradient-to-br from-white to-gray-50"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-bold text-brown">Generate Contract Report</h4>
              <button
                onClick={onClose}
                className="text-brown hover:text-fadeBrown transition-colors duration-200"
                aria-label="Close modal"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brown mb-1">
                  Start Date 
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleChange}
                  className={`w-full p-3 border-2 border-appleGreen rounded-lg text-brown bg-white focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200 ${
                    errors.startDate ? 'border-red-500' : ''
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle /> {errors.startDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1">
                  End Date 
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleChange}
                  className={`w-full p-3 border-2 border-appleGreen rounded-lg text-brown bg-white focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200 ${
                    errors.endDate ? 'border-red-500' : ''
                  }`}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle /> {errors.endDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1">Platform</label>
                <select
                  name="platform"
                  value={filters.platform}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-appleGreen rounded-lg text-brown bg-white focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                >
                  <option value="">All Platforms</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Twitter">Twitter</option>
                  <option value="Twitch">Twitch</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brown mb-1">Insurance Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-appleGreen rounded-lg text-brown bg-white focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Surrendered">Surrendered</option>
                </select>
              </div>
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
                  className="px-6 py-3 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold disabled:opacity-50 transition-colors duration-300 shadow-md hover:shadow-yellowGreen/50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
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
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiDownload className="mr-2" />
                      Generate Report
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

export default ContractReportForm;