// src/components/claims/StatusHistoryTable.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { RiFileHistoryFill } from 'react-icons/ri';
import moment from 'moment';

const StatusHistoryTable = ({ history }) => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl overflow-hidden shadow-md p-6 border border-appleGreen"
    >
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center justify-between w-full text-xl font-semibold text-brown mb-6"
      >
        <span className="flex items-center">
          <RiFileHistoryFill className="mr-2" />
          Status History
        </span>
        {showHistory ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-appleGreen/50 scrollbar-track-gray-100">
              <table className="w-full min-w-[800px] text-left table-auto">
                <thead>
                  <tr className="text-xs md:text-sm text-gray-500 bg-gray-50 sticky top-0 z-10">
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Notes</th>
                    <th className="p-4 font-medium">Updated By</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                      className="border-t border-gray-100 hover:bg-appleGreen/10"
                    >
                      <td className="p-4 text-xs md:text-sm text-brown">{entry.status}</td>
                      <td className="p-4 text-xs md:text-sm text-brown">
                        {moment(entry.date).format('MMM D, YYYY, h:mm A')}
                      </td>
                      <td className="p-4 text-xs md:text-sm text-brown">{entry.notes || 'N/A'}</td>
                      <td className="p-4 text-xs md:text-sm text-brown">{entry.updatedBy.slice(-6)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
              Scroll left or right to view more
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StatusHistoryTable;