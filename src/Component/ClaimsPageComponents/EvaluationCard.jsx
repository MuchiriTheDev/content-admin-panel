// src/components/claims/EvaluationCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const EvaluationCard = ({ evaluation }) => {
  const getStatusBadge = (isValid) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
        isValid ? 'bg-appleGreen text-brown' : 'bg-red-200 text-red-900'
      }`}
    >
      {isValid ? 'Valid' : 'Invalid'}
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
    >
      <h2 className="text-xl font-semibold text-brown mb-4 flex items-center">
        <FiCheckCircle className="mr-2" /> Evaluation
      </h2>
      <div className="space-y-4">
        {evaluation.aiAnalysis && (
          <div>
            <p className="text-xs md:text-sm text-gray-500">AI Analysis</p>
            <div className="mt-2">{getStatusBadge(evaluation.aiAnalysis.isValid)}</div>
            <p className="text-brown font-medium mt-1">
              Confidence: {evaluation.aiAnalysis.confidenceScore}%
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-1">
              {evaluation.aiAnalysis.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        )}
        {evaluation.manualReview && (
          <div>
            <p className="text-xs md:text-sm text-gray-500">Manual Review</p>
            <div className="mt-2">{getStatusBadge(evaluation.manualReview.isValid)}</div>
            <p className="text-brown font-medium mt-1">Notes: {evaluation.manualReview.notes}</p>
          </div>
        )}
        <div>
          <p className="text-xs md:text-sm text-gray-500">Payout Amount</p>
          <p className="text-brown font-medium">
            {evaluation.payoutAmount ? `${evaluation.payoutAmount} KES` : 'N/A'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EvaluationCard;