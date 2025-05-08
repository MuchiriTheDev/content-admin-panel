import React, { Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationCircle, FaHome, FaRedo } from 'react-icons/fa';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-h-screen w-full bg-gradient-to-br from-white to-appleGreen/10 flex items-center justify-center p-4 md:p-6 relative overflow-hidden"
        >
          {/* Background Shapes */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-0 w-1/3 h-1/3 bg-yellowGreen rounded-full blur-sm -z-10"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-brown rounded-full blur-sm -z-10"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
            className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-appleGreen p-10 text-center"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-6 w-16 h-16 bg-brown rounded-full flex items-center justify-center"
            >
              <FaExclamationCircle className="w-10 h-10 text-yellowGreen" />
            </motion.div>

            {/* Error Message */}
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold text-appleGreen mb-4"
            >
              Oops, Something Went Wrong
            </motion.h1>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-brown text-sm md:text-base mb-6"
            >
              We encountered an unexpected issue. Our team has been notified, and
              we're working to fix it. Please try again or return to the home page.
            </motion.p>

            {/* Error Details (for developers) */}
            {process.env.NODE_ENV === 'development' && (
              <motion.details
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-left text-sm text-brown mb-6"
              >
                <summary className="cursor-pointer font-semibold text-yellowGreen hover:underline">
                  Error Details
                </summary>
                <pre className="mt-2 p-4 bg-brown/10 rounded-lg overflow-auto text-brown text-xs">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo?.componentStack}
                </pre>
              </motion.details>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(124, 179, 42, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleReload}
                className="px-6 py-3 bg-gradient-to-r from-yellowGreen to-appleGreen text-brown font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <FaRedo size={16} /> Reload Page
              </motion.button>
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(79, 57, 26, 0.2)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-brown text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <FaHome size={16} /> Go to Home
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;