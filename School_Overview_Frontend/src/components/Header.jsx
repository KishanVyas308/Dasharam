import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.menu-button')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Active link style
  const activeLink = (path) => {
    return location.pathname === path ? 
      'text-white font-semibold border-b-2 border-white pb-1 transition-all duration-300' : 
      'text-teal-50 hover:text-white hover:border-b-2 hover:border-teal-200 pb-1 transition-all duration-300';
  };

  // Mobile active link style
  const mobileActiveLink = (path) => {
    return location.pathname === path ? 
      'bg-teal-500 text-white rounded-lg' : 
      'hover:bg-teal-600 hover:text-white transition-colors duration-200';
  };

  // Menu variant for animations
  const menuVariants = {
    closed: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.header 
      initial={false}
      animate={{ 
        backgroundColor: scrolled ? 'rgb(15, 118, 110)' : 'rgb(13, 148, 136)',
        height: scrolled ? 'auto' : 'auto',
        boxShadow: scrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
      }}
      transition={{ duration: 0.3 }}
      className="text-white sticky top-0 z-50 px-4 py-3 md:py-4"
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.img 
            src="/dasharam_logo.png" 
            alt="Dasaram Logo" 
            initial={false}
            animate={{ 
              width: scrolled ? '40px' : '50px',
              height: scrolled ? '40px' : '50px'
            }}
            transition={{ duration: 0.3 }}
            className="object-contain"
            whileHover={{ scale: 1.05 }}
          />
          <motion.h1 
            initial={false}
            animate={{ 
              fontSize: scrolled ? '1.25rem' : '1.5rem' 
            }}
            transition={{ duration: 0.3 }}
            className="font-bold tracking-wide"
          >
            Dasaram
            <span className="text-teal-200 ml-1 group-hover:text-white transition-colors duration-300">School</span>
          </motion.h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          {['/', '/About', '/contact', '/gallery', '/achievements'].map((path, index) => (
            <motion.div
              key={path}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <Link 
                to={path} 
                className={activeLink(path)}
              >
                {path === '/' ? 'Home' : path.substring(1).charAt(0).toUpperCase() + path.slice(2)}
              </Link>
            </motion.div>
          ))}
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="https://dasaram-admin.pages.dev/login" 
              className="bg-white text-teal-600 hover:bg-teal-50 px-5 py-2 rounded-full font-medium transition-colors duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              <span>Login</span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          onClick={toggleMenu}
          className="menu-button md:hidden focus:outline-none text-white p-2 rounded-md hover:bg-teal-500 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            ></path>
          </svg>
        </motion.button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setIsOpen(false)}
            ></motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="mobile-menu fixed top-0 right-0 h-full w-4/5 bg-gradient-to-br from-teal-700 to-teal-900 z-40 md:hidden shadow-2xl overflow-hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col h-full">
                <div className="p-5 border-b border-teal-600 flex justify-between items-center">
                  <motion.h2 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold text-white"
                  >
                    Menu
                  </motion.h2>
                  <motion.button
                    onClick={toggleMenu}
                    className="text-white focus:outline-none p-2 hover:bg-teal-600 rounded-full transition-colors"
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </motion.button>
                </div>

                {/* Menu Links */}
                <div className="flex flex-col flex-grow overflow-y-auto py-4">
                  <div className="flex flex-col px-5 space-y-1">
                    {[
                      { path: '/', name: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                      { path: '/about', name: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                      { path: '/contact', name: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                      { path: '/gallery', name: 'Gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
                      { path: '/achievements', name: 'Achievements', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' }
                    ].map((item, index) => (
                      <motion.div
                        key={item.path}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                      >
                        <Link 
                          to={item.path} 
                          onClick={toggleMenu} 
                          className={`py-3 px-4 ${mobileActiveLink(item.path)} rounded-lg flex items-center space-x-3 mb-1`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path>
                          </svg>
                          <span>{item.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <motion.div 
                  className="p-5 border-t border-teal-600"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      to="https://dasaram-admin.pages.dev/login" 
                      onClick={toggleMenu} 
                      className="w-full bg-white text-teal-700 hover:bg-teal-50 py-3 px-4 rounded-lg font-medium transition-colors duration-300 flex justify-center items-center shadow-md"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                      </svg>
                      Login
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
