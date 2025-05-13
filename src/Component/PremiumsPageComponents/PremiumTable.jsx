// src/components/PremiumComponents/PremiumTable.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronDown, FiChevronUp, FiCheckCircle, FiEdit, FiClock, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdjustPremiumModal from './AdjustPremiumModal';
import PremiumHistoryModal from './PremiumHistoryModal';
import AuditPremiumModal from './AuditPremiumModal';
import { retryPayment,  getAllPremiums } from '../../Resources/Apiservice';

const PremiumTable = ({ premiums: initialPremiums, loading: initialLoading }) => {
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [premiums, setPremiums] = useState(initialPremiums || []);
  const [loading, setLoading] = useState(initialLoading || true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPremiums, setSelectedPremiums] = useState([]);
  const [openAdjust, setOpenAdjust] = useState(false);
  const [openHistory, setOpenHistory] = useState(false);
  const [openAudit, setOpenAudit] = useState(false);
  const [selectedPremium, setSelectedPremium] = useState(null);

  const fetchPremiums = async () => {
    setLoading(true);
    try {
      const response = await getAllPremiums({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status,
      });
      setPremiums(response.data.data);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch premiums', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialPremiums) {
      fetchPremiums();
    } else {
      setPremiums(initialPremiums);
      setPagination({
        ...pagination,
        total: initialPremiums.length,
        pages: Math.ceil(initialPremiums.length / pagination.limit),
      });
      setLoading(initialLoading);
    }
  }, [pagination.page, pagination.limit, filters, initialPremiums, initialLoading]);

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

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setPagination({ ...pagination, limit: newLimit, page: 1 });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPremiums(premiums.map((premium) => premium._id));
    } else {
      setSelectedPremiums([]);
    }
  };

  const handleSelectPremium = (premiumId) => {
    setSelectedPremiums((prev) =>
      prev.includes(premiumId) ? prev.filter((id) => id !== premiumId) : [...prev, premiumId]
    );
  };

  const handleRetryPayment = async (premium) => {
    try {
      await retryPayment({ userId: premium?.premiumDetails.userId });
      toast.success('Payment retry initiated', {
        style: { background: '#D4F4D4', color: '#1A4F1A' },
      });
      fetchPremiums();
    } catch (err) {
      toast.error('Failed to retry payment', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  const handleBulkAudit = () => {
    if (selectedPremiums.length === 0) {
      toast.error('Please select at least one premium', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      return;
    }
    setOpenAudit(true);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Paid: 'bg-appleGreen text-white',
      Overdue: 'bg-red-500 text-white',
      Pending: 'bg-yellowGreen text-white',
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-brown mb-4 md:mb-0">Premiums</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10 p-2 border border-appleGreen rounded-lg text-brown w-full md:w-64"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-5 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold hover:bg-brown"
            >
              Filters {showFilters ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
            </button>
            {selectedPremiums.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                onClick={handleBulkAudit}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-yellowGreen to-appleGreen text-brown rounded-lg font-semibold hover:bg-yellowGreen"
              >
                <FiCheckCircle className="mr-2" />
                Audit {selectedPremiums.length} Premium(s)
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
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
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block h-12 w-12 border-4 border-appleGreen border-t-transparent rounded-full"
          />
          <p className="text-brown mt-4 text-lg font-medium">Loading premiums...</p>
        </div>
      ) : premiums.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brown text-lg font-medium">No premiums found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-appleGreen/50 scrollbar-track-gray-100">
            <table className="w-full min-w-[800px] text-left table-auto">
              <thead>
                <tr className="text-xs md:text-sm text-gray-500 bg-gray-50 sticky top-0 z-10">
                  <th className="p-4 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedPremiums.length === premiums.length && premiums.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-appleGreen focus:ring-appleGreen border-gray-300 rounded"
                    />
                  </th>
                  <th className="p-4 font-medium text-center">Email</th>
                  <th className="p-4 font-medium text-center min-w-44">Name</th>
                  <th className="p-4 font-medium text-center">Percentage</th>
                  <th className="p-4 font-medium text-center">Amount (KES)</th>
                  <th className="p-4 font-medium text-center">Status</th>
                  <th className="p-4 font-medium text-center min-w-44">Due Date</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {premiums.map((premium, index) => (
                  <motion.tr
                    key={premium._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className="border-t border-gray-100 hover:bg-appleGreen/10 transition-all duration-200"
                  >
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedPremiums.includes(premium._id)}
                        onChange={() => handleSelectPremium(premium._id)}
                        className="h-4 w-4 text-appleGreen focus:ring-appleGreen border-gray-300 rounded"
                      />
                    </td>
                    <td className="p-4 text-center text-xs md:text-sm text-brown">
                      {premium?.premiumDetails?.userId?.personalInfo?.email || 'N/A'}
                    </td>
                    <td className="p-4 text-center min-w-44 text-xs md:text-sm text-brown">
                      {`${premium?.premiumDetails?.userId?.personalInfo?.firstName || ''} ${
                        premium?.premiumDetails?.userId?.personalInfo?.lastName || ''
                      }`}
                    </td>
                    <td className="p-4 text-center text-xs md:text-sm text-brown">
                      {premium?.premiumDetails.finalPercentage || 'N/A'}%
                    </td>
                    <td className="p-4 text-center text-xs md:text-sm text-brown">
                      KES {premium?.premiumDetails.finalAmount?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="p-4 text-center text-xs md:text-sm text-brown">
                      {getStatusBadge(premium?.paymentStatus.status)}
                    </td>
                    <td className="p-4 text-center min-w-44 text-xs md:text-sm text-brown">
                      {premium?.paymentStatus.dueDate
                        ? new Date(premium.paymentStatus.dueDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="p-4 text-center text-xs md:text-sm text-brown">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPremium(premium);
                            setOpenAdjust(true);
                          }}
                          className="p-2 bg-appleGreen text-white rounded-full hover:bg-yellowGreen hover:scale-105 transition-all duration-200"
                          title="Adjust Premium"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPremium(premium);
                            setOpenHistory(true);
                          }}
                          className="p-2 bg-appleGreen text-white rounded-full hover:bg-yellowGreen hover:scale-105 transition-all duration-200"
                          title="View History"
                        >
                          <FiClock />
                        </button>
                        <button
                          onClick={() => handleRetryPayment(premium)}
                          disabled={premium?.paymentStatus.status === 'Paid'}
                          className={`p-2 rounded-full text-white ${
                            premium?.paymentStatus.status === 'Paid'
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-appleGreen hover:bg-yellowGreen hover:scale-105'
                          } transition-all duration-200`}
                          title="Retry Payment"
                        >
                          <FiDollarSign />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">
            Scroll left or right to view more
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} premiums
            </p>
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <select
                value={pagination.limit}
                onChange={handleLimitChange}
                className="p-2 border border-appleGreen rounded-lg text-brown focus:outline-none focus:ring-2 focus:ring-yellowGreen"
              >
                {[5, 10, 25].map((option) => (
                  <option key={option} value={option}>
                    {option} per page
                  </option>
                ))}
              </select>
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
          </div>
        </>
      )}

      {/* Modals */}
      {selectedPremium && (
        <>
          <AdjustPremiumModal
            open={openAdjust}
            handleClose={() => setOpenAdjust(false)}
            premium={selectedPremium}
            onSuccess={() => {
              fetchPremiums();
              setOpenAdjust(false);
            }}
          />
          <PremiumHistoryModal
            open={openHistory}
            handleClose={() => setOpenHistory(false)}
            premiumId={selectedPremium?._id}
          />
        </>
      )}
      <AuditPremiumModal
        open={openAudit}
        handleClose={() => setOpenAudit(false)}
        premiums={premiums}
        onSuccess={() => {
          fetchPremiums();
          setSelectedPremiums([]);
          setOpenAudit(false);
        }}
      />
    </motion.div>
  );
};

export default PremiumTable;