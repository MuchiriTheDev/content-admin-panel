// src/components/pages/ContractDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaShieldAlt,
  FaDollarSign,
  FaBriefcase,
  FaCreditCard,
  FaFileAlt,
  FaEdit,
  FaTrashAlt,
  FaExclamationCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import moment from 'moment';
import PageAbsorber from '../../Resources/PageAbsorber';
import {
  getContractById,
  analyzeContract,
  updateContract,
  terminateContract,
  getContractHistory, // New API function
} from '../../Resources/Apiservice';
import InsightCard from '../../Component/HomePageComponents/InsightCard';
import UpdateContractForm from '../../Component/ContractsPageComponents/UpdateContractForm';
import TerminateConfirmModal from '../../Component/ContractsPageComponents/TerminateConfirmModal';
import ChangeStatusModal from '../../Component/ContractsPageComponents/ChangeStatusModal'; // New modal component

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [history, setHistory] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contractResponse, historyResponse, analyzeResponse] = await Promise.all([
          getContractById(id),
          getContractHistory(id),
          analyzeContract(id),
        ]);
        setContract(contractResponse.data.data);
        setHistory(historyResponse.data.data);
        setInsights(analyzeResponse.data.data.aiInsights.insights);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch contract data');
        toast.error('Failed to fetch contract data', {
          style: { background: '#FECACA', color: '#7F1D1D' },
        });
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = (updatedContract) => {
    setContract(updatedContract);
    setIsUpdateModalOpen(false);
    toast.success('Contract updated successfully', {
      style: { background: '#A3E635', color: '#4A2C2A' },
    });
  };

  const handleTerminate = () => {
    setIsTerminateModalOpen(true);
  };

  const handleChangeStatus = () => {
    setIsChangeStatusModalOpen(true);
  };

  const handleStatusUpdate = (updatedContract) => {
    setContract(updatedContract);
    setIsChangeStatusModalOpen(false);
    toast.success('Contract status updated successfully', {
      style: { background: '#A3E635', color: '#4A2C2A' },
    });
  };

  const getStatusBadge = (status) => (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${
        status === 'Pending'
          ? 'from-yellow-200 to-yellow-300 text-yellow-900'
          : status === 'Approved'
          ? 'from-appleGreen to-green-400 text-brown'
          : status === 'Rejected'
          ? 'from-red-200 to-red-300 text-red-900'
          : 'from-red-300 to-red-400 text-red-900'
      }`}
    >
      {status || 'N/A'}
    </motion.span>
  );

  // Pagination for Contract History
  const historyEvents = [
    ...(history?.statusChanges || []).map((event) => ({
      type: 'Status Change',
      status: event.status,
      date: event.date,
      details: event.reason || '-',
    })),
    ...(history?.renewals || []).map((renewal) => ({
      type: 'Renewed',
      status: 'Renewed',
      date: renewal.date,
      details: `${renewal.coveragePeriod} months`,
    })),
  ];
  const totalPages = Math.ceil(historyEvents.length / rowsPerPage);
  const paginatedHistory = historyEvents.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <PageAbsorber>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="p-4 md:p-8 lg:p-10 bg-gradient-to-br from-gray-50 to-white min-h-screen"
      >
        {/* Hero Banner */}
        {contract && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-appleGreen to-yellowGreen text-white rounded-lg p-6 mb-8 shadow-lg"
          >
            <h1 className="text-2xl md:text-3xl font-bold">
              {contract.personalInfo.firstName} {contract.personalInfo.lastName}
            </h1>
            <p className="text-sm md:text-base mt-2 opacity-90">
              Contract Status: {contract.insuranceStatus.status}
            </p>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Header and Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brown">Contract Profile</h2>
              <p className="text-gray-600 mt-2 text-sm md:text-base">
                Manage contract details, history, and AI-driven insights.
              </p>
            </div>
            {contract && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex space-x-4 mt-4 md:mt-0"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold hover:bg-brown transition-all duration-200"
                >
                  <FaEdit className="mr-2" />
                  Update
                </motion.button>
                {['Pending', 'Rejected'].includes(contract.insuranceStatus.status) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleChangeStatus}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellowGreen to-appleGreen text-brown rounded-lg font-semibold hover:bg-yellowGreen transition-all duration-200"
                  >
                    <FaCheckCircle className="mr-2" />
                    Change Status
                  </motion.button>
                )}
                {contract.insuranceStatus.status === 'Approved' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTerminate}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-400 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200"
                  >
                    <FaTrashAlt className="mr-2" />
                    Terminate
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block h-12 w-12 border-4 border-appleGreen border-t-transparent rounded-full"
              />
              <p className="text-brown mt-4 text-lg font-medium">Loading contract details...</p>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-red-100 text-red-900 p-5 rounded-lg mb-6 flex items-center justify-center"
            >
              <FaExclamationCircle className="mr-3 text-xl" />
              {error}
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Contract Info */}
              <motion.div
                id="contract"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaShieldAlt className="text-xl text-yellowGreen" />
                  <h2 className="text-lg md:text-xl font-semibold text-brown">Contract Information</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">Details about the contract and user information.</p>
                <div className="space-y-2">
                  {[
                    {
                      label: 'Full Name',
                      value: `${contract.personalInfo.firstName} ${contract.personalInfo.lastName}`,
                    },
                    { label: 'Email', value: contract.personalInfo.email },
                    { label: 'Status', value: getStatusBadge(contract.insuranceStatus.status) },
                    {
                      label: 'Applied At',
                      value: contract.insuranceStatus.appliedAt
                        ? moment(contract.insuranceStatus.appliedAt).format('MMM D, YYYY')
                        : 'N/A',
                    },
                    {
                      label: 'Approved At',
                      value: contract.insuranceStatus.approvedAt
                        ? moment(contract.insuranceStatus.approvedAt).format('MMM D, YYYY')
                        : 'N/A',
                    },
                    {
                      label: 'Policy Start Date',
                      value: contract.insuranceStatus.policyStartDate
                        ? moment(contract.insuranceStatus.policyStartDate).format('MMM D, YYYY')
                        : 'N/A',
                    },
                    {
                      label: 'Policy End Date',
                      value: contract.insuranceStatus.policyEndDate
                        ? moment(contract.insuranceStatus.policyEndDate).format('MMM D, YYYY')
                        : 'N/A',
                    },
                    {
                      label: 'Coverage Period',
                      value: `${contract.insuranceStatus.coveragePeriod} months`,
                    },
                    {
                      label: 'Rejection Reason',
                      value: contract.insuranceStatus.rejectionReason || 'N/A',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-3 rounded-md ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-600">{item.label}</p>
                      <p className="text-base text-brown">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Financial Info */}
              <motion.div
                id="financial"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaDollarSign className="text-xl text-yellowGreen" />
                  <h2 className="text-lg md:text-xl font-semibold text-brown">Financial Information</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">Financial details related to the contract.</p>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                    <p className="text-base text-brown font-semibold">
                      {contract.financialInfo.monthlyEarnings
                        ? `${contract.financialInfo.currency || 'KES'} ${contract.financialInfo.monthlyEarnings.toFixed(2)}`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Premium Details */}
              {contract.premium && (
                <motion.div
                  id="premium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FaCreditCard className="text-xl text-yellowGreen" />
                    <h2 className="text-lg md:text-xl font-semibold text-brown">Premium Details</h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Information about the contract’s insurance premium.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Final Amount (KES)</p>
                      <p className="text-base text-brown">
                        {contract.premium.finalAmount ? contract.premium.finalAmount.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Final Percentage</p>
                      <p className="text-base text-brown">
                        {contract.premium.finalPercentage
                          ? `${contract.premium.finalPercentage.toFixed(2)}%`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Payment Status</p>
                      <p className="text-base text-brown">
                        {contract.premium.paymentStatus?.status || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Due Date</p>
                      <p className="text-base text-brown">
                        {contract.premium.paymentStatus?.dueDate
                          ? moment(contract.premium.paymentStatus.dueDate).format('MMM D, YYYY')
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Risk Explanation</p>
                      <p className="text-base text-brown">
                        {contract.premium.adjustmentFactors?.riskExplanation || 'N/A'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Platforms */}
              {contract.platformInfo?.platforms?.length > 0 ? (
                <motion.div
                  id="platforms"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FaBriefcase className="text-xl text-yellowGreen" />
                    <h2 className="text-lg md:text-xl font-semibold text-brown">Social Platforms</h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Social media platforms associated with the contract.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-appleGreen text-white">
                          <th className="p-3 text-sm font-semibold rounded-tl-lg">Platform</th>
                          <th className="p-3 text-sm font-semibold">Username</th>
                          <th className="p-3 text-sm font-semibold">Account Link</th>
                          <th className="p-3 text-sm font-semibold">Audience Size</th>
                          <th className="p-3 text-sm font-semibold rounded-tr-lg">Content Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contract.platformInfo.platforms.map((platform, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className={`border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="p-3 text-brown">{platform.name || 'N/A'}</td>
                            <td className="p-3 text-brown">{platform.username || 'N/A'}</td>
                            <td className="p-3 text-brown">
                              {platform.accountLink ? (
                                <a
                                  href={platform.accountLink}
                                  className="text-yellowGreen hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {platform.accountLink}
                                </a>
                              ) : (
                                'N/A'
                              )}
                            </td>
                            <td className="p-3 text-brown">{platform.audienceSize || 'N/A'}</td>
                            <td className="p-3 text-brown">{platform.contentType || 'N/A'}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  id="platforms"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="bg-white border-2 border-appleGreen rounded-lg p-6 text-center text-gray-600 shadow-md"
                >
                  <FaBriefcase className="mx-auto text-2xl text-gray-400 mb-2" />
                  No social platforms found
                </motion.div>
              )}

              {/* Claims */}
              {contract.claims?.length > 0 ? (
                <motion.div
                  id="claims"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FaFileAlt className="text-xl text-yellowGreen" />
                    <h2 className="text-lg md:text-xl font-semibold text-brown">Claims</h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">History of insurance claims associated with the contract.</p>
                  <div className="space-y-4">
                    {contract.claims.map((claim, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Incident Type</p>
                            <p className="text-base text-brown">{claim.incidentType || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Status</p>
                            <p className="text-base text-brown">{claim.status || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Payout Amount</p>
                            <p className="text-base text-brown">
                              {claim.payoutAmount ? `KES ${claim.payoutAmount.toFixed(2)}` : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  id="claims"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="bg-white border-2 border-appleGreen rounded-lg p-6 text-center text-gray-600 shadow-md"
                >
                  <FaFileAlt className="mx-auto text-2xl text-gray-400 mb-2" />
                  No claims found
                </motion.div>
              )}

              {/* Contract History */}
              <motion.div
                id="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaFileAlt className="text-xl text-yellowGreen" />
                  <h2 className="text-lg md:text-xl font-semibold text-brown">Contract History</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">Record of contract status changes and renewals.</p>
                {historyEvents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left table-fixed">
                      <thead>
                        <tr className="bg-appleGreen text-white">
                          <th className="p-3 text-sm font-semibold rounded-tl-lg w-1/4">Event</th>
                          <th className="p-3 text-sm font-semibold w-1/4">Status</th>
                          <th className="p-3 text-sm font-semibold w-1/4">Date</th>
                          <th className="p-3 text-sm font-semibold rounded-tr-lg w-1/4">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedHistory.map((event, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className={`border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="p-3 text-brown truncate">{event.type}</td>
                            <td className="p-3 text-brown truncate">{event.status}</td>
                            <td className="p-3 text-brown truncate">
                              {event.date ? moment(event.date).format('MMM D, YYYY') : 'N/A'}
                            </td>
                            <td className="p-3 text-brown truncate">{event.details}</td>
                          </motion.tr>
                        ))}
                        {paginatedHistory.length < rowsPerPage &&
                          Array.from({ length: rowsPerPage - paginatedHistory.length }).map((_, index) => (
                            <tr
                              key={`empty-${index}`}
                              className={`border-b border-gray-200 ${
                                (paginatedHistory.length + index) % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                              }`}
                            >
                              <td className="p-3"> </td>
                              <td className="p-3"> </td>
                              <td className="p-3"> </td>
                              <td className="p-3"> </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-gray-600">
                        Showing {Math.min((currentPage - 1) * rowsPerPage + 1, historyEvents.length)}–
                        {Math.min(currentPage * rowsPerPage, historyEvents.length)} of {historyEvents.length}
                      </p>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="p-2 bg-gray-200 text-brown rounded-lg disabled:opacity-50"
                        >
                          <FaChevronLeft />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="p-2 bg-gray-200 text-brown rounded-lg disabled:opacity-50"
                        >
                          <FaChevronRight />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    <FaFileAlt className="mx-auto text-2xl text-gray-400 mb-2" />
                    No contract history found
                  </div>
                )}
              </motion.div>

              {/* AI Insights */}
              <motion.div
                id="insights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaFileAlt className="text-xl text-yellowGreen" />
                  <h2 className="text-lg md:text-xl font-semibold text-brown">AI Insights</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">AI-driven recommendations and risk analysis.</p>
                {insights.length > 0 ? (
                  <div className="space-y-4">
                    {insights.map((insight, index) => (
                      <InsightCard key={index} insight={insight} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    <FaFileAlt className="mx-auto text-2xl text-gray-400 mb-2" />
                    No AI insights available
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>

        {/* Modals */}
        {contract && (
          <>
            <UpdateContractForm
              isOpen={isUpdateModalOpen}
              onClose={() => setIsUpdateModalOpen(false)}
              contract={contract}
              contractId={id}
              onUpdate={handleUpdate}
            />
            <TerminateConfirmModal
              isOpen={isTerminateModalOpen}
              onClose={() => setIsTerminateModalOpen(false)}
              contractId={id}
              userName={`${contract.personalInfo.firstName} ${contract.personalInfo.lastName}`}
            />
            <ChangeStatusModal
              isOpen={isChangeStatusModalOpen}
              onClose={() => setIsChangeStatusModalOpen(false)}
              contractId={id}
              userName={`${contract.personalInfo.firstName} ${contract.personalInfo.lastName}`}
              onStatusUpdate={handleStatusUpdate}
            />
          </>
        )}
      </motion.div>
    </PageAbsorber>
  );
};

export default ContractDetails;