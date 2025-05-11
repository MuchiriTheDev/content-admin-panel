// src/components/ContractsComponents/ContractTable.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronDown, FiChevronUp, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import BulkReviewModal from './BulkReviewModal';
import { getAllInsuranceContracts, bulkReviewApplications } from '../../Resources/Apiservice';

const ContractTable = () => {
  const [contracts, setContracts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [isBulkReviewModalOpen, setIsBulkReviewModalOpen] = useState(false);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await getAllInsuranceContracts({
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status,
        search: filters.search,
      });
      setContracts(response.data.data);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch contracts', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [pagination.page, filters]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedContracts(contracts.map((contract) => contract.userId));
    } else {
      setSelectedContracts([]);
    }
  };

  const handleSelectContract = (userId) => {
    setSelectedContracts((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleBulkReview = () => {
    if (selectedContracts.length === 0) {
      toast.error('Please select at least one contract', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      return;
    }
    setIsBulkReviewModalOpen(true);
  };

  const handleBulkReviewSubmit = async (results) => {
    setIsBulkReviewModalOpen(false);
    const failed = results.filter((r) => !r.success);
    if (failed.length > 0) {
      toast.error(`Failed to process ${failed.length} contract(s)`, {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    } else {
      toast.success('Bulk review completed successfully', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
    }
    setSelectedContracts([]);
    fetchContracts(); // Refresh table
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: 'bg-yellow-200 text-yellow-900',
      Approved: 'bg-appleGreen text-brown',
      Rejected: 'bg-red-200 text-red-900',
      Surrendered: 'bg-red-300 text-red-900',
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
          statusStyles[status] || 'bg-gray-200 text-gray-900'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md p-6 border border-appleGreen"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-brown mb-4 md:mb-0">Insurance Contracts</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10 p-2 border border-appleGreen rounded-lg text-brown w-full md:w-64"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold hover:bg-brown"
          >
            Filters {showFilters ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
          </button>
          {selectedContracts.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={handleBulkReview}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-yellowGreen to-appleGreen text-brown rounded-lg font-semibold hover:bg-yellowGreen"
            >
              <FiCheckCircle className="mr-2" />
              Review {selectedContracts.length} Contract(s)
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <select
                value={filters.status}
                onChange={handleStatusChange}
                className="p-2 border border-appleGreen rounded-lg text-brown w-full md:w-48"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Surrendered">Surrendered</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block h-12 w-12 border-4 border-appleGreen border-t-transparent rounded-full"
          />
          <p className="text-brown mt-4 text-lg font-medium">Loading contracts...</p>
        </div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brown text-lg font-medium">No contracts found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-appleGreen/50 scrollbar-track-gray-100">
            <table className="w-full min-w-[600px] text-left table-auto">
              <thead>
                <tr className="text-xs md:text-sm text-gray-500 bg-gray-50 sticky top-0 z-10">
                  <th className="p-4 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedContracts.length === contracts.length && contracts.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-appleGreen focus:ring-appleGreen border-gray-300 rounded"
                    />
                  </th>
                  <th className="p-4 font-medium">User ID</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Platforms</th>
                  <th className="p-4 font-medium">Claims</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract, index) => (
                  <motion.tr
                    key={contract.userId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className="border-t border-gray-100 hover:bg-appleGreen/10 transition-all duration-200"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedContracts.includes(contract.userId)}
                        onChange={() => handleSelectContract(contract.userId)}
                        className="h-4 w-4 text-appleGreen focus:ring-appleGreen border-gray-300 rounded"
                      />
                    </td>
                    <td className="p-4 text-xs md:text-sm text-brown">
                      <Link to={`/contracts/${contract.userId}`} className="hover:underline">
                        {contract.userId.slice(-6)}
                      </Link>
                    </td>
                    <td className="p-4 text-xs md:text-sm text-brown">{contract.name}</td>
                    <td className="p-4 text-xs md:text-sm text-brown">{contract.email}</td>
                    <td className="p-4 text-xs md:text-sm text-brown">
                      {getStatusBadge(contract.insuranceStatus.status)}
                    </td>
                    <td className="p-4 text-xs md:text-sm text-brown">
                      {contract.platforms.map((p) => p.name).join(', ')}
                    </td>
                    <td className="p-4 text-xs md:text-sm text-brown">{contract.claimsCount}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">
            Scroll left or right to view more
          </div>
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
              contracts
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-gray-200 text-brown rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 bg-gray-200 text-brown rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      <BulkReviewModal
        isOpen={isBulkReviewModalOpen}
        onClose={() => setIsBulkReviewModalOpen(false)}
        selectedContracts={selectedContracts}
        onSubmit={handleBulkReviewSubmit}
      />
    </motion.div>
  );
};

export default ContractTable;