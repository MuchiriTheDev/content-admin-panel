// src/components/claims/StatusHistoryTable.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiChevronDown, FiChevronUp, FiCopy, FiDownload } from 'react-icons/fi';
import { RiFileHistoryFill } from 'react-icons/ri';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

const StatusHistoryTable = ({ history, claimId }) => {
  const [showHistory, setShowHistory] = useState(false);

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

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text(`Claim History (ID: ${claimId.slice(-6)})`, 15, 15);
      doc.setFontSize(10);
      let yOffset = 25;

      history.forEach((entry, index) => {
        const status = entry.status || 'N/A';
        const date = entry.date ? new Date(entry.date).toLocaleString() : 'N/A';
        const notes = entry.notes || 'N/A';
        const updatedBy = entry.updatedBy ? entry.updatedBy.slice(-6) : 'N/A';
        const entryId = entry._id ? entry._id.slice(-6) : 'N/A';

        doc.text(`Entry ${index + 1}`, 15, yOffset);
        yOffset += 8;
        doc.text(`Status: ${status}`, 20, yOffset);
        yOffset += 8;
        doc.text(`Date: ${date}`, 20, yOffset);
        yOffset += 8;
        doc.text(`Notes: ${notes}`, 20, yOffset, { maxWidth: 170 });
        yOffset += 8;
        doc.text(`Updated By: ${updatedBy}`, 20, yOffset);
        yOffset += 8;
        doc.text(`Entry ID: ${entryId}`, 20, yOffset);
        yOffset += 10;
      });

      doc.save(`CCI_Claim_${claimId.slice(-6)}_History.pdf`);
      toast.success('History downloaded as PDF', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
    } catch (err) {
      toast.error('Failed to generate PDF', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  const handleDownloadCSV = () => {
    try {
      const headers = ['Status', 'Date', 'Notes', 'Updated By', 'Entry ID'];
      const rows = history.map((entry) => [
        entry.status || 'N/A',
        entry.date ? new Date(entry.date).toLocaleString() : 'N/A',
        `"${entry.notes || 'N/A'}"`,
        entry.updatedBy ? entry.updatedBy.slice(-6) : 'N/A',
        entry._id ? entry._id.slice(-6) : 'N/A',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `CCI_Claim_${claimId.slice(-6)}_History.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('History downloaded as CSV', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
    } catch (err) {
      toast.error('Failed to generate CSV', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  if (!Array.isArray(history) || history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm border border-appleGreen"
      >
        <h2 className="text-base font-semibold text-brown mb-2 flex items-center">
          <RiFileHistoryFill className="mr-1 h-4 w-4" /> Status History
        </h2>
        <p className="text-gray-600 text-sm flex items-center">
          <FiAlertCircle className="mr-1 h-4 w-4" /> No history available.
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
          <RiFileHistoryFill className="mr-1 h-4 w-4" /> Status History
        </h2>
        <div className="flex space-x-1">
          <button
            onClick={handleDownloadPDF}
            className="px-3 py-1.5 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-md text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          >
            <FiDownload className="mr-1 h-4 w-4 inline" /> PDF
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-3 py-1.5 bg-yellowGreen text-brown rounded-md text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
          >
            <FiDownload className="mr-1 h-4 w-4 inline" /> CSV
          </button>
        </div>
      </div>
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center justify-between w-full text-sm font-semibold text-brown mb-4 bg-appleGreen/10 p-2 rounded-md hover:bg-appleGreen/20 transition-colors"
      >
        <span className="flex items-center">
          <RiFileHistoryFill className="mr-1 h-4 w-4" />
          {showHistory ? 'Hide History' : 'Show History'}
        </span>
        {showHistory ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
      </button>
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-appleGreen/50 scrollbar-track-gray-100">
              <table className="w-full min-w-[600px] text-left table-auto">
                <thead>
                  <tr className="text-xs text-gray-500 bg-appleGreen/10 sticky top-0 z-10">
                    <th className="p-2 font-medium">Status</th>
                    <th className="p-2 font-medium">Date</th>
                    <th className="p-2 font-medium">Notes</th>
                    <th className="p-2 font-medium">Updated By</th>
                    <th className="p-2 font-medium">Entry ID</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => {
                    const statusColor =
                      entry.status?.toLowerCase() === 'approved'
                        ? 'text-appleGreen'
                        : entry.status?.toLowerCase() === 'pending'
                        ? 'text-yellowGreen'
                        : entry.status?.toLowerCase() === 'submitted'
                        ? 'text-blue-600'
                        : entry.status?.toLowerCase() === 'ai reviewed'
                        ? 'text-purple-600'
                        : 'text-brown';

                    return (
                      <motion.tr
                        key={entry._id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="border-t border-gray-100 hover:bg-appleGreen/10"
                      >
                        <td className={`p-2 text-sm ${statusColor}`}>
                          {entry.status || 'N/A'}
                        </td>
                        <td className="p-2 text-sm text-brown">
                          {entry.date ? new Date(entry.date).toLocaleString() : 'N/A'}
                        </td>
                        <td className="p-2 text-sm text-brown flex items-center space-x-1">
                          <span className="truncate max-w-[200px]">{entry.notes || 'N/A'}</span>
                          <button
                            onClick={() => handleCopy(entry.notes, 'Notes')}
                            className="p-0.5 text-brown hover:text-appleGreen transition-colors"
                          >
                            <FiCopy className="h-4 w-4" />
                          </button>
                        </td>
                        <td className="p-2 text-sm text-brown flex items-center space-x-1">
                          <span>{entry.updatedBy ? entry.updatedBy.slice(-6) : 'N/A'}</span>
                          {entry.updatedBy && (
                            <button
                              onClick={() => handleCopy(entry.updatedBy, 'Updated By')}
                              className="p-0.5 text-brown hover:text-appleGreen transition-colors"
                            >
                              <FiCopy className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                        <td className="p-2 text-sm text-brown">
                          {entry._id ? entry._id.slice(-6) : 'N/A'}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="text-center text-xs text-gray-500 mt-1">
              Scroll to view more
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StatusHistoryTable;