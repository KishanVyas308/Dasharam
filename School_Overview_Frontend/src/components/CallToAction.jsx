import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const CallToAction = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-teal-500 opacity-20 rounded-full"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-teal-500 opacity-20 rounded-full"></div>
      
      <div className="container mx-auto px-4 py-16 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Join Our Educational Journey?
          </h2>
          
          <p className="text-xl text-white opacity-90 mb-10 leading-relaxed">
            Connect with us today to learn more about our programs and how we can help shape your child's future.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Contact Button */}
            <motion.a
              href="tel:+916356689500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-3 bg-white text-teal-600 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition duration-300 group w-full sm:w-auto"
            >
              <PhoneIcon className="w-6 h-6 group-hover:animate-pulse" />
              <span className="text-lg">+91 6356689500</span>
            </motion.a>
            
            {/* Visit Button */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-3 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition duration-300 w-full sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-lg">Visit Campus</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CallToAction;
