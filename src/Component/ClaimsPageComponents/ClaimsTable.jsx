// src/components/claims/ClaimsTable.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiChevronDown, FiChevronUp, FiCheckCircle, FiX, FiAlertCircle, FiDownload, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { bulkReviewClaims, auditClaimsWithAI } from '../../Resources/Apiservice';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import AuditInsightsCard from './AuditInsightsCard';
import InsightCard from '../HomePageComponents/InsightCard';

const ClaimsTable = ({ claims, pagination, onFilterChange, onPageChange, onBulkReview }) => {
  const [selectedClaims, setSelectedClaims] = useState([]);
  const [filters, setFilters] = useState({ search: '', status: '', platform: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [bulkReviewData, setBulkReviewData] = useState({
    isValid: true,
    notes: '',
    payoutAmount: '',
  });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [auditResults, setAuditResults] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [auditError, setAuditError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSelectClaim = (claimId) => {
    setSelectedClaims((prev) =>
      prev.includes(claimId) ? prev.filter((id) => id !== claimId) : [...prev, claimId]
    );
  };

  const handleSelectAll = () => {
    if (selectedClaims.length === claims.length) {
      setSelectedClaims([]);
    } else {
      setSelectedClaims(claims.map((claim) => claim._id));
    }
  };

  const handleBulkReviewSubmit = async (e) => {
    e.preventDefault();
    if (selectedClaims.length === 0) {
      toast.error('Please select at least one claim', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      return;
    }
    if (!bulkReviewData.notes.trim()) {
      toast.error('Notes are required for all reviews', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      return;
    }
    setReviewLoading(true);
    try {
      const response = await bulkReviewClaims({
        reviews: selectedClaims.map((claimId) => ({
          claimId,
          isValid: bulkReviewData.isValid,
          notes: bulkReviewData.notes,
          payoutAmount: bulkReviewData.isValid ? parseFloat(bulkReviewData.payoutAmount) || undefined : 0,
        })),
      });
      const results = response.data.data;
      const failedReviews = results.filter((r) => !r.success);
      if (failedReviews.length > 0) {
        toast.error(
          `Some reviews failed: ${failedReviews.length} out of ${results.length}`,
          {
            style: { background: '#FECACA', color: '#7F1D1D' },
          }
        );
        failedReviews.forEach((r) => {
          toast.error(`Claim ${r.claimId.slice(-6)}: ${r.error}`, {
            style: { background: '#FECACA', color: '#7F1D1D' },
          });
        });
      } else {
        toast.success('Bulk review completed successfully', {
          style: { background: '#A3E635', color: '#4A2C2A' },
        });
      }
      onBulkReview(selectedClaims);
      setSelectedClaims([]);
      setReviewModalOpen(false);
      setBulkReviewData({ isValid: true, notes: '', payoutAmount: '' });
    } catch (err) {
      toast.error(`Bulk review failed: ${err.message}`, {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAuditSubmit = async () => {
    setAuditError('');
    if (selectedClaims.length === 0) {
      setAuditError('Select at least one claim');
      toast.error('Select at least one claim', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      return;
    }
    setAuditLoading(true);
    try {
      const response = await auditClaimsWithAI({ claimIds: selectedClaims });
      if (!response?.data?.data || !Array.isArray(response.data.data)) {
        console.error('Invalid audit response:', response);
        throw new Error('Invalid response format from audit API');
      }
      setAuditResults(response.data.data);
      toast.success('Audit completed successfully', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
    } catch (err) {
      console.error('Audit error:', err);
      setAuditError(`Failed to audit claims: ${err.message}`);
      toast.error(`Failed to audit claims: ${err.message}`, {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      setAuditResults([]);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleDownloadAuditResults = async () => {
    if (!Array.isArray(auditResults) || auditResults.length === 0) {
      toast.error('No audit results to download', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      return;
    }
    setIsDownloading(true);
    try {
      console.log('Downloading audit results:', auditResults); // Debugging log
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: 'CCI Claim Audit Results',
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
              }),
              new Paragraph({
                text: 'Audit Summary',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Total Audited: ', bold: true }),
                  new TextRun({ text: `${getAuditSummary().totalAudited}` }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Successful Audits: ', bold: true }),
                  new TextRun({ text: `${getAuditSummary().successfulAudits}` }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Failed Audits: ', bold: true }),
                  new TextRun({ text: `${getAuditSummary().failedAudits}` }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Total Insights: ', bold: true }),
                  new TextRun({ text: `${getAuditSummary().totalInsights}` }),
                ],
                spacing: { after: 300 },
              }),
              new Paragraph({
                text: 'Detailed Results',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 },
              }),
              ...auditResults.flatMap((auditResult) => {
                if (!auditResult || !auditResult.claimId) {
                  console.warn('Invalid audit result:', auditResult);
                  return [
                    new Paragraph({
                      text: `Claim ID: Unknown`,
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 300, after: 200 },
                    }),
                    new Paragraph({
                      text: 'Error: Invalid audit result data.',
                      spacing: { after: 200 },
                    }),
                  ];
                }
                const claim = claims.find((c) => c._id === auditResult.claimId) || {};
                const userId = claim?.claimDetails?.userId?.slice(-6) || 'N/A';
                const platform = claim?.claimDetails?.platform || 'N/A';
                const status = auditResult.success ? 'Success' : 'Failed';

                return [
                  new Paragraph({
                    text: `Claim ID: ${auditResult.claimId.slice(-6)}`,
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'User ID: ', bold: true }),
                      new TextRun({ text: userId }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Platform: ', bold: true }),
                      new TextRun({ text: platform }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Status: ', bold: true }),
                      new TextRun({ text: status }),
                    ],
                    spacing: { after: 200 },
                  }),
                  ...(auditResult.success && Array.isArray(auditResult.insights)
                    ? [
                        new Paragraph({
                          text: 'Insights',
                          heading: HeadingLevel.HEADING_3,
                          spacing: { before: 200, after: 100 },
                        }),
                        ...(auditResult.insights.length > 0
                          ? auditResult.insights.flatMap((insight, idx) => [
                              new Paragraph({
                                text: `${idx + 1}. ${insight.title || 'Untitled Insight'}`,
                                heading: HeadingLevel.HEADING_4,
                                spacing: { before: 100, after: 100 },
                              }),
                              new Paragraph({
                                children: [
                                  new TextRun({ text: 'Description: ', bold: true }),
                                  new TextRun({ text: insight.description || 'No description provided' }),
                                ],
                                spacing: { after: 100 },
                              }),
                              new Paragraph({
                                children: [
                                  new TextRun({ text: 'Action: ', bold: true }),
                                  new TextRun({ text: insight.action || 'No action specified' }),
                                ],
                                spacing: { after: 200 },
                              }),
                            ])
                          : [
                              new Paragraph({
                                text: 'No insights generated for this claim.',
                                spacing: { after: 200 },
                              }),
                            ]),
                      ]
                    : [
                        new Paragraph({
                          text: 'Error',
                          heading: HeadingLevel.HEADING_3,
                          spacing: { before: 200, after: 100 },
                        }),
                        new Paragraph({
                          text: auditResult.error || 'Audit failed for this claim.',
                          spacing: { after: 200 },
                        }),
                      ]),
                ];
              }),
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'CCI_Claim_Audit_Results.docx');
      toast.success('Audit results downloaded', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
    } catch (err) {
      console.error('Download error:', err);
      toast.error(`Failed to download results: ${err.message}`, {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const getAuditSummary = () => {
    if (!Array.isArray(auditResults)) {
      console.warn('auditResults is not an array:', auditResults);
      return { totalAudited: 0, successfulAudits: 0, failedAudits: 0, totalInsights: 0 };
    }
    const totalAudited = auditResults.length;
    const successfulAudits = auditResults.filter((r) => r.success).length;
    const failedAudits = totalAudited - successfulAudits;
    const totalInsights = auditResults.reduce(
      (sum, r) => sum + (Array.isArray(r.insights) ? r.insights.length : 0),
      0
    );
    return { totalAudited, successfulAudits, failedAudits, totalInsights };
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Submitted: 'bg-yellow-200 text-yellow-900',
      Approved: 'bg-appleGreen text-brown',
      Rejected: 'bg-red-200 text-red-900',
      Paid: 'bg-blue-200 text-blue-900',
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

  // Pagination for claims in audit modal
  const paginatedClaims = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return claims.filter((c) => selectedClaims.includes(c._id)).slice(startIndex, startIndex + rowsPerPage);
  }, [claims, selectedClaims, currentPage]);
  const totalPages = Math.ceil(selectedClaims.length / rowsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md p-6 border border-appleGreen"
    >
      {/* Header and Filters Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-brown mb-4 md:mb-0">All Claims</h2>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brown" />
            <input
              type="text"
              placeholder="Search claims..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              className="pl-10 p-2 border border-appleGreen rounded-lg text-brown w-full md:w-64"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold hover:bg-brown hover:scale-105 transition-all duration-200"
          >
            Filters {showFilters ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
          </button>
        </div>
      </div>

      {/* Collapsible Filters */}
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
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="p-2 border border-appleGreen rounded-lg text-brown w-full md:w-48"
              >
                <option value="">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Paid">Paid</option>
              </select>
              <select
                name="platform"
                value={filters.platform}
                onChange={handleFilterChange}
                className="p-2 border border-appleGreen rounded-lg text-brown w-full md:w-48"
              >
                <option value="">All Platforms</option>
                <option value="YouTube">YouTube</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons (Bulk Review & Audit) */}
      <AnimatePresence>
        {selectedClaims.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mb-6"
          >
            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold hover:bg-brown hover:scale-105 transition-all duration-200"
            >
              <FiCheckCircle className="inline mr-2" />
              Review {selectedClaims.length} Selected
            </button>
            <button
              onClick={() => {
                setCurrentPage(1);
                setAuditModalOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-appleGreen to-yellowGreen text-white rounded-lg font-semibold hover:bg-yellowGreen hover:scale-105 transition-all duration-200"
            >
              <FiAlertCircle className="inline mr-2" />
              Audit with AI
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      {claims.length === 0 && !filters.search && !filters.status && !filters.platform ? (
        <div className="text-center py-20">
          <p className="text-brown text-lg font-medium">No claims found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-appleGreen/50 scrollbar-track-gray-100">
            <table className="w-full min-w-[800px] text-left table-auto">
              <thead>
                <tr className="text-xs md:text-sm text-gray-500 bg-gray-50 sticky top-0 z-10">
                  <th className="p-4 text-center font-medium">
                    <input
                      type="checkbox"
                      checked={selectedClaims.length === claims.length && claims.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-center font-medium">Claim ID</th>
                  <th className="p-4 text-center font-medium">User ID</th>
                  <th className="p-4 text-center font-medium">Platform</th>
                  <th className="p-4 text-center font-medium">Status</th>
                  <th className="p-4 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-brown text-lg font-medium">
                      No claims match the current filters.
                    </td>
                  </tr>
                ) : (
                  claims.map((claim, index) => (
                    <motion.tr
                      key={claim._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      className="border-t border-gray-100 hover:bg-appleGreen/10 transition-all duration-200"
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedClaims.includes(claim._id)}
                          onChange={() => handleSelectClaim(claim._id)}
                        />
                      </td>
                      <td className="p-4 text-center text-xs md:text-sm text-brown">
                        <Link to={`/claims/${claim._id}`} className="hover:underline">
                          {claim._id.slice(-6)}
                        </Link>
                      </td>
                      <td className="p-4 text-center text-xs md:text-sm text-brown">
                        {claim.claimDetails.userId.slice(-6)}
                      </td>
                      <td className="p-4 text-center text-xs md:text-sm text-brown">
                        {claim.claimDetails.platform}
                      </td>
                      <td className="p-4 text-center text-xs md:text-sm text-brown">
                        {getStatusBadge(claim.statusHistory.history[claim.statusHistory.history.length - 1].status)}
                      </td>
                      <td className="p-4 text-center">
                        <Link to={`/claims/${claim._id}`} className="text-brown hover:underline">
                          View
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">
            Scroll left or right to view more
          </div>
          {claims.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} claims
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 bg-gray-200 text-brown rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-all duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 bg-gray-200 text-brown rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-all duration-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Bulk Review Modal */}
      <AnimatePresence>
        {reviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-xl max-w-md w-full shadow-2xl border-2 border-appleGreen bg-gradient-to-br from-white to-gray-50"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 bg-gradient-to-r from-appleGreen to-yellowGreen text-white rounded-t-xl">
                <h4 className="text-xl font-bold">Bulk Review {selectedClaims.length} Claims</h4>
                <button
                  onClick={() => setReviewModalOpen(false)}
                  className="text-white hover:text-brown transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleBulkReviewSubmit} className="p-6 space-y-6">
                <div>
                  <p className="text-gray-600 mb-4">
                    Review <strong>{selectedClaims.length}</strong> selected claim(s).
                  </p>
                  <label className="block text-sm font-medium mb-1 text-brown">
                    Action <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bulkReviewData.isValid ? 'approve' : 'reject'}
                    onChange={(e) => {
                      const isValid = e.target.value === 'approve';
                      setBulkReviewData({ ...bulkReviewData, isValid, notes: '' });
                    }}
                    className="w-full h-12 border-2 border-appleGreen rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                    required
                  >
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                  </select>
                </div>
                {bulkReviewData.isValid && (
                  <div>
                    <label className="block text-sm font-medium mb-1 text-brown">
                      Payout Amount per Claim (KES)
                    </label>
                    <input
                      type="number"
                      name="payoutAmount"
                      value={bulkReviewData.payoutAmount}
                      onChange={(e) =>
                        setBulkReviewData({ ...bulkReviewData, payoutAmount: e.target.value })
                      }
                      placeholder="Leave blank to use verified earnings loss"
                      className="w-full p-3 border-2 border-appleGreen rounded-lg text-brown bg-white focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1 text-brown">
                    Notes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={bulkReviewData.notes}
                    onChange={(e) =>
                      setBulkReviewData({ ...bulkReviewData, notes: e.target.value })
                    }
                    placeholder={bulkReviewData.isValid ? 'Reason for approval' : 'Reason for rejection'}
                    className={`w-full p-3 border-2 border-appleGreen rounded-lg text-brown bg-white focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200 ${
                      bulkReviewData.notes.trim() ? '' : 'border-red-500'
                    }`}
                    rows="4"
                    required
                  />
                  {!bulkReviewData.notes.trim() && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle /> Notes are required
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <motion.button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gray-200 text-brown rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300 shadow-md"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={reviewLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-yellowGreen to-appleGreen text-brown rounded-lg font-semibold disabled:opacity-50 transition-colors duration-300 shadow-md hover:shadow-yellowGreen/50"
                  >
                    {reviewLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-brown"
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
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FiCheckCircle className="mr-2" />
                        Process Review
                      </span>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audit with AI Modal */}
      <AnimatePresence>
        {auditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md border border-appleGreen w-full max-w-4xl mx-4 max-h-[80vh] overflow-auto p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-brown">Audit Claims with AI</h2>
                <button
                  onClick={() => {
                    setAuditResults([]);
                    setSelectedClaims([]);
                    setAuditError('');
                    setCurrentPage(1);
                    setAuditModalOpen(false);
                  }}
                  className="text-brown hover:text-fadeBrown"
                >
                  <FiX size={24} />
                </button>
              </div>

              {auditError && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center bg-red-100 text-red-900 p-3 rounded-lg mb-4"
                >
                  <FiAlertCircle className="mr-2 text-lg" />
                  {auditError}
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {auditResults.length === 0 ? (
                  <motion.div
                    key="selection"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-appleGreen/50 scrollbar-track-gray-100 mb-4">
                      <table className="w-full min-w-[600px] text-left table-auto">
                        <thead>
                          <tr className="text-xs md:text-sm text-gray-500 bg-gray-50 sticky top-0 z-10">
                            <th className="p-4 font-medium">
                              <input
                                type="checkbox"
                                checked={selectedClaims.length === paginatedClaims.length && paginatedClaims.length > 0}
                                onChange={() => {
                                  if (selectedClaims.length === paginatedClaims.length) {
                                    setSelectedClaims([]);
                                  } else {
                                    setSelectedClaims(claims.map((c) => c._id));
                                  }
                                }}
                                className="h-4 w-4 text-appleGreen focus:ring-appleGreen border-gray-300 rounded"
                              />
                            </th>
                            <th className="p-4 font-medium text-center">Claim ID</th>
                            <th className="p-4 font-medium text-center">User ID</th>
                            <th className="p-4 font-medium text-center">Platform</th>
                            <th className="p-4 font-medium text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedClaims.map((claim, index) => (
                            <motion.tr
                              key={claim._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.1 }}
                              className="border-t border-gray-100 hover:bg-appleGreen/10 transition-all duration-200"
                            >
                              <td className="p-4 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedClaims.includes(claim._id)}
                                  onChange={() => handleSelectClaim(claim._id)}
                                  className="h-4 w-4 text-appleGreen focus:ring-appleGreen border-gray-300 rounded"
                                />
                              </td>
                              <td className="p-4 text-center text-xs md:text-sm text-brown">
                                {claim._id.slice(-6)}
                              </td>
                              <td className="p-4 text-center text-xs md:text-sm text-brown">
                                {claim.claimDetails.userId.slice(-6)}
                              </td>
                              <td className="p-4 text-center text-xs md:text-sm text-brown">
                                {claim.claimDetails.platform}
                              </td>
                              <td className="p-4 text-center text-xs md:text-sm text-brown">
                                {getStatusBadge(claim.statusHistory.history[claim.statusHistory.history.length - 1].status)}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-xs md:text-sm text-gray-600">
                          Showing {((currentPage - 1) * rowsPerPage) + 1} - {Math.min(currentPage * rowsPerPage, selectedClaims.length)} of {selectedClaims.length}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-appleGreen text-white hover:bg-yellowGreen'}`}
                          >
                            <FiChevronLeft />
                          </button>
                          <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-appleGreen text-white hover:bg-yellowGreen'}`}
                          >
                            <FiChevronRight />
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-row justify-end gap-3">
                      <button
                        onClick={() => setAuditModalOpen(false)}
                        className="px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold hover:bg-brown hover:scale-105 transition-all duration-200"
                      >
                        <FiX className="inline mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleAuditSubmit}
                        disabled={auditLoading}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 ${
                          auditLoading
                            ? 'bg-appleGreen/50 text-white cursor-not-allowed'
                            : 'bg-appleGreen text-white hover:bg-yellowGreen hover:scale-105'
                        }`}
                      >
                        {auditLoading ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              <FiLoader className="mr-2" />
                            </motion.span>
                            Auditing…
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="inline mr-2" />
                            Run Audit
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-md p-6 border border-appleGreen"
                    >
                      <h3 className="text-lg md:text-xl font-bold text-brown mb-4">Audit Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">Total Audited</p>
                          <p className="text-base md:text-lg font-semibold text-brown">{getAuditSummary().totalAudited}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">Successful Audits</p>
                          <p className="text-base md:text-lg font-semibold text-appleGreen">{getAuditSummary().successfulAudits}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">Failed Audits</p>
                          <p className="text-base md:text-lg font-semibold text-red-500">{getAuditSummary().failedAudits}</p>
                        </div>
                        <div>
                          <p className="text-xs md:text-sm text-gray-600">Total Insights</p>
                          <p className="text-base md:text-lg font-semibold text-brown">{getAuditSummary().totalInsights}</p>
                        </div>
                      </div>
                    </motion.div>
                    <AuditInsightsCard
                      insights={auditResults
                        .filter((result) => result && result.claimId)
                        .flatMap((result) =>
                          (result.insights || []).map((insight) => ({
                            ...insight,
                            title: `${insight.title} (Claim ID: ${result.claimId.slice(-6)})`,
                          }))
                        )}
                    />
                    <div className="flex flex-row justify-end gap-3 mt-4">
                      <button
                        onClick={handleDownloadAuditResults}
                        disabled={isDownloading}
                        className={`px-4 py-2 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 ${
                          isDownloading
                            ? 'bg-yellowGreen/50 text-white cursor-not-allowed'
                            : 'bg-yellowGreen text-white hover:bg-appleGreen hover:scale-105'
                        }`}
                      >
                        {isDownloading ? (
                          <>
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              <FiLoader className="mr-2" />
                            </motion.span>
                            Downloading…
                          </>
                        ) : (
                          <>
                            <FiDownload className="mr-2" />
                            Download Results
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setAuditResults([]);
                          setSelectedClaims([]);
                          setAuditError('');
                          setCurrentPage(1);
                          setAuditModalOpen(false);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold hover:bg-brown hover:scale-105 transition-all duration-200"
                      >
                        <FiX className="inline mr-2" />
                        Close
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClaimsTable;