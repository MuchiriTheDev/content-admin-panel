// src/components/claims/ClaimReportForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { generateClaimReport } from '../../Resources/Apiservice';

const ClaimReportForm = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    platform: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await generateClaimReport(filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CCI_Claim_Report.docx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report downloaded and emailed successfully', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
      onClose();
    } catch (err) {
      toast.error('Failed to generate report', {
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
              <h4 className="text-xl font-bold text-brown">Generate Claim Report</h4>
              <button onClick={onClose} className="text-brown hover:text-fadeBrown">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-appleGreen rounded-lg text-brown"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-appleGreen rounded-lg text-brown"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Platform</label>
                <select
                  name="platform"
                  value={filters.platform}
                  onChange={handleChange}
                  className="w-full p-2 border border-appleGreen rounded-lg text-brown"
                >
                  <option value="">All Platforms</option>
                  <option value="YouTube">YouTube</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Instagram">Instagram</option>
                </select>
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
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiDownload className="mr-2" />
                      Generate Report
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

export default ClaimReportForm;