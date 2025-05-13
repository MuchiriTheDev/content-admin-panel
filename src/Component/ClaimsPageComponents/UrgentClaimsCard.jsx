// src/components/claims/UrgentClaimsCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import moment from 'moment';

const UrgentClaimsCard = ({ claims }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md p-6 border border-appleGreen"
    >
      <h2 className="text-xl font-semibold text-brown mb-4 flex items-center">
        <FiAlertCircle className="mr-2" /> Urgent Claims
      </h2>
      {claims.length === 0 ? (
        <p className="text-gray-600">No urgent claims at this time.</p>
      ) : (
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-appleGreen/50 scrollbar-track-gray-100">
          <table className="w-full min-w-[600px] text-left table-auto">
            <thead>
              <tr className="text-xs md:text-sm text-gray-500 bg-gray-50">
                <th className="p-4 font-medium">Claim ID</th>
                <th className="p-4 font-medium">Platform</th>
                <th className="p-4 font-medium">Deadline</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim, index) => (
                <motion.tr
                  key={claim._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="border-t border-gray-100 hover:bg-appleGreen/10"
                >
                  <td className="p-4 text-xs md:text-sm text-brown">{claim._id.slice(-6)}</td>
                  <td className="p-4 text-xs md:text-sm text-brown">{claim.claimDetails.platform}</td>
                  <td className="p-4 text-xs md:text-sm text-brown">
                    {moment(claim.resolutionDeadline).format('MMM D, YYYY, h:mm A')}
                  </td>
                  <td className="p-4">
                    <Link to={`/claims/${claim._id}`} className="text-brown hover:underline">
                      Review
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default UrgentClaimsCard;