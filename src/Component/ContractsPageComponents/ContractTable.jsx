// src/components/ContractsComponents/ContractTable.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ContractTable = ({ contracts }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-md p-6 border border-appleGreen"
    >
      <h2 className="text-xl font-semibold text-brown mb-4">Insurance Contracts</h2>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-appleGreen/50 scrollbar-track-gray-100">
        <table className="w-full min-w-[600px] text-left table-auto">
          <thead>
            <tr className="text-xs md:text-sm text-gray-500 bg-gray-50 sticky top-0 z-10">
              <th className="p-4 font-medium">User ID</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Platforms</th>
              <th className="p-4 font-medium">Claims</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract, index) => (
              <motion.tr
                key={contract.userId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="border-t border-gray-100 hover:bg-appleGreen/10 transition-all duration-200"
              >
                <td className="p-4 text-xs md:text-sm text-brown">
                  <Link to={`/contracts/${contract.userId}`} className="hover:underline">
                    {contract.userId.slice(-6)}
                  </Link>
                </td>
                <td className="p-4 text-xs md:text-sm text-brown">{contract.name}</td>
                <td className="p-4 text-xs md:text-sm text-brown">{contract.email}</td>
                <td className="p-4 text-xs md:text-sm text-brown">{contract.insuranceStatus.status}</td>
                <td className="p-4 text-xs md:text-sm text-brown">
                  {contract.platforms.map((p) => p.name).join(', ')}
                </td>
                <td className="p-4 text-xs md:text-sm text-brown">{contract.claimsCount}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ContractTable;