// src/components/claims/EvaluationCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiCopy, FiDownload } from 'react-icons/fi';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

const EvaluationCard = ({ evaluation }) => {
  const getStatusBadge = (isValid) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
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
          toast.success(`${label} copied to clipboard`, {
            style: { background: '#A3E635', color: '#4A2C2A' },
          });
        })
        .catch(() => {
          toast.error(`Failed to copy ${label}`, {
            style: { background: '#FECACA', color: '#7F1D1D' },
          });
        });
    } else {
      toast.error(`No ${label} available to copy`, {
        style: { background: '#FECACA', color: '#7F1D1D' },
      });
    }
  };

  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Claim Evaluation', 20, 20);
      doc.setFontSize(12);
      let yOffset = 30;

      if (aiAnalysis) {
        doc.text(`AI Analysis`, 20, yOffset);
        yOffset += 10;
        doc.text(`Status: ${aiAnalysis.isValid ? 'Valid' : 'Invalid'}`, 20, yOffset);
        yOffset += 10;
        doc.text(`Confidence: ${aiAnalysis.confidenceScore}%`, 20, yOffset);
        yOffset += 10;
        doc.text('Reasons:', 20, yOffset);
        yOffset += 10;
        aiAnalysis.reasons.forEach((reason) => {
          doc.text(`- ${reason}`, 25, yOffset, { maxWidth: 160 });
          yOffset += 10;
        });
        doc.text(`Evaluated: ${aiAnalysis.createdAt || 'Unknown date'}`, 20, yOffset);
        yOffset += 15;
      }

      if (manualReview) {
        doc.text(`Manual Review`, 20, yOffset);
        yOffset += 10;
        doc.text(`Status: ${manualReview.isValid ? 'Valid' : 'Invalid'}`, 20, yOffset);
        yOffset += 10;
        doc.text(`Notes: ${manualReview.notes}`, 20, yOffset, { maxWidth: 160 });
        yOffset += 10;
        doc.text(`Reviewed: ${manualReview.reviewedAt || 'Unknown date'}`, 20, yOffset);
        yOffset += 15;
      }

      doc.text(`Payout Amount: ${payoutAmount ? `${payoutAmount.toFixed(2)} KES` : 'N/A'}`, 20, yOffset);

      doc.save(`CCI_Claim_Evaluation.pdf`);
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
        className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-appleGreen"
      >
        <h2 className="text-xl font-semibold text-brown mb-4 flex items-center">
          <FiCheckCircle className="mr-2" /> Evaluation
        </h2>
        <p className="text-gray-600 flex items-center">
          <FiXCircle className="mr-2" /> No evaluation available.
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
      className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-brown flex items-center">
          <FiCheckCircle className="mr-2" /> Evaluation
        </h2>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-gradient-to-r from-brown to-fadeBrown text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <FiDownload className="mr-2 inline" /> Download PDF
        </button>
      </div>
      <div className="space-y-6">
        {aiAnalysis && (
          <div>
            <p className="text-sm text-gray-500 font-medium">AI Analysis</p>
            <div className="mt-2 flex items-center space-x-2">
              {getStatusBadge(aiAnalysis.isValid)}
              <button
                onClick={() => handleCopy(aiAnalysis.reasons.join('; '), 'AI Reasons')}
                className="p-1 text-brown hover:text-appleGreen transition-colors"
              >
                <FiCopy />
              </button>
            </div>
            <p className="text-base text-brown font-medium mt-1">
              Confidence: {aiAnalysis.confidenceScore || 'N/A'}%
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
              {(aiAnalysis.reasons || []).map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-600 mt-1">Evaluated: {aiCreatedAt}</p>
          </div>
        )}
        {manualReview && (
          <div>
            <p className="text-sm text-gray-500 font-medium">Manual Review</p>
            <div className="mt-2 flex items-center space-x-2">
              {getStatusBadge(manualReview.isValid)}
              <button
                onClick={() => handleCopy(manualReview.notes, 'Manual Notes')}
                className="p-1 text-brown hover:text-appleGreen transition-colors"
              >
                <FiCopy />
              </button>
            </div>
            <p className="text-base text-brown font-medium mt-1">
              Notes: {manualReview.notes || 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Reviewed: {manualReviewedAt}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-gray-500 font-medium">Payout Amount</p>
          <p className="text-base text-brown font-medium">{formattedAmount}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EvaluationCard;