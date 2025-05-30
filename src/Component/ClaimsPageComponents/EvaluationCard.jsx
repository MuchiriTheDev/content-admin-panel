// src/components/claims/EvaluationCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiCopy, FiDownload } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

const EvaluationCard = ({ evaluation }) => {
  const getStatusBadge = (isValid) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
        isValid ? 'bg-appleGreen text-brown' : 'bg-red-200 text-red-900'
      } hover:bg-opacity-80 transition-colors`}
    >
      {isValid ? 'Valid' : 'Invalid'}
    </span>
  );

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
      doc.text('Claim Evaluation', 15, 15);
      doc.setFontSize(10);
      let yOffset = 25;

      if (aiAnalysis) {
        doc.text(`AI Analysis`, 15, yOffset);
        yOffset += 8;
        doc.text(`Status: ${aiAnalysis.isValid ? 'Valid' : 'Invalid'}`, 15, yOffset);
        yOffset += 8;
        doc.text(`Confidence: ${aiAnalysis.confidenceScore}%`, 15, yOffset);
        yOffset += 8;
        doc.text('Reasons:', 15, yOffset);
        yOffset += 8;
        aiAnalysis.reasons.forEach((reason) => {
          doc.text(`- ${reason}`, 20, yOffset, { maxWidth: 170 });
          yOffset += 8;
        });
        doc.text(`Evaluated: ${aiAnalysis.createdAt || 'Unknown date'}`, 15, yOffset);
        yOffset += 10;
      }

      if (manualReview) {
        doc.text(`Manual Review`, 15, yOffset);
        yOffset += 8;
        doc.text(`Status: ${manualReview.isValid ? 'Valid' : 'Invalid'}`, 15, yOffset);
        yOffset += 8;
        doc.text(`Notes: ${manualReview.notes}`, 15, yOffset, { maxWidth: 170 });
        yOffset += 8;
        doc.text(`Reviewed: ${manualReview.reviewedAt || 'Unknown date'}`, 15, yOffset);
        yOffset += 10;
      }

      doc.text(`Payout: ${payoutAmount ? `${payoutAmount.toFixed(2)} KES` : 'N/A'}`, 15, yOffset);

      doc.save(`CCI_Evaluation.pdf`);
      toast.success('Evaluation downloaded', {
        style: { background: '#A3E635', color: '#4A2C2A' },
      });
    } catch (err) {
      toast.error('Failed to generate PDF', {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  if (!evaluation || (!evaluation.aiAnalysis && !evaluation.manualReview && !evaluation.payoutAmount)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm border border-appleGreen"
      >
        <h2 className="text-base font-semibold text-brown mb-2 flex items-center">
          <FiCheckCircle className="mr-1 h-4 w-4" /> Evaluation
        </h2>
        <p className="text-sm text-gray-600 flex items-center">
          <FiXCircle className="mr-1 h-4 w-4" /> No evaluation available.
        </p>
      </motion.div>
    );
  }

  const {
    aiAnalysis = null,
    manualReview = null,
    payoutAmount = null,
  } = evaluation;

  const formattedAmount = payoutAmount ? `${payoutAmount.toFixed(2)} KES` : 'N/A';
  const aiCreatedAt = aiAnalysis?.createdAt
    ? new Date(aiAnalysis.createdAt).toLocaleString()
    : 'N/A';
  const manualReviewedAt = manualReview?.reviewedAt
    ? new Date(manualReview.reviewedAt).toLocaleString()
    : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-appleGreen"
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-brown flex items-center">
          <FiCheckCircle className="mr-1 h-4 w-4" /> Evaluation
        </h2>
        <button
          onClick={handleDownload}
          className="px-3 py-1.5 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-md text-xs font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
        >
          <FiDownload className="mr-1 h-4 w-4 inline" /> PDF
        </button>
      </div>
      <div className="space-y-3">
        {aiAnalysis && (
          <div>
            <p className="text-xs text-gray-500 font-medium">AI Analysis</p>
            <div className="mt-1 flex items-center space-x-1">
              {getStatusBadge(aiAnalysis.isValid)}
              <button
                onClick={() => handleCopy(aiAnalysis.reasons.join('; '), 'AI Reasons')}
                className="p-0.5 text-brown hover:text-appleGreen transition-colors"
              >
                <FiCopy className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-brown font-medium mt-0.5">
              Confidence: {aiAnalysis.confidenceScore || 'N/A'}%
            </p>
            <ul className="list-disc list-inside text-xs text-gray-600 mt-0.5">
              {(aiAnalysis.reasons || []).map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
            <p className="text-xs text-gray-600 mt-0.5">Evaluated: {aiCreatedAt}</p>
          </div>
        )}
        {manualReview && (
          <div>
            <p className="text-xs text-gray-500 font-medium">Manual Review</p>
            <div className="mt-1 flex items-center space-x-1">
              {getStatusBadge(manualReview.isValid)}
              <button
                onClick={() => handleCopy(manualReview.notes, 'Manual Notes')}
                className="p-0.5 text-brown hover:text-appleGreen transition-colors"
              >
                <FiCopy className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-brown font-medium mt-0.5">
              Notes: {manualReview.notes || 'N/A'}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">Reviewed: {manualReviewedAt}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 font-medium">Payout Amount</p>
          <p className="text-sm text-brown font-medium">{formattedAmount}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EvaluationCard;