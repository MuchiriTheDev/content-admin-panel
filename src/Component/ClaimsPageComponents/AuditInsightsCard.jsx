// src/components/claims/AuditInsightsCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const AuditInsightsCard = ({ insights, context = 'claim', items = [] }) => {
  const [expandedInsight, setExpandedInsight] = useState(null);

  // Toggle expandable insights
  const toggleExpand = (index) => {
    setExpandedInsight(expandedInsight === index ? null : index);
  };

  // Determine item ID and metadata based on context
  const getItemMetadata = (insight) => {
    if (context === 'premium') {
      const premium = items.find((p) => p._id === insight.premiumId);
      return {
        id: insight.premiumId?.slice(-6) || 'N/A',
        label: premium?.premiumDetails?.userId?.personalInfo?.email || 'N/A',
        details: [
          {
            label: 'Amount',
            value: premium?.premiumDetails?.finalAmount
              ? `KES ${premium.premiumDetails.finalAmount.toFixed(2)}`
              : 'N/A',
          },
          {
            label: 'Percentage',
            value: premium?.premiumDetails?.finalPercentage
              ? `${premium.premiumDetails.finalPercentage}%`
              : 'N/A',
          },
        ],
      };
    }
    return {
      id: insight.claimId?.slice(-6) || insight.title.match(/Claim ID: (\w+)/)?.[1] || 'N/A',
      label: `Claim ID: ${insight.claimId?.slice(-6) || insight.title.match(/Claim ID: (\w+)/)?.[1] || 'N/A'}`,
      details: [],
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
    >
      <h2 className="text-xl font-semibold text-brown mb-4 flex items-center">
        <FiAlertTriangle className="mr-2" />
        {context === 'premium' ? 'Premium Audit Insights' : 'Claim Audit Insights'}
      </h2>
      {insights.length === 0 ? (
        <p className="text-gray-600">No audit insights available.</p>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const metadata = getItemMetadata(insight);
            return (
              <motion.div
                key={`${metadata.id}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md border border-appleGreen"
              >
                <div
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 cursor-pointer hover:bg-fadeBrown transition-colors"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="text-brown font-semibold text-sm sm:text-base">{insight.title}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{metadata.label}</p>
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
                          <p className="text-sm sm:text-base font-medium text-brown">{insight.title}</p>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">{insight.description}</p>
                          <p className="text-xs sm:text-sm text-appleGreen mt-1 flex items-center">
                            <FiCheckCircle className="mr-2" />
                            Action: {insight.action}
                          </p>
                        </div>
                        {metadata.details.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-brown">Additional Details</p>
                            {metadata.details.map((detail, idx) => (
                              <p key={idx} className="text-xs sm:text-sm text-gray-600">
                                <span className="font-medium">{detail.label}:</span> {detail.value}
                              </p>
                            ))}
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
      )}
    </motion.div>
  );
};

export default AuditInsightsCard;