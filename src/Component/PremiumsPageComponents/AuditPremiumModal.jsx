// src/components/PremiumComponents/AuditPremiumModal.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiDownload, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';
import { auditPremiumsWithAI } from '../../Resources/Apiservice';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

const AuditPremiumModal = ({ open, handleClose, premiums, onSuccess }) => {
  const [selectedPremiums, setSelectedPremiums] = useState([]);
  const [error, setError] = useState('');
  const [auditResults, setAuditResults] = useState([]);
  const [expandedResult, setExpandedResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const rowsPerPage = 5;

  const handleSelect = (premiumId) => {
    setSelectedPremiums((prev) =>
      prev.includes(premiumId) ? prev.filter((id) => id !== premiumId) : [...prev, premiumId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPremiums(paginatedPremiums.map((premium) => premium._id));
    } else {
      setSelectedPremiums([]);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (selectedPremiums.length === 0) {
      setError('Select at least one premium');
      toast.error('Select at least one premium', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      return;
    }

    setIsAuditing(true);
    try {
      const response = await auditPremiumsWithAI({ premiumIds: selectedPremiums });
      console.log('API Response:', response);
      if (!response) {
        throw new Error('No response received from API');
      }
      if (!response.data) {
        throw new Error('Response is missing data field');
      }
      if (!Array.isArray(response.data.data)) {
        console.error('Invalid data field:', response.data);
        throw new Error('Invalid response format: Expected an array in response.data.data');
      }
      setAuditResults(response.data.data);
      toast.success('Audit completed successfully', {
        style: { background: '#D4F4D4', color: '#1A4F1A' },
      });
    } catch (err) {
      console.error('Audit Error:', err.message, err.stack);
      setError('Failed to audit premiums: ' + err.message);
      toast.error('Failed to audit premiums', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      setAuditResults([]);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleDownload = async () => {
    if (auditResults.length === 0) {
      toast.error('No results to download', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      return;
    }

    setIsDownloading(true);
    try {
      // Create a new Document
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              // Title
              new Paragraph({
                text: 'CCI Premium Audit Results',
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
              }),
              // Summary Section
              new Paragraph({
                text: 'Audit Summary',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Total Audited: ', bold: true }),
                  new TextRun({ text: `${getSummary().totalAudited}` }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Successful Audits: ', bold: true }),
                  new TextRun({ text: `${getSummary().successfulAudits}` }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Failed Audits: ', bold: true }),
                  new TextRun({ text: `${getSummary().failedAudits}` }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Total Insights: ', bold: true }),
                  new TextRun({ text: `${getSummary().totalInsights}` }),
                ],
                spacing: { after: 300 },
              }),
              // Detailed Results Section
              new Paragraph({
                text: 'Detailed Results',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 },
              }),
              // Iterate over auditResults
              ...auditResults.flatMap((result) => {
                const premium = premiums.find((p) => p._id === result.premiumId);
                const email = premium?.premiumDetails?.userId?.personalInfo?.email || 'N/A';
                const amount = premium?.premiumDetails?.finalAmount
                  ? `KES ${premium.premiumDetails.finalAmount.toFixed(2)}`
                  : 'N/A';
                const percentage = premium?.premiumDetails?.finalPercentage
                  ? `${premium.premiumDetails.finalPercentage}%`
                  : 'N/A';
                const status = result.success ? 'Success' : 'Failed';

                return [
                  // Premium Heading
                  new Paragraph({
                    text: `Premium ID: ${result.premiumId}`,
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 200 },
                  }),
                  // Premium Details
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Email: ', bold: true }),
                      new TextRun({ text: email }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Amount: ', bold: true }),
                      new TextRun({ text: amount }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: 'Percentage: ', bold: true }),
                      new TextRun({ text: percentage }),
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
                  // Insights or Error
                  ...(result.success
                    ? [
                        new Paragraph({
                          text: 'Insights',
                          heading: HeadingLevel.HEADING_3,
                          spacing: { before: 200, after: 100 },
                        }),
                        ...(result.insights?.length > 0
                          ? result.insights.flatMap((insight, idx) => [
                              new Paragraph({
                                text: `${idx + 1}. ${insight.title}`,
                                heading: HeadingLevel.HEADING_4,
                                spacing: { before: 100, after: 100 },
                              }),
                              new Paragraph({
                                children: [
                                  new TextRun({ text: 'Description: ', bold: true }),
                                  new TextRun({ text: insight.description }),
                                ],
                                spacing: { after: 100 },
                              }),
                              new Paragraph({
                                children: [
                                  new TextRun({ text: 'Action: ', bold: true }),
                                  new TextRun({ text: insight.action }),
                                ],
                                spacing: { after: 200 },
                              }),
                            ])
                          : [
                              new Paragraph({
                                text: 'No insights generated for this premium.',
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
                          text: result.error || 'Audit failed for this premium.',
                          spacing: { after: 200 },
                        }),
                      ]),
                ];
              }),
            ],
          },
        ],
      });

      // Generate the .docx file
      const blob = await Packer.toBlob(doc);
      saveAs(blob, 'CCI_Audit_Results.docx');
      toast.success('Audit results downloaded as Word document', {
        style: { background: '#D4F4D4', color: '#1A4F1A' },
      });
    } catch (err) {
      console.error('Download Error:', err.message, err.stack);
      toast.error('Failed to download results', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const toggleExpand = (premiumId) => {
    setExpandedResult(expandedResult === premiumId ? null : premiumId);
  };

  const getSummary = () => {
    if (!Array.isArray(auditResults) || auditResults.length === 0) {
      return { totalAudited: 0, successfulAudits: 0, failedAudits: 0, totalInsights: 0 };
    }
    const totalAudited = auditResults.length;
    const successfulAudits = auditResults.filter((r) => r.success).length;
    const failedAudits = totalAudited - successfulAudits;
    const totalInsights = auditResults.reduce((sum, r) => sum + (r.insights?.length || 0), 0);
    return { totalAudited, successfulAudits, failedAudits, totalInsights };
  };

  const handleCloseModal = () => {
    setAuditResults([]);
    setSelectedPremiums([]);
    setError('');
    setExpandedResult(null);
    setCurrentPage(1);
    if (auditResults.length > 0) onSuccess();
    handleClose();
  };

  // Pagination logic
  const paginatedPremiums = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return premiums.slice(startIndex, startIndex + rowsPerPage);
  }, [premiums, currentPage]);

  const totalPages = Math.ceil(premiums.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedPremiums([]); // Clear selections when changing pages
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedPremiums([]); // Clear selections when changing pages
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white rounded-xl shadow-md border border-appleGreen w-full max-w-4xl mx-4 max-h-[80vh] overflow-auto p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg md:text-xl font-bold text-brown">Audit Premiums with AI</h2>
              <button
                onClick={handleCloseModal}
                className="text-brown hover:text-fadeBrown"
              >
                <FiXCircle size={24} />
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center bg-red-100 text-red-900 p-3 rounded-lg mb-4"
              >
                <FiAlertCircle className="mr-2 text-lg" />
                {error}
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
                              checked={selectedPremiums.length === paginatedPremiums.length && paginatedPremiums.length > 0}
                              onChange={handleSelectAll}
                              className="h-4 w-4 text-appleGreen focus:ring-appleGreen border-gray-300 rounded"
                            />
                          </th>
                          <th className="p-4 font-medium text-center">Email</th>
                          <th className="p-4 font-medium text-center min-w-44">Name</th>
                          <th className="p-4 font-medium text-center">Percentage</th>
                          <th className="p-4 font-medium text-center">Amount (KES)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedPremiums.map((premium, index) => (
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
                                onChange={() => handleSelect(premium._id)}
                                className="h-4 w-4 text-appleGreen focus:ring-appleGreen border-gray-300 rounded"
                              />
                            </td>
                            <td className="p-4 text-center text-xs md:text-sm text-brown">
                              {premium.premiumDetails?.userId?.personalInfo?.email || 'N/A'}
                            </td>
                            <td className="p-4 text-center min-w-44 text-xs md:text-sm text-brown">
                              {`${premium.premiumDetails?.userId?.personalInfo?.firstName || ''} ${
                                premium.premiumDetails?.userId?.personalInfo?.lastName || ''
                              }` || 'N/A'}
                            </td>
                            <td className="p-4 text-center text-xs md:text-sm text-brown">
                              {premium.premiumDetails?.finalPercentage ? `${premium.premiumDetails.finalPercentage}%` : 'N/A'}
                            </td>
                            <td className="p-4 text-center text-xs md:text-sm text-brown">
                              {premium.premiumDetails?.finalAmount ? `KES ${premium.premiumDetails.finalAmount.toFixed(2)}` : 'N/A'}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs md:text-sm text-gray-600">
                        Showing {((currentPage - 1) * rowsPerPage) + 1} - {Math.min(currentPage * rowsPerPage, premiums.length)} of {premiums.length}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-appleGreen text-white hover:bg-yellowGreen'}`}
                        >
                          <FiChevronLeft />
                        </button>
                        <button
                          onClick={handleNextPage}
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
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold hover:bg-brown hover:scale-105 transition-all duration-200"
                    >
                      <FiXCircle className="inline mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isAuditing}
                      className={`px-4 py-2 rounded-lg font-semibold flex items-center justify-center transition-all duration-200 ${
                        isAuditing
                          ? 'bg-appleGreen/50 text-white cursor-not-allowed'
                          : 'bg-appleGreen text-white hover:bg-yellowGreen hover:scale-105'
                      }`}
                    >
                      {isAuditing ? (
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
                  {/* Summary Card */}
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
                        <p className="text-base md:text-lg font-semibold text-brown">{getSummary().totalAudited}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">Successful Audits</p>
                        <p className="text-base md:text-lg font-semibold text-appleGreen">{getSummary().successfulAudits}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">Failed Audits</p>
                        <p className="text-base md:text-lg font-semibold text-red-500">{getSummary().failedAudits}</p>
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-600">Total Insights</p>
                        <p className="text-base md:text-lg font-semibold text-brown">{getSummary().totalInsights}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Results List */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-brown mb-4">Detailed Results</h3>
                    {auditResults.map((result, index) => {
                      const premium = premiums.find((p) => p._id === result.premiumId);
                      return (
                        <motion.div
                          key={result.premiumId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-white rounded-lg shadow-md mb-4 border border-appleGreen"
                        >
                          <div
                            className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 cursor-pointer hover:bg-fadeBrown transition-colors"
                            onClick={() => toggleExpand(result.premiumId)}
                          >
                            <div className="mb-2 md:mb-0">
                              <p className="text-brown font-semibold text-sm md:text-base">
                                {premium?.premiumDetails?.userId?.personalInfo?.email || 'N/A'}
                              </p>
                              <p className="text-xs md:text-sm text-gray-600">
                                Amount: {premium?.premiumDetails?.finalAmount ? `KES ${premium.premiumDetails.finalAmount.toFixed(2)}` : 'N/A'} | Percentage:{' '}
                                {premium?.premiumDetails?.finalPercentage ? `${premium.premiumDetails.finalPercentage}%` : 'N/A'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                                  result.success ? 'bg-appleGreen text-white' : 'bg-red-500 text-white'
                                }`}
                              >
                                {result.success ? 'Success' : 'Failed'}
                              </span>
                              {expandedResult === result.premiumId ? (
                                <FiChevronUp className="text-brown" />
                              ) : (
                                <FiChevronDown className="text-brown" />
                              )}
                            </div>
                          </div>
                          <AnimatePresence>
                            {expandedResult === result.premiumId && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="p-4 border-t border-gray-200"
                              >
                                <div className="space-y-4">
                                  {result.success ? (
                                    result.insights?.length > 0 ? (
                                      <div>
                                        <p className="text-sm md:text-base font-medium text-brown mb-2">Insights</p>
                                        <div className="space-y-3">
                                          {result.insights.map((insight, idx) => (
                                            <div
                                              key={idx}
                                              className="p-3 bg-gray-50 rounded-lg border border-appleGreen hover:bg-appleGreen/10 transition-colors"
                                            >
                                              <p className="text-sm md:text-base font-medium text-brown">{insight.title}</p>
                                              <p className="text-xs md:text-sm text-gray-600 mt-1">{insight.description}</p>
                                              <p className="text-xs md:text-sm text-appleGreen mt-1 flex items-center">
                                                <FiCheckCircle className="mr-2" />
                                                Action: {insight.action}
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-xs md:text-sm text-gray-600">No insights generated for this premium.</p>
                                    )
                                  ) : (
                                    <div className="flex items-center text-red-500 text-xs md:text-sm">
                                      <FiAlertCircle className="mr-2" />
                                      Error: {result.error || 'Audit failed for this premium.'}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row justify-end gap-3 mt-4">
                    <button
                      onClick={handleDownload}
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
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg font-semibold hover:bg-brown hover:scale-105 transition-all duration-200"
                    >
                      <FiXCircle className="inline mr-2" />
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuditPremiumModal;