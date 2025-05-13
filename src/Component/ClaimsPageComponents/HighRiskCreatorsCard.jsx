// src/components/claims/HighRiskCreatorsCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

const HighRiskCreatorsCard = ({ creators }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md p-6 border border-appleGreen"
    >
      <h2 className="text-xl font-semibold text-brown mb-4 flex items-center">
        <FiAlertTriangle className="mr-2" /> High-Risk Creators
      </h2>
      {creators.length === 0 ? (
        <p className="text-gray-600">No high-risk creators identified.</p>
      ) : (
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-appleGreen/50 scrollbar-track-gray-100">
          <table className="w-full min-w-[600px] text-left table-auto">
            <thead>
              <tr className="text-xs md:text-sm text-gray-500 bg-gray-50">
                <th className="p-4 font-medium">User ID</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Claims</th>
                <th className="p-4 font-medium">Rejected</th>
              </tr>
            </thead>
            <tbody>
              {creators.map((creator, index) => (
                <motion.tr
                  key={creator.userId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="border-t border-gray-100 hover:bg-appleGreen/10"
                >
                  <td className="p-4 text-xs md:text-sm text-brown">{creator.userId.slice(-6)}</td>
                  <td className="p-4 text-xs md:text-sm text-brown">{creator.email}</td>
                  <td className="p-4 text-xs md:text-sm text-brown">{creator.claimCount}</td>
                  <td className="p-4 text-xs md:text-sm text-brown">{creator.rejectedCount}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default HighRiskCreatorsCard;