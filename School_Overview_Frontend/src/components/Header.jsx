import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage menu open/close

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the menu state on click
  };

  return (
    <header className="bg-teal-600 text-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center p-5">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          {/* Logo Image */}
          <img src="dasharam_logo.png" alt="Logo" className="w-12 h-12 md:w-16 md:h-16  object-contain" />
          {/* Optional logo text, uncomment if needed */}
          {/* <Link to="/" className="text-2xl font-bold hover:text-teal-200">SchoolLogo</Link> */}
         <p style={{fontSize:'2em'}}> Dasaram</p>
        </div>

        {/* Desktop Menu (hidden on small screens) */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="hover:text-teal-200 transition-colors duration-300">Home</Link>
          <Link to="/About" className="hover:text-teal-200 transition-colors duration-300">About</Link>
          <Link to="/contact" className="hover:text-teal-200 transition-colors duration-300">Contact</Link>
          <Link to="/gallery" className="hover:text-teal-200 transition-colors duration-300">Gallery</Link>
          <Link to="/404" className="hover:text-teal-200 transition-colors duration-300">Achievements</Link>
          <Link to="https://dasaram-admin.pages.dev/login" className="hover:text-teal-200 transition-colors duration-300">Login</Link>
        </div>

        {/* Mobile Menu Button (hamburger icon) */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-white"
        >
          {/* Hamburger icon when the menu is closed */}
          {!isOpen && (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>

        {/* Mobile Menu (slides from the right) */}
        <div
          className={`fixed top-0 right-0 h-full w-1/2 bg-teal-600 transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}
        >
          {/* Close button inside the menu */}
          <button
            onClick={toggleMenu}
            className="absolute top-5 right-5 text-white focus:outline-none"
          >
            {/* Close icon (X) */}
            {isOpen && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            )}
          </button>

          {/* Menu Links */}
          <div className="flex flex-col space-y-4 p-5 pt-20">
            <Link to="/" onClick={toggleMenu} className="hover:text-teal-200 transition-colors duration-300">Home</Link>
            <Link to="/about" onClick={toggleMenu} className="hover:text-teal-200 transition-colors duration-300">About</Link>
            <Link to="/contact" onClick={toggleMenu} className="hover:text-teal-200 transition-colors duration-300">Contact</Link>
            <Link to="/gallery" onClick={toggleMenu} className="hover:text-teal-200 transition-colors duration-300">Gallery</Link>
            <Link to="/achievements" onClick={toggleMenu} className="hover:text-teal-200 transition-colors duration-300">Achievements</Link>
            <Link to="https://dasaram-admin.pages.dev/login" onClick={toggleMenu} className="hover:text-teal-200 transition-colors duration-300">Login</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
