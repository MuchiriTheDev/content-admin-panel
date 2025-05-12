// src/components/PremiumComponents/AuditPremiumModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiDownload, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';
import { auditPremiumsWithAI } from '../../Resources/Apiservice';

const AuditPremiumModal = ({ open, handleClose, premiums, onSuccess }) => {
  const [selectedPremiums, setSelectedPremiums] = useState([]);
  const [error, setError] = useState('');
  const [auditResults, setAuditResults] = useState([]); // Initialize as empty array
  const [expandedResult, setExpandedResult] = useState(null);

  const handleSelect = (premiumId) => {
    setSelectedPremiums((prev) =>
      prev.includes(premiumId) ? prev.filter((id) => id !== premiumId) : [...prev, premiumId]
    );
  };

  const handleSubmit = async () => {
    if (selectedPremiums.length === 0) {
      setError('Select at least one premium');
      return;
    }

    try {
      const response = await auditPremiumsWithAI({ premiumIds: selectedPremiums });
      // Validate response.data is an array
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected an array of results');
      }
      setAuditResults(response.data);
      toast.success('Audit completed successfully', {
        style: { background: '#D4F4D4', color: '#1A4F1A' },
      });
    } catch (err) {
      setError('Failed to audit premiums: ' + err.message);
      toast.error('Failed to audit premiums', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
      setAuditResults([]); // Reset to empty array on error
    }
  };

  const handleDownload = () => {
    const data = JSON.stringify(auditResults, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    saveAs(blob, 'CCI_Audit_Results.json');
    toast.success('Audit results downloaded', {
      style: { background: '#D4F4D4', color: '#1A4F1A' },
    });
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
    if (auditResults.length > 0) onSuccess();
    handleClose();
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
            className="bg-white rounded-xl shadow-lg border border-appleGreen w-full max-w-4xl p-6 mx-4 max-h-[80vh] overflow-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-brown">Audit Premiums with AI</h2>
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
                  <div className="overflow-x-auto mb-4">
                    <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-brown to-fadeBrown text-white font-semibold text-sm">
                      <div>Select</div>
                      <div>Email</div>
                      <div className="text-center">Percentage</div>
                      <div className="text-center">Amount (KES)</div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {premiums?.map((premium) => (
                        <div
                          key={premium._id}
                          className="grid grid-cols-4 gap-4 p-4 hover:bg-fadeBrown transition-colors"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedPremiums.includes(premium._id)}
                              onChange={() => handleSelect(premium._id)}
                              className="h-5 w-5 text-appleGreen border-gray-300 rounded focus:ring-yellowGreen"
                            />
                          </div>
                          <div className="text-gray-600 truncate">
                            {premium.premiumDetails?.userId?.personalInfo?.email || 'N/A'}
                          </div>
                          <div className="text-center text-brown">
                            {premium.premiumDetails.finalPercentage || 'N/A'}%
                          </div>
                          <div className="text-center text-brown">
                            {premium.premiumDetails.finalAmount?.toFixed(2) || 'N/A'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-fadeBrown text-white rounded-lg font-semibold hover:bg-brown hover:scale-105 transition-all duration-200"
                    >
                      <FiXCircle className="inline mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-appleGreen text-white rounded-lg font-semibold hover:bg-yellowGreen hover:scale-105 transition-all duration-200"
                    >
                      <FiCheckCircle className="inline mr-2" />
                      Run Audit
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
                    className="bg-gradient-to-r from-gray-50 to-white rounded-lg shadow-md p-6 border border-appleGreen"
                  >
                    <h3 className="text-xl font-bold text-brown mb-4">Audit Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Audited</p>
                        <p className="text-lg font-semibold text-brown">{getSummary().totalAudited}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Successful Audits</p>
                        <p className="text-lg font-semibold text-appleGreen">{getSummary().successfulAudits}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Failed Audits</p>
                        <p className="text-lg font-semibold text-red-500">{getSummary().failedAudits}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Insights</p>
                        <p className="text-lg font-semibold text-brown">{getSummary().totalInsights}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Results List */}
                  <div>
                    <h3 className="text-xl font-bold text-brown mb-4">Detailed Results</h3>
                    {auditResults.map((result) => {
                      const premium = premiums.find((p) => p._id === result.premiumId);
                      return (
                        <motion.div
                          key={result.premiumId}
                          className="bg-white rounded-lg shadow-md mb-4 border border-appleGreen"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div
                            className="flex justify-between items-center p-4 cursor-pointer hover:bg-fadeBrown transition-colors"
                            onClick={() => toggleExpand(result.premiumId)}
                          >
                            <div>
                              <p className="text-brown font-semibold">
                                {premium?.premiumDetails?.userId?.personalInfo?.email || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-600">
                                Amount: KES {premium?.premiumDetails?.finalAmount?.toFixed(2) || 'N/A'} | Percentage:{' '}
                                {premium?.premiumDetails?.finalPercentage || 'N/A'}%
                              </p>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
                                        <p className="text-sm font-medium text-brown mb-2">Insights</p>
                                        <div className="space-y-3">
                                          {result.insights.map((insight, idx) => (
                                            <div
                                              key={idx}
                                              className="p-3 bg-gray-50 rounded-lg border border-appleGreen hover:bg-fadeBrown transition-colors"
                                            >
                                              <p className="text-sm font-medium text-brown">{insight.title}</p>
                                              <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                                              <p className="text-sm text-appleGreen mt-1 flex items-center">
                                                <FiCheckCircle className="mr-2" />
                                                Action: {insight.action}
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-600">No insights generated for this premium.</p>
                                    )
                                  ) : (
                                    <div className="flex items-center text-red-500">
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
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-yellowGreen text-white rounded-lg font-semibold hover:bg-appleGreen hover:scale-105 transition-all duration-200"
                    >
                      <FiDownload className="inline mr-2" />
                      Download Results
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