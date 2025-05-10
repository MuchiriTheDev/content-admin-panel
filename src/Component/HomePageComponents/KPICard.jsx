// src/components/common/KPICard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, icon, secondaryText, color = 'appleGreen' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`bg-white border border-gray-200 rounded-lg shadow-lg shadow-appleGreen/30 hover:scale-[1.02] transition-all duration-300 p-4 md:p-5 flex flex-col gap-2 border-l-4 border-${color}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-2xl text-${color} opacity-80`}>{icon}</span>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
      </div>
      <p className="text-2xl font-bold text-brown truncate">{value}</p>
      {secondaryText && (
        <p className="text-xs text-gray-500 line-clamp-1">{secondaryText}</p>
      )}
    </motion.div>
  );
};

export default KPICard;