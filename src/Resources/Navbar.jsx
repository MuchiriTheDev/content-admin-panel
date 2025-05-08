import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { MdArrowLeft, MdClose, MdMenu } from 'react-icons/md';
import { FaHome, FaLongArrowAltUp, FaPhoneAlt, FaQuestion, FaRegUser, FaUser } from 'react-icons/fa';
import { GrServices } from 'react-icons/gr';
import { RiHotelLine } from 'react-icons/ri';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';

const Navbar = () => {
  const [sidebar, showSidebar] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const handleScroll = () => {
    setScrolling(window.scrollY > 100);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  }
  return (
    <nav className={`fixed top-0 left-0 max-w-[100vw] w-full z-30 h-fit p-6 md:px-8 flex justify-between items-center ${scrolling ? 'bg-white' : 'bg-transparent'} transition-all duration-300`}>
      {/* Logo */}
      <div className="flex justify-center items-center w-fit md:w-1/4 px-4">
        <img className="h-fit w-32 md:w-40" src={scrolling ? assets.logo2 : assets.logo1} alt="Making Sents Logo" />
      </div>

      {/* Nav items (Desktop) */}
      <div className="w-2/3 p-3 hidden md:flex justify-center items-center gap-2 lg:gap-6">
        <ScrollLink
          className={`lg:w-32 w-25 mx-1 md:mx-2 lg:mx-3 font-medium transition-all lg:text-sm text-xs duration-150 ${scrolling ? 'text-brown' : 'text-white'} hover:text-yellowGreen cursor-pointer `}
          to="how-to-apply" smooth={true} duration={500} offset={-100}
        >
          Application
        </ScrollLink>
        <ScrollLink
          className={`lg:w-32 w-25 mx-1 md:mx-2 lg:mx-3 font-medium transition-all lg:text-sm text-xs duration-150 ${scrolling ? 'text-brown' : 'text-white'} hover:text-yellowGreen  cursor-pointer`}
          to="about" smooth={true} duration={500} offset={-100}
        >
          Our Solutions
        </ScrollLink>
        <ScrollLink
          className={`lg:w-32 w-25 mx-1 md:mx-2 lg:mx-3 font-medium transition-all lg:text-sm text-xs duration-150 ${scrolling ? 'text-brown' : 'text-white'} hover:text-yellowGreen cursor-pointer `}
          to="services" smooth={true} duration={500} offset={-100}
        >
         Our Services
        </ScrollLink>
       
      </div>

      <div className='w-1/3 md:w-1/4 flex justify-center items-center gap-2'>
        {
          localStorage.getItem('token') ? (
            <RouterLink
            className="text-white font-semibold lg:text-sm text-xs py-2 px-3  rounded-lg shadow-md text-nowrap bg-appleGreen text-center cursor-pointer flex items-center gap-2 hover:bg-yellowGreen transition-all duration-150"
            to="/dashboard" smooth={true} duration={500} offset={-100}
          >
            Dashboard
          </RouterLink>
          ):(
            <RouterLink
              className="text-white font-semibold lg:text-sm text-xs py-3 px-2  rounded-lg shadow-md text-nowrap bg-appleGreen text-center cursor-pointer flex items-center gap-2 hover:bg-yellowGreen transition-all duration-150"
              to="/signup" smooth={true} duration={500} offset={-100}
            >
              <FaUser />
              Sign up
            </RouterLink>
          )
        }
        {/* Sidebar Toggle (Mobile) */}
        <button
          onClick={() => showSidebar(!sidebar)}
          className="md:hidden z-10 p-1"
          aria-label={sidebar ? 'Close menu' : 'Open menu'}
          aria-expanded={sidebar}
        >
          {sidebar ? (
            <MdClose className={`w-10 h-10 ${scrolling ? 'text-brown' : 'text-brown'}`} />
          ) : (
            <MdMenu className={`w-10 h-10 ${scrolling ? 'text-brown' : 'text-white'}`} />
          )}
        </button>
      </div>

     

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 ${sidebar ? 'right-0' : '-right-64'} flex flex-col items-center justify-between md:hidden p-5 transition-all duration-300 w-64 bg-white rounded-l-2xl border border-appleGreen h-full`}
      >
        <ScrollLink
          onClick={() => showSidebar(false)}
          className="w-full text-brown cursor-pointer flex items-center gap-2 py-10 h-12 text-xl font-bold mb-10"
          to="home" smooth={true} duration={500} offset={-100}
        >
          <MdArrowLeft className="w-10  h-10" />
          <p>Back</p>
        </ScrollLink>
        <div className="w-full p-3 flex flex-col items-start">
          <ScrollLink
            onClick={() => showSidebar(false)}
            className="text-brown flex items-center gap-2 w-full h-10 mb-6 py-3 font-bold text-lg hover:text-appleGreen"
            to="how-to-apply" smooth={true} duration={500} offset={-100}
          >
            <FaHome />
            <p>Application</p>
          </ScrollLink>
          <ScrollLink
            onClick={() => showSidebar(false)}
            className="text-brown flex items-center gap-2 w-full h-10 mb-6 py-3 font-bold text-lg hover:text-appleGreen"
            to="about" smooth={true} duration={500} offset={-100}
          >
            <RiHotelLine />
            <p>Our Solutions</p>
          </ScrollLink>
          <ScrollLink
            onClick={() => showSidebar(false)}
            className="text-brown flex items-center gap-2 w-full h-10 mb-6 py-3 font-bold text-lg hover:text-appleGreen"
            to="services" smooth={true} duration={500} offset={-100}
          >
            <GrServices />
            <p>Services</p>
          </ScrollLink>
        </div>
        <div className="w-full p-3">
          {
            localStorage.getItem('token') ? (
              <button
                onClick={() => {handleLogout() ; showSidebar(false)}}
                className="text-brown flex items-center gap-2 w-full h-10 mb-6 py-3 font-bold text-lg hover:text-appleGreen"
              >
                <BiLogOut/>
                <p>Logout</p>
              </button>
            ) : (
              <RouterLink
                to={'/signup'}
                onClick={() => showSidebar(false)}
                className="text-brown flex items-center gap-2 w-full h-10 mb-6 py-3 font-bold text-lg hover:text-appleGreen"
              >
                <FaUser/>
                <p>Sign up</p>
              </RouterLink>
            )
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;