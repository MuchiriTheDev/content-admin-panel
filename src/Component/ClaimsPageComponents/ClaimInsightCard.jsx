// src/components/claims/ClaimInsightCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiInfo } from 'react-icons/fi';

const ClaimInsightCard = ({ insight }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
    >
      <h3 className="text-lg font-semibold text-brown flex items-center">
        <FiInfo className="mr-2" /> {insight.title}
      </h3>
      <p className="text-gray-600 mt-2">{insight.description}</p>
      <p className="text-brown font-medium mt-2">Action: {insight.action}</p>
    </motion.div>
  );
};

export default ClaimInsightCard;