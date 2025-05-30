// src/components/claims/AuditInsightsCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle, FiChevronDown, FiChevronUp, FiDownload } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

const AuditInsightsCard = ({ insights, claimId }) => {
  const [expandedInsight, setExpandedInsight] = useState(null);

  const toggleExpand = (index) => {
    setExpandedInsight(expandedInsight === index ? null : index);
  };

  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(`Claim Audit Insights (ID: ${claimId.slice(-6)})`, 20, 20);
      doc.setFontSize(12);
      let yOffset = 30;

      insights.forEach((insight, index) => {
        const title = insight.title || 'Untitled Insight';
        const description = insight.description || 'No description provided';
        const action = insight.action || 'No action specified';
        const createdAt = insight.createdAt
          ? new Date(insight.createdAt).toLocaleString()
          : 'Unknown date';

        doc.text(`Insight ${index + 1}: ${title}`, 20, yOffset);
        yOffset += 10;
        doc.text(`Description: ${description}`, 20, yOffset, { maxWidth: 170 });
        yOffset += 10;
        doc.text(`Action: ${action}`, 20, yOffset);
        yOffset += 10;
        doc.text(`Date: ${createdAt}`, 20, yOffset);
        yOffset += 15;
      });

      doc.save(`CCI_Claim_${claimId.slice(-6)}_Audit_Insights.pdf`);
      toast.success('Audit insights downloaded', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
    } catch (err) {
      toast.error('Failed to generate PDF', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  if (!Array.isArray(insights) || insights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-appleGreen"
      >
        <h2 className="text-xl font-semibold text-brown mb-4 flex items-center">
          <FiAlertTriangle className="mr-2" /> Claim Audit Insights
        </h2>
        <p className="text-gray-600 flex items-center">
          <FiAlertCircle className="mr-2" /> No audit insights available.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-brown flex items-center">
          <FiAlertTriangle className="mr-2" /> Claim Audit Insights
        </h2>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <FiDownload className="mr-2 inline" /> Download PDF
        </button>
      </div>
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const title = insight.title || 'Untitled Insight';
          const description = insight.description || 'No description provided';
          const action = insight.action || 'No action specified';
          const createdAt = insight.createdAt
            ? new Date(insight.createdAt).toLocaleString()
            : 'Unknown date';
          const actionColor = action.toLowerCase().includes('approve')
            ? 'text-appleGreen'
            : action.toLowerCase().includes('review')
            ? 'text-yellowGreen'
            : 'text-gray-600';

          return (
            <motion.div
              key={`${claimId}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md border border-appleGreen"
            >
              <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 cursor-pointer hover:bg-appleGreen/10 transition-colors"
                onClick={() => toggleExpand(index)}
              >
                <div className="mb-2 sm:mb-0">
                  <p className="text-brown font-semibold text-base">{title}</p>
                  <p className="text-sm text-gray-600">Claim ID: {claimId.slice(-6)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {expandedInsight === index ? (
                    <FiChevronUp className="text-brown" />
                  ) : (
                    <FiChevronDown className="text-brown" />
                  )}
                </div>
              </div>
              <AnimatePresence>
                {expandedInsight === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border-t border-gray-200"
                  >
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg border border-appleGreen hover:bg-appleGreen/10 transition-colors">
                        <p className="text-base font-medium text-brown">{title}</p>
                        <p className="text-sm text-gray-600 mt-1">{description}</p>
                        <p className={`text-sm mt-1 flex items-center ${actionColor} bg-fadeBrown p-3 rounded-md`} >
                          <FiCheckCircle className="mr-2" />
                          Action: {action}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AuditInsightsCard;