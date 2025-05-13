// src/components/claims/ClaimsKPICard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ClaimsKPICard = ({ title, value, icon, secondaryText, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-appleGreen"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm text-gray-500 flex items-center">
            {icon}
            {title}
          </p>
          <p className="text-2xl md:text-3xl font-bold text-brown mt-2">{value}</p>
          <p className="text-xs md:text-sm text-gray-600 mt-1">{secondaryText}</p>
        </div>
        <div className={`text-5xl text-${color} opacity-80`}>{icon}</div>
      </div>
    </motion.div>
  );
};

export default ClaimsKPICard;