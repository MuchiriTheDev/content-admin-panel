// src/components/pages/UserInfo.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser,
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
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import PageAbsorber from '../../Resources/PageAbsorber';
import { getUserDetails } from '../../Resources/Apiservice';
import UpdateUserForm from '../../Component/HomePageComponents/UpdateUserForm';
import DeactivateConfirmModal from '../../Component/HomePageComponents/DeactivateConfirmModal';

const UserInfo = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await getUserDetails(userId);
      setUserData(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch user details');
      toast.error('Failed to fetch user details', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleUpdate = (updatedUser) => {
    setUserData({ ...userData, user: updatedUser });
  };

  const getStatusBadge = (status) => (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${
        status === 'NotApplied'
          ? 'from-gray-200 to-gray-300 text-gray-900'
          : status === 'Pending'
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

  // Pagination for Content Reviews
  const contentReviews = userData?.contentReviews || [];
  const totalPages = Math.ceil(contentReviews.length / rowsPerPage);
  const paginatedReviews = contentReviews.slice(
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
        {userData && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-appleGreen to-yellowGreen text-white rounded-lg p-6 mb-8 shadow-lg"
          >
            <h1 className="text-2xl md:text-3xl font-bold">
              {userData.user.personalInfo.firstName} {userData.user.personalInfo.lastName}
            </h1>
            <p className="text-sm md:text-base mt-2 opacity-90">{userData.user.role}</p>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Header and Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brown">User Profile</h2>
              <p className="text-gray-600 mt-2 text-sm md:text-base">
                Explore and manage user details, insurance, and content reviews.
              </p>
            </div>
            {userData && (
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDeactivateModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-400 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200"
                >
                  <FaTrashAlt className="mr-2" />
                  Deactivate
                </motion.button>
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
              <p className="text-brown mt-4 text-lg font-medium">Loading user details...</p>
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
              {/* Personal Info */}
              <motion.div
                id="personal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
              >
                <div className="flex  items-center gap-2 mb-4">
                  <FaUser className="text-xl text-yellowGreen" />
                  <h2 className="text-lg md:text-xl font-semibold text-brown">Personal Information</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">Details about the user’s identity and contact information.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Full Name</p>
                    <p className="text-base text-brown">
                      {userData.user.personalInfo.firstName} {userData.user.personalInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Email</p>
                    <p className="text-base text-brown truncate">{userData.user.personalInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone Number</p>
                    <p className="text-base text-brown">
                      {userData.user.personalInfo.phoneNumber ? userData.user.personalInfo.phoneNumber : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Country</p>
                    <p className="text-base text-brown">
                      {userData.user.personalInfo.country ? userData.user.personalInfo.country : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Address</p>
                    <p className="text-base text-brown">
                      {userData.user.personalInfo.address?.street
                        ? `${userData.user.personalInfo.address.street}, ${userData.user.personalInfo.address.city || ''} ${
                            userData.user.personalInfo.address.postalCode || ''
                          }`
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                    <p className="text-base text-brown">
                      {userData.user.personalInfo.dateOfBirth
                        ? moment(userData.user.personalInfo.dateOfBirth).format('MMM D, YYYY')
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Verified</p>
                    <p className="text-base text-brown">{userData.user.isVerified ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Role</p>
                    <p className="text-base text-brown">{userData.user.role}</p>
                  </div>
                </div>
              </motion.div>

              {/* Insurance Details */}
              <motion.div
                id="insurance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white w-full border-2 border-appleGreen rounded-lg p-6 shadow-md"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaShieldAlt className="text-xl text-yellowGreen" />
                  <h2 className="text-lg md:text-xl font-semibold text-brown">Insurance Details</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">Overview of the user’s insurance status and policy details.</p>
                {userData.user.insuranceStatus ? (
                  <div className="space-y-2">
                    {[
                      { label: 'Status', value: getStatusBadge(userData.user.insuranceStatus?.status || 'NotApplied') },
                      {
                        label: 'Applied At',
                        value: userData.user.insuranceStatus?.appliedAt
                          ? moment(userData.user.insuranceStatus.appliedAt).format('MMM D, YYYY')
                          : 'N/A',
                      },
                      {
                        label: 'Approved At',
                        value: userData.user.insuranceStatus?.approvedAt
                          ? moment(userData.user.insuranceStatus.approvedAt).format('MMM D, YYYY')
                          : 'N/A',
                      },
                      {
                        label: 'Rejected/Surrendered At',
                        value: userData.user.insuranceStatus?.rejectedAt
                          ? moment(userData.user.insuranceStatus.rejectedAt).format('MMM D, YYYY')
                          : userData.user.insuranceStatus?.surrenderedAt
                          ? moment(userData.user.insuranceStatus.surrenderedAt).format('MMM D, YYYY')
                          : 'N/A',
                      },
                      {
                        label: 'Policy Start Date',
                        value: userData.user.insuranceStatus?.policyStartDate
                          ? moment(userData.user.insuranceStatus.policyStartDate).format('MMM D, YYYY')
                          : 'N/A',
                      },
                      {
                        label: 'Policy End Date',
                        value: userData.user.insuranceStatus?.policyEndDate
                          ? moment(userData.user.insuranceStatus.policyEndDate).format('MMM D, YYYY')
                          : 'N/A',
                      },
                      {
                        label: 'Coverage Period',
                        value: userData.user.insuranceStatus?.coveragePeriod
                          ? `${userData.user.insuranceStatus.coveragePeriod} months`
                          : 'N/A',
                      },
                      {
                        label: 'Rejection Reason',
                        value: userData.user.insuranceStatus?.rejectionReason || 'N/A',
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
                ) : (
                  <div className="text-center text-gray-600">
                    <FaShieldAlt className="mx-auto text-2xl text-gray-400 mb-2" />
                    No insurance details available
                  </div>
                )}
              </motion.div>

              {/* Financial Info */}
              <motion.div
                id="financial"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaDollarSign className="text-xl text-yellowGreen" />
                  <h2 className="text-lg md:text-xl font-semibold text-brown">Financial Information</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">Financial details including earnings and payment methods.</p>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-600">Monthly Earnings</p>
                    <p className="text-base text-brown font-semibold">
                      {userData.user.financialInfo?.monthlyEarnings
                        ? `${userData.user.financialInfo.currency || 'KES'} ${userData.user.financialInfo.monthlyEarnings.toFixed(2)}`
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-600">Payment Method</p>
                    <p className="text-base text-brown font-semibold">
                      {userData.user.financialInfo?.paymentMethod?.type || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-600">Payment Details</p>
                    <p className="text-base text-brown font-semibold">
                      {userData.user.financialInfo?.paymentMethod?.details?.accountNumber ||
                      userData.user.financialInfo?.paymentMethod?.details?.mobileNumber
                        ? `${userData.user.financialInfo.paymentMethod.details.accountNumber || ''} ${
                            userData.user.financialInfo.paymentMethod.details.mobileNumber || ''
                          } ${userData.user.financialInfo.paymentMethod.details.bankName || ''}`.trim()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Premium Details */}
              {userData.premium ? (
                <motion.div
                  id="premium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FaCreditCard className="text-xl text-yellowGreen" />
                    <h2 className="text-lg md:text-xl font-semibold text-brown">Premium Details</h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Information about the user’s insurance premium.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Final Amount (KES)</p>
                      <p className="text-base text-brown">
                        {userData.premium.finalAmount ? userData.premium.finalAmount.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Final Percentage</p>
                      <p className="text-base text-brown">
                        {userData.premium.finalPercentage
                          ? `${userData.premium.finalPercentage.toFixed(2)}%`
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Payment Status</p>
                      <p className="text-base text-brown">
                        {userData.premium.paymentStatus?.status || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Due Date</p>
                      <p className="text-base text-brown">
                        {userData.premium.paymentStatus?.dueDate
                          ? moment(userData.premium.paymentStatus.dueDate).format('MMM D, YYYY')
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Discount Applied</p>
                      <p className="text-base text-brown">
                        {userData.premium.discount?.percentage
                          ? `${userData.premium.discount.percentage}% (${userData.premium.discount.reason || 'No reason'})`
                          : 'None'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Risk Explanation</p>
                      <p className="text-base text-brown">
                        {userData.premium.adjustmentFactors?.riskExplanation || 'N/A'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {/* Platforms */}
              {userData.user.platformInfo?.platforms?.length > 0 ? (
                <motion.div
                  id="platforms"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FaBriefcase className="text-xl text-yellowGreen" />
                    <h2 className="text-lg md:text-xl font-semibold text-brown">Social Platforms</h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">Social media platforms associated with the user.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-appleGreen text-white">
                          <th className="p-3 text-sm font-semibold rounded-tl-lg">Platform</th>
                          <th className="p-3 text-sm font-semibold">Username</th>
                          <th className="p-3 text-sm font-semibold">Account Link</th>
                          <th className="p-3 text-sm font-semibold">Audience Size</th>
                          <th className="p-3 text-sm font-semibold">Content Type</th>
                          <th className="p-3 text-sm font-semibold rounded-tr-lg">Verified</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.user.platformInfo.platforms.map((platform, index) => (
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
                            <td className="p-3 text-brown">{platform.isVerified ? 'Yes' : 'No'}</td>
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
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="bg-white border-2 border-appleGreen rounded-lg p-6 text-center text-gray-600 shadow-md"
                >
                  <FaBriefcase className="mx-auto text-2xl text-gray-400 mb-2" />
                  No social platforms found
                </motion.div>
              )}

              {/* Claims */}
              {userData.claims?.length > 0 ? (
                <motion.div
                  id="claims"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FaFileAlt className="text-xl text-yellowGreen" />
                    <h2 className="text-lg md:text-xl font-semibold text-brown">Claims</h2>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">History of insurance claims filed by the user.</p>
                  <div className="space-y-4">
                    {userData.claims.map((claim, index) => (
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
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="bg-white border-2 border-appleGreen rounded-lg p-6 text-center text-gray-600 shadow-md"
                >
                  <FaFileAlt className="mx-auto text-2xl text-gray-400 mb-2" />
                  No claims found
                </motion.div>
              )}

              {/* Content Reviews Table */}
              <motion.div
                id="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border-2 border-appleGreen rounded-lg p-6 shadow-md w-full"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaFileAlt className="text-xl text-yellowGreen" />
                  <h2 className="text-lg md:text-xl font-semibold text-brown">Content Reviews</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">Assessments of the user’s content for risk and compliance.</p>
                {contentReviews.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left table-fixed">
                      <thead>
                        <tr className="bg-appleGreen text-white">
                          <th className="p-3 text-sm font-semibold rounded-tl-lg w-1/4">Platform</th>
                          <th className="p-3 text-sm font-semibold w-1/4">Content Type</th>
                          <th className="p-3 text-sm font-semibold w-1/4">Risk Level</th>
                          <th className="p-3 text-sm font-semibold rounded-tr-lg w-1/4">Last Assessed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedReviews.map((review, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className={`border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="p-3 text-brown truncate">{review.platform || 'N/A'}</td>
                            <td className="p-3 text-brown truncate">{review.contentType || 'N/A'}</td>
                            <td className="p-3 text-brown truncate">{review.riskLevel || 'N/A'}</td>
                            <td className="p-3 text-brown truncate">
                              {review.lastAssessed ? moment(review.lastAssessed).format('MMM D, YYYY') : 'N/A'}
                            </td>
                          </motion.tr>
                        ))}
                        {/* Pad with empty rows if less than 10 */}
                        {paginatedReviews.length < rowsPerPage &&
                          Array.from({ length: rowsPerPage - paginatedReviews.length }).map((_, index) => (
                            <tr
                              key={`empty-${index}`}
                              className={`border-b border-gray-200 ${
                                (paginatedReviews.length + index) % 2 === 0 ? 'bg-white' : 'bg-gray-50'
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
                        Showing {Math.min((currentPage - 1) * rowsPerPage + 1, contentReviews.length)}–
                        {Math.min(currentPage * rowsPerPage, contentReviews.length)} of {contentReviews.length}
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
                    No content reviews found
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>

        {/* Modals */}
        {userData ? (
          <>
            <UpdateUserForm
              isOpen={isUpdateModalOpen}
              onClose={() => setIsUpdateModalOpen(false)}
              user={userData}
              userId={userId}
              onUpdate={handleUpdate}
            />
            <DeactivateConfirmModal
              isOpen={isDeactivateModalOpen}
              onClose={() => setIsDeactivateModalOpen(false)}
              userId={userId}
              userName={`${userData.user.personalInfo.firstName} ${userData.user.personalInfo.lastName}`}
            />
          </>
        ) : null}
      </motion.div>
    </PageAbsorber>
  );
};

export default UserInfo;