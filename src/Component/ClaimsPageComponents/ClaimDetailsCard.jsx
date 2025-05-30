// src/components/claims/ClaimDetailsCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiCopy, FiDownload, FiChevronDown, FiChevronUp, FiAlertCircle } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

const ClaimDetailsCard = ({ claim }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCopy = (text, label) => {
    if (text && text !== 'N/A') {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success(`${label} copied`, {
            style: { background: '#A3E635', color: '#4A2C2A' },
          });
        })
        .catch(() => {
          toast.error(`Failed to copy ${label}`, {
            style: { background: '#FECACA', color: '#7F1D1D' },
          });
        });
    } else {
      toast.error(`No ${label} to copy`, {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text(`Claim Details (ID: ${claim._id.slice(-6)})`, 15, 15);
      doc.setFontSize(10);
      let yOffset = 25;

      const details = [
        { label: 'Platform', value: platform },
        { label: 'Incident Type', value: incidentType },
        { label: 'Incident Date', value: formattedIncidentDate },
        { label: 'Reported Loss', value: formattedAmount },
        { label: 'User ID', value: userId },
        { label: 'Status', value: status },
        { label: 'Submitted', value: formattedSubmittedAt },
        { label: 'Platform Notification', value: platformNotification },
        { label: 'Incident Description', value: incidentDescription },
      ];

      details.forEach(({ label, value }) => {
        doc.text(`${label}: ${value}`, 15, yOffset, { maxWidth: 170 });
        yOffset += 8;
      });

      doc.save(`CCI_Claim_${claim._id.slice(-6)}_Details.pdf`);
      toast.success('Details downloaded', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
    } catch (err) {
      toast.error('Failed to generate PDF', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  if (!claim || !claim.claimDetails || Object.keys(claim.claimDetails).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm border border-appleGreen"
      >
        <h2 className="text-base font-semibold text-brown mb-2 flex items-center">
          <FiUser className="mr-1 h-4 w-4" /> Claim Details
        </h2>
        <p className="text-sm text-gray-600 flex items-center">
          <FiAlertCircle className="mr-1 h-4 w-4" /> No details available.
        </p>
      </motion.div>
    );
  }

  const {
    currency = 'N/A',
    incidentDate = 'N/A',
    incidentDescription = 'No description provided',
    incidentType = 'N/A',
    platform = 'N/A',
    platformNotification = 'N/A',
    reportedEarningsLoss = 'N/A',
    userId = 'N/A',
  } = claim.claimDetails;

  const status =
    claim.statusHistory?.history?.[claim.statusHistory.history.length - 1]?.status || 'N/A';
  const submittedAt = claim.createdAt || 'N/A';

  const formattedAmount =
    reportedEarningsLoss !== 'N/A' && currency !== 'N/A'
      ? `${currency} ${parseFloat(reportedEarningsLoss).toFixed(2)}`
      : 'N/A';
  const formattedIncidentDate =
    incidentDate !== 'N/A' ? new Date(incidentDate).toLocaleDateString() : 'N/A';
  const formattedSubmittedAt =
    submittedAt !== 'N/A' ? new Date(submittedAt).toLocaleDateString() : 'N/A';
  const statusColor =
    status.toLowerCase() === 'approved'
      ? 'text-appleGreen'
      : status.toLowerCase() === 'pending'
      ? 'text-yellowGreen'
      : status.toLowerCase() === 'rejected'
      ? 'text-red-600'
      : 'text-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-appleGreen"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-brown flex items-center">
          <FiUser className="mr-1 h-4 w-4" /> Claim Details
        </h2>
        <button
          onClick={handleDownload}
          className="px-3 py-1.5 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-md text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
        >
          <FiDownload className="mr-1 h-4 w-4 inline" /> PDF
        </button>
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <p className="text-xs text-gray-500 font-medium">Platform</p>
            <p className="text-sm text-brown">{platform}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Incident Type</p>
            <p className="text-sm text-brown">{incidentType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Incident Date</p>
            <p className="text-sm text-brown">{formattedIncidentDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Reported Loss</p>
            <p className="text-sm text-brown">{formattedAmount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">User ID</p>
            <div className="flex items-center space-x-1">
              <p className="text-sm text-brown">{userId.slice(-6)}</p>
              <button
                onClick={() => handleCopy(userId, 'User ID')}
                className="p-0.5 text-brown hover:text-appleGreen transition-colors"
              >
                <FiCopy className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Status</p>
            <p className={`text-sm font-medium ${statusColor}`}>{status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Submitted</p>
            <p className="text-sm text-brown">{formattedSubmittedAt}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Notification</p>
            <div className="flex items-center space-x-1">
              <p className="text-sm text-brown truncate max-w-[150px]">{platformNotification}</p>
              <button
                onClick={() => handleCopy(platformNotification, 'Platform Notification')}
                className="p-0.5 text-brown hover:text-appleGreen transition-colors"
              >
                <FiCopy className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div
          className="flex justify-between items-center p-2 cursor-pointer hover:bg-appleGreen/10 transition-colors rounded-md border border-gray-200"
          onClick={toggleExpand}
        >
          <p className="text-sm text-brown font-medium">Incident Description</p>
          {isExpanded ? (
            <FiChevronUp className="text-brown h-4 w-4" />
          ) : (
            <FiChevronDown className="text-brown h-4 w-4" />
          )}
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-2 border-t border-gray-200"
            >
              <p className="text-xs text-gray-600">{incidentDescription}</p>
              <button
                onClick={() => handleCopy(incidentDescription, 'Incident Description')}
                className="mt-1 p-0.5 text-brown hover:text-appleGreen transition-colors"
              >
                <FiCopy className="h-4 w-4 inline mr-1" /> Copy
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ClaimDetailsCard;