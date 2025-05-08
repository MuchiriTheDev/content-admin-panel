import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaBriefcase, FaMoneyCheckAlt } from 'react-icons/fa'; // Finance-themed icons

const Inpage404 = () => {
  // Define color palette for consistency
  const colors = {
    brown: '#4A3728',
    yellowGreen: '#A8D5BA',
    appleGreen: '#4CAF50',
    fadeBrown: '#3C2F23',
    gray200: '#E5E7EB',
    gray400: '#9CA3AF',
  };

  // Animation variants for the 404 text
  const numberVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  // Animation for icons with subtle hover effect
  const iconVariants = {
    hover: {
      scale: 1.15,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-brown to-fadeBrown text-gray-200 text-center px-4 py-12"
      style={{ background: `linear-gradient(to bottom, ${colors.brown}, ${colors.fadeBrown} 100%)` }}
    >
      {/* Container for Content */}
      <div className="max-w-2xl mx-auto">
        {/* 404 Text with Professional Styling */}
        <motion.div
          className="text-8xl md:text-9xl font-bold text-yellowGreen mb-6 tracking-tight"
          style={{
            textShadow: `0 2px 4px rgba(0, 0, 0, 0.2)`,
          }}
          initial="hidden"
          animate="visible"
          variants={numberVariants}
        >
          404
        </motion.div>

        {/* Title with Clean Typography */}
        <motion.h1
          className="text-3xl md:text-4xl font-semibold text-appleGreen mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Page Not Found
        </motion.h1>

        {/* Subtitle with Professional Tone */}
        <motion.p
          className="text-base md:text-lg text-gray-400 mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          The page you’re looking for is unavailable. It may have been moved or removed. Let us help you get back on track.
        </motion.p>

        {/* Finance-Themed Icons with Subtle Animation */}
        <motion.div
          className="flex gap-8 justify-center items-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div
            className="p-4 rounded-lg bg-brown/80 shadow-md hover:bg-brown/90"
            variants={iconVariants}
            whileHover="hover"
          >
            <FaChartLine size={40} className="text-yellowGreen" />
          </motion.div>
          <motion.div
            className="p-4 rounded-lg bg-brown/80 shadow-md hover:bg-brown/90"
            variants={iconVariants}
            whileHover="hover"
            transition={{ delay: 0.1 }}
          >
            <FaBriefcase size={40} className="text-appleGreen" />
          </motion.div>
          <motion.div
            className="p-4 rounded-lg bg-brown/80 shadow-md hover:bg-brown/90"
            variants={iconVariants}
            whileHover="hover"
            transition={{ delay: 0.2 }}
          >
            <FaMoneyCheckAlt size={40} className="text-yellowGreen" />
          </motion.div>
        </motion.div>

        {/* Call-to-Action Button with Professional Design */}
        <motion.a
          href="/"
          className="inline-block px-8 py-3 bg-yellowGreen text-brown rounded-md font-semibold shadow-lg hover:bg-appleGreen hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8 }}
        >
          Return to Homepage
        </motion.a>
      </div>
    </div>
  );
};

export default Inpage404;