import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { FaLock, FaMailBulk, FaExclamationCircle } from 'react-icons/fa';
import { MdArrowBack } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from '../../Resources/Loading';
import toast from 'react-hot-toast';
import axios from 'axios';
import { backendUrl } from '../../App';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.password.length < 8) newErrors.password = 'Minimum 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields.', {
        style: { background: '#FECACA', color: '#7F1D1D', borderRadius: '8px' },
      });
      return;
    }
    if (!validateForm()) {
      toast.error('Please fix the form errors.', {
        style: { background: '#FECACA', color: '#7F1D1D', borderRadius: '8px' },
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, formData);
      if (response.data.success) {
        const user = response.data.user;
        if (user.role.toLowerCase() === 'admin') {
            toast.success('Admin login successful!', {
                style: { background: '#A3E635', color: '#4A2C2A', borderRadius: '8px' },
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));;
            navigate('/');
        } else{
            toast.error('You are not authorized to access this page.', {
                style: { background: '#FECACA', color: '#7F1D1D', borderRadius: '8px' },
            });
            return;
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || 'An error occurred while logging in.', {
        style: { background: '#FECACA', color: '#7F1D1D', borderRadius: '8px' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    toast.info('Google Sign-In is coming soon!', {
      style: { background: '#FECACA', color: '#7F1D1D', borderRadius: '8px' },
      });
    };

  const fieldGuidance = {
    email: 'Use the email associated with your admin account.',
    password: 'Enter your admin password to securely log in.',
  };

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full bg-gradient-to-br from-white to-appleGreen/10 flex items-center justify-center p-0 md:p-4 relative overflow-hidden"
    >
      {/* Background Shapes */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-0 w-1/4 h-1/4 bg-yellowGreen rounded-full blur-xl -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-brown rounded-full blur-xl -z-10"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
        className="w-full md:max-w-3xl bg-white min-h-screen md:min-h-fit p-4 md:rounded-xl shadow-md border border-appleGreen"
      >
        {/* Form Section */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full p-6 flex items-center justify-center"
        >
          <form className="w-full" onSubmit={handleSubmit}>
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-3 mb-2"
            >
              <Link to="/">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1 bg-brown/10 rounded-full"
                >
                  <MdArrowBack size={20} className="text-brown" />
                </motion.div>
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-brown">Admin Login</h1>
              </div>
            </motion.div>

            <p className="text-xs md:text-sm text-gray-600 mt-1 mb-6">
              Log in to access the admin panel and manage your platform.
            </p>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 gap-4">
              {/* Email */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                <label htmlFor="email" className="block text-xs font-medium text-brown mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-1">{fieldGuidance.email}</p>
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#AAC624' }}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full h-10 border-2 ${errors.email ? 'border-red-400' : 'border-appleGreen'} rounded-lg text-sm text-brown bg-white px-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200`}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-2xs mt-1 flex items-center gap-1"
                    >
                      <FaExclamationCircle size={12} /> {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <label htmlFor="password" className="block text-xs font-medium text-brown mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-1">{fieldGuidance.password}</p>
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#AAC624' }}
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full h-10 border-2 ${errors.password ? 'border-red-400' : 'border-appleGreen'} rounded-lg text-sm text-brown bg-white px-2 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200`}
                />
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-2xs mt-1 flex items-center gap-1"
                    >
                      <FaExclamationCircle size={12} /> {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="flex justify-end mt-3"
            >
              <Link to="/reset-email" className="text-xs text-yellowGreen font-semibold hover:underline">
                Forgot Password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.0 }}
              className="mt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(124, 179, 42, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full h-10 bg-gradient-to-r from-yellowGreen to-appleGreen text-brown font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-sm"
              >
                Log In
              </motion.button>
            </motion.div>

            {/* Divider */}
            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.1 }}
              className="flex items-center my-4"
            >
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="mx-3 text-xs text-gray-500 font-medium">Or</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </motion.div> */}

            {/* Google Sign-In */}
            {/* <motion.div
              initialdig={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(79, 57, 26, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoogleSignUp}
                className="w-full h-10 bg-white text-brown font-semibold rounded-lg border-2 border-brown flex items-center justify-center gap-2 hover:bg-brown hover:text-white transition-all duration-300 text-sm"
              >
                <FcGoogle size={16} /> Continue with Google
              </motion.button>
            </motion.div> */}

            {/* Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.3 }}
              className="text-center mt-4 space-y-2"
            >
              <p className="text-xs text-gray-600">
                Don’t have an admin account?{' '}
                <Link to="/" className="text-yellowGreen font-semibold hover:underline">
                  Contact Support
                </Link>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;