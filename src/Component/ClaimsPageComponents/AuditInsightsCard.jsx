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
      doc.setFontSize(14);
      doc.text(`Audit Insights (ID: ${claimId.slice(-6)})`, 15, 15);
      doc.setFontSize(10);
      let yOffset = 25;

      insights.forEach((insight, index) => {
        const title = insight.title || 'Untitled Insight';
        const description = insight.description || 'No description';
        const action = insight.action || 'No action';
        const createdAt = insight.createdAt
          ? new Date(insight.createdAt).toLocaleString()
          : 'Unknown date';

        doc.text(`Insight ${index + 1}: ${title}`, 15, yOffset);
        yOffset += 8;
        doc.text(`Description: ${description}`, 15, yOffset, { maxWidth: 170 });
        yOffset += 8;
        doc.text(`Action: ${action}`, 15, yOffset);
        yOffset += 8;
        doc.text(`Date: ${createdAt}`, 15, yOffset);
        yOffset += 10;
      });

      doc.save(`CCI_Claim_${claimId.slice(-6)}_Audit.pdf`);
      toast.success('Insights downloaded', {
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
        className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm border border-appleGreen"
      >
        <h2 className="text-base font-semibold text-brown mb-2 flex items-center">
          <FiAlertTriangle className="mr-1 h-4 w-4" /> Audit Insights
        </h2>
        <p className="text-sm text-gray-600 flex items-center">
          <FiAlertTriangle className="mr-1 h-4 w-4" /> No insights available.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-appleGreen"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-brown flex items-center">
          <FiAlertTriangle className="mr-1 h-4 w-4" /> Audit Insights
        </h2>
        <button
          onClick={handleDownload}
          className="px-3 py-1.5 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-md text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
        >
          <FiDownload className="mr-1 h-4 w-4 inline" /> PDF
        </button>
      </div>
      <div className="space-y-2">
        {insights.map((insight, index) => {
          const title = insight.title || 'Untitled Insight';
          const description = insight.description || 'No description';
          const action = insight.action || 'No action';
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
              className="bg-white rounded-md shadow-sm border border-appleGreen"
            >
              <div
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 cursor-pointer hover:bg-appleGreen/10 transition-colors"
                onClick={() => toggleExpand(index)}
              >
                <div className="mb-1 sm:mb-0">
                  <p className="text-brown font-semibold text-sm">{title}</p>
                  <p className="text-xs text-gray-600">ID: {claimId.slice(-6)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {expandedInsight === index ? (
                    <FiChevronUp className="text-brown h-4 w-4" />
                  ) : (
                    <FiChevronDown className="text-brown h-4 w-4" />
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
                    className="p-2 border-t border-gray-200"
                  >
                    <div className="space-y-1">
                      <div className="p-2 bg-gray-50 rounded-md border border-appleGreen hover:bg-appleGreen/10 transition-colors">
                        <p className="text-sm font-medium text-brown">{title}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
                        <p className={`text-xs mt-0.5 flex items-center ${actionColor} bg-fadeBrown/50 p-1.5 rounded-md`}>
                          <FiCheckCircle className="mr-1 h-4 w-4" />
                          Action: {action}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">Date: {createdAt}</p>
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