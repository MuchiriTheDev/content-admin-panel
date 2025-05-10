// src/components/common/InsightCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiInfo, FiCheckCircle, FiAlertTriangle, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { BsFillLightbulbFill } from 'react-icons/bs';

const InsightCard = ({ insight }) => {
  const priorityStyles = {
    high: { bg: 'bg-red-100', text: 'text-red-800', icon: <FiAlertTriangle className="mr-1" /> },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <FiAlertCircle className="mr-1" /> },
    low: { bg: 'bg-appleGreen/20', text: 'text-brown', icon: <FiCheck className="mr-1" /> },
  };

  const priority = insight.priority.toLowerCase();
  const priorityStyle = priorityStyles[priority] || {
    bg: 'bg-gray-200',
    text: 'text-gray-900',
    icon: null,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white border  rounded-lg shadow-xl hover:scale-[1.02] transition-all duration-300 p-4 md:p-5 flex flex-col gap-3  border-appleGreen/40"
    >
      {/* Title and Priority */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BsFillLightbulbFill className="text-2xl text-yellowGreen opacity-80" />
          <h3 className="text-base font-semibold text-brown">{insight.title}</h3>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}
        >
          {priorityStyle.icon}
          {insight.priority}
        </span>
      </div>

      {/* Description */}
      <div className="flex items-start gap-2">
        <FiInfo size={30} className="text-2xl text-appleGreen mt-0.5" />
        <p className="text-sm text-gray-600 ">{insight.description}</p>
      </div>

      {/* Action */}
      <div className="flex items-start p-3 bg-fadeBrown/40 rounded-sm gap-2">
        <FiCheckCircle size={30} className="text-2xl text-yellowGreen mt-0.5" />
        <p className="text-xs text-brown italic font-medium">{insight.action}</p>
      </div>
    </motion.div>
  );
};

export default InsightCard;