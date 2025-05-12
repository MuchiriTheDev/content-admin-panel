// src/components/PremiumComponents/PremiumFilters.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';

const PremiumFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({ status: '', startDate: '', endDate: '', userId: '' });
  };

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Paid', label: 'Paid' },
    { value: 'Overdue', label: 'Overdue' },
    { value: 'Failed', label: 'Failed' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="bg-white rounded-xl shadow-md border border-appleGreen p-6 mb-6"
    >
      <h3 className="text-lg font-semibold text-brown mb-4">Filter Premiums</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Payment Status */}
        <div>
          <label className="block text-sm font-medium text-brown mb-1">Payment Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full p-2 border border-appleGreen rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellowGreen"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-brown mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="w-full p-2 border border-appleGreen rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellowGreen"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-brown mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="w-full p-2 border border-appleGreen rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellowGreen"
          />
        </div>

        {/* User ID */}
        <div>
          <label className="block text-sm font-medium text-brown mb-1">User ID</label>
          <input
            type="text"
            name="userId"
            value={filters.userId}
            onChange={handleChange}
            className="w-full p-2 border border-appleGreen rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellowGreen"
            placeholder="Enter User ID"
          />
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="inline-flex items-center px-4 py-2 bg-appleGreen text-white rounded-lg font-semibold hover:bg-yellowGreen hover:scale-105 transition-all duration-200"
        >
          <FiRefreshCw className="mr-2" />
          Reset Filters
        </button>
      </div>
    </motion.div>
  );
};

export default PremiumFilters;