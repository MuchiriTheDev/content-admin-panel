import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaBell, FaSignOutAlt, FaHome, FaFileAlt } from 'react-icons/fa';
import { MdArrowBack, MdOutlineSimCardDownload } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';
import { IoMdCard } from 'react-icons/io';

const PageAbsorber = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login to continue');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="w-full min-h-screen bg-gray-100 text-brown flex flex-col overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full bg-white p-3 flex items-center justify-between z-20"
      >
        <div className="flex items-center gap-2">
          {!isLargeScreen && (
            <button
              className="p-1 text-brown hover:bg-yellowGreen/20 rounded-full"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FaBars size={20} />
            </button>
          )}
          <Link to="/" className="p-1 hidden md:block hover:bg-yellowGreen/20 rounded-full">
            <MdArrowBack size={20} className="text-brown" />
          </Link>
          <Link to="/">
            <img src={assets.logo_brown} alt="CCI Logo" className="h-12 w-fit rounded-full" />
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-1 bg-appleGreen text-white rounded-full shadow-sm hover:bg-yellowGreen"
            aria-label="Notifications"
          >
            <FaBell size={16} />
          </motion.button>
        </div>
      </motion.nav>

      {/* Sidebar */}
      {(isSidebarOpen || isLargeScreen) && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 w-56 bg-white p-4 flex flex-col justify-between h-screen z-30 ${
            isLargeScreen ? 'md:z-10' : 'z-40'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-4 mt-12">
              {!isLargeScreen && (
                <div className="flex items-center justify-between w-full gap-2">
                  <h1 className="text-xl font-bold text-brown">Admin</h1>
                  <button
                    className="p-1 text-brown hover:bg-yellowGreen/20 rounded-full"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Close sidebar"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              )}
            </div>
            {isLargeScreen && (
              <h1 className="text-xl font-bold text-center text-brown mb-4">Admin Panel</h1>
            )}
            <ul className="space-y-1">
              {[
                { id: '/', label: 'Home', icon: <FaHome size={16} /> },
                { id: '/contracts', label: 'Contracts', icon: <FaFileAlt size={16} /> },
                { id: '/premiums', label: 'Premiums', icon: <IoMdCard size={16} /> },
                { id: '/claims', label: 'Claims', icon: <MdOutlineSimCardDownload size={16} /> },
              ].map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.id}
                    className={`w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                      window.location.pathname === item.id
                        ? 'bg-gradient-to-r from-yellowGreen to-appleGreen text-white'
                        : 'text-brown hover:bg-yellowGreen/10'
                    }`}
                    aria-label={`Switch to ${item.label}`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg text-sm font-medium text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <FaSignOutAlt size={16} /> Logout
          </motion.button>
        </motion.aside>
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 ml-0 md:ml-56 mt-16 p-4 overflow-y-auto"
      >
        <div className="max-w-6xl mx-auto bg-white p-4 rounded-xl border border-appleGreen shadow-sm">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default PageAbsorber;