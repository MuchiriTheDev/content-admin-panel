// src/components/common/UserTable.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import { getAllUsers } from '../../Resources/Apiservice';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status,
        search: filters.search,
      });
      setUsers(response.data.data);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch users', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, filters]);

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value });
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      NotApplied: 'bg-gray-200 text-gray-900',
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
        <h2 className="text-xl font-semibold text-brown mb-4 md:mb-0">Users</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown" />
            <input
              type="text"
              placeholder="Search users..."
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
                <option value="NotApplied">Not Applied</option>
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
          ></motion.div>
          <p className="text-brown mt-4 text-lg font-medium">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-brown text-lg font-medium">No users found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-appleGreen/50 scrollbar-track-gray-100">
            <table className="w-full min-w-[800px] text-left table-auto">
              <thead>
                <tr className="text-xs md:text-sm text-gray-500 bg-gray-50 sticky top-0 z-10">
                  <th className="p-4 font-medium">User ID</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Premium (KES)</th>
                  <th className="p-4 font-medium">Claims</th>
                  <th className="p-4 font-medium">Content Reviews</th>
                  <th className="p-4 font-medium">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                    className="border-t border-gray-100 hover:bg-appleGreen/10 transition-all duration-200"
                  >
                    <td className="p-4 text-xs md:text-sm text-brown">
                      <Link to={`/user/${user._id}`} className="hover:underline">
                        {user._id.slice(-6)}
                      </Link>
                    </td>
                    <td className="p-4 text-xs md:text-sm text-brown">
                      {user.personalInfo.firstName} {user.personalInfo.lastName}
                    </td>
                    <td className="p-4 text-xs md:text-sm text-brown">{user.personalInfo.email}</td>
                    <td className="p-4 text-xs md:text-sm text-brown">
                      {getStatusBadge(user.insuranceStatus.status)}
                    </td>
                    <td className="p-4 text-xs md:text-sm text-brown">
                      {user.premium?.finalAmount?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="p-4 text-xs md:text-sm text-brown">{user.claimsCount}</td>
                    <td className="p-4 text-xs md:text-sm text-brown">{user.contentReviewsCount}</td>
                    <td className="p-4 text-xs md:text-sm text-brown">{user.recentRiskLevel}</td>
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
              users
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
    </motion.div>
  );
};

export default UserTable;