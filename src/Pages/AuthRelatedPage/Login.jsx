import React, { useContext, useState } from 'react';
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
  const [ loading, setLoading ] = useState(false);
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
        toast.success('Login successful!', {
          style: { background: '#A3E635', color: '#4A2C2A', borderRadius: '8px' },
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');
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

  // Guidance messages inspired by SignUp and PlatformInformation
  const fieldGuidance = {
    email: 'Use the email associated with your admin account.',
    password: 'Enter your password to securely log in.',
  };

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen w-full bg-gradient-to-br from-white to-appleGreen/10 flex items-center justify-center p-0 md:p-6 relative overflow-hidden"
    >
      {/* Background Shapes */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-0 w-1/3 h-1/3 bg-yellowGreen rounded-full blur-xl -z-10"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-brown rounded-full blur-xl -z-10"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 120 }}
        className="w-full md:max-w-2xl bg-white min-h-screen md:min-h-fit rounded-2xl shadow-lg border border-appleGreen/20 "
      >
       
        {/* Form Section */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full p-10 flex items-center justify-center"
        >
          <form className="w-full" onSubmit={handleSubmit}>
            {/* Header */}
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4 mb-3"
            >
              <Link to="/">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-brown/10 rounded-full"
                >
                  <MdArrowBack size={24} className="text-brown" />
                </motion.div>
              </Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-brown">Welcome Back</h1>
              </div>
            </motion.div>

            <p className="text-sm md:text-base text-gray-600 mt-2 mb-8">
              Log in to continue your journey as a Content Creator.
            </p>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 gap-6">
              {/* Email */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label htmlFor="email" className="block text-sm font-medium text-brown mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">{fieldGuidance.email}</p>
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#AAC624' }}
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full h-12 border-2 ${errors.email ? 'border-red-400' : 'border-appleGreen'} rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200`}
                />
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <FaExclamationCircle /> {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <label htmlFor="password" className="block text-sm font-medium text-brown mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">{fieldGuidance.password}</p>
                <motion.input
                  whileFocus={{ scale: 1.02, borderColor: '#AAC624' }}
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full h-12 border-2 ${errors.password ? 'border-red-400' : 'border-appleGreen'} rounded-lg text-brown bg-white px-3 focus:ring-2 focus:ring-yellowGreen focus:outline-none transition-all duration-200`}
                />
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-1 flex items-center gap-1"
                    >
                      <FaExclamationCircle /> {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Forgot Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex justify-end mt-4"
            >
              <Link to="/reset-email" className="text-sm text-yellowGreen font-semibold hover:underline">
                Forgot Password?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(124, 179, 42, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-yellowGreen to-appleGreen text-brown font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Log In
              </motion.button>
            </motion.div>

            {/* Divider */}
            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="flex items-center my-6"
            >
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="mx-4 text-sm text-gray-500 font-medium">Or</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </motion.div> */}

            {/* Google Sign-In */}
            {/* <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 25px rgba(79, 57, 26, 0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoogleSignUp}
                className="w-full h-12 bg-white text-brown font-semibold rounded-lg border-2 border-brown flex items-center justify-center gap-3 hover:bg-brown hover:text-white transition-all duration-300"
              >
                <FcGoogle size={20} /> Continue with Google
              </motion.button>
            </motion.div> */}

            {/* Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="text-center mt-6 space-y-3"
            >
              <p className="text-sm text-gray-600">
                Don’t have an account?{' '}
                <Link to="/signup" className="text-yellowGreen font-semibold hover:underline">
                  Sign Up
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