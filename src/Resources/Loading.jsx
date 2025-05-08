import React from 'react';
import { motion } from 'framer-motion';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Loading = () => {
  // Variants for the spinning icon
  const iconVariants = {
    spin: {
      rotate: [0, 360],
      transition: {
        repeat: Infinity,
        duration: 1,
        ease: 'linear',
      },
    },
  };

  // Variants for the text
  const textVariants = {
    pulse: {
      opacity: [0.7, 1, 0.7],
      y: [0, -5, 0],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut',
      },
    },
  };

  // Variants for the background circle
  const circleVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-brown">
  

      {/* Spinning Icon */}
      <motion.div
        className="relative text-8xl text-appleGreen"
        variants={iconVariants}
        animate="spin"
      >
        <AiOutlineLoading3Quarters />
      </motion.div>

      {/* Loading Text */}
      <motion.p
        className="mt-10 text-2xl font-medium text-black"
        variants={textVariants}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loading;