import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaBell, FaSignOutAlt, FaHome, FaFileAlt } from 'react-icons/fa';
import { MdArrowBack, MdOutlineSimCardDownload } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';
import { IoMdCard } from 'react-icons/io';
import { useState } from 'react';

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

  return (
    <div className="w-full min-h-screen bg-gray-100 text-brown flex flex-col overflow-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full bg-white p-4 flex items-center justify-between z-20"
      >
        <div className="flex items-center gap-3">
          {!isLargeScreen && (
            <button
              className="p-2 text-brown hover:bg-yellowGreen/20 rounded-full"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <FaBars size={24} />
            </button>
          )}
          <Link to="/" className="py-2 hidden md:block hover:bg-yellowGreen/20 rounded-full">
            <MdArrowBack size={24} className="text-brown" />
          </Link>
          <Link to="/">
            <img src={assets.logo_brown} alt="CCI Logo" className="h-16 w-fit rounded-full" />
          </Link>
        </div>
        <h1>Admin Panel</h1>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-appleGreen text-white rounded-full shadow-md hover:bg-yellowGreen"
            aria-label="Notifications"
          >
            <FaBell size={18} />
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
          className={`fixed top-0 left-0 w-64 bg-white p-6 flex flex-col justify-between h-screen z-30 ${
            isLargeScreen ? 'md:z-10' : 'z-40'
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-6 mt-16">
              {!isLargeScreen && (
                <button
                  className="p-2 text-brown hover:bg-yellowGreen/20 rounded-full"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <FaTimes size={24} />
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {[
                { id: '/', label: 'Home', icon: <FaHome /> },
                { id: '/contracts', label: 'Contracts', icon: <FaFileAlt />  },
                { id: '/premiums', label: 'Premiums', icon: <IoMdCard />  },
                { id: '/claims', label: 'Claims', icon: <MdOutlineSimCardDownload />  },
              ].map((item) => (
                <li key={item.id}>
                  <Link to={item.id}
                     className={`w-full text-left py-3 px-4 rounded-lg flex items-center gap-3 font-medium transition-colors ${
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
            className="w-full py-3 bg-gradient-to-r from-yellowGreen to-appleGreen rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </motion.aside>
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 ml-0 md:ml-64 mt-20 p-6 overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl border border-appleGreen shadow-md">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default PageAbsorber;