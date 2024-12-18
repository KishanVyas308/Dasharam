import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb, FaEye, FaHeart } from 'react-icons/fa'; // Importing icons from React Icons

const IconWrapper = ({ children }) => (
  <motion.div
    className="w-16 h-16 bg-[#0d9488] rounded-full flex items-center justify-center text-white mb-4 shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-110 hover:rotate-12"
    whileHover={{ scale: 1.1, rotate: 360 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default function AboutMVC() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Mission */}
          <motion.div
            className="text-center p-8 bg-white shadow-xl rounded-lg hover:shadow-2xl transform transition-transform duration-300 ease-in-out hover:scale-105"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <IconWrapper>
              <FaLightbulb className="w-8 h-8" />
            </IconWrapper>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To provide a nurturing environment that fosters academic excellence, personal growth, and social responsibility,
              empowering our students to become lifelong learners and compassionate global citizens.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            className="text-center p-8 bg-white shadow-xl rounded-lg hover:shadow-2xl transform transition-transform duration-300 ease-in-out hover:scale-105"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <IconWrapper>
              <FaEye className="w-8 h-8" />
            </IconWrapper>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To be a leading educational institution that inspires innovation, cultivates critical thinking,
              and prepares students to thrive in a rapidly changing world while making meaningful contributions to society.
            </p>
          </motion.div>

          {/* Core Values */}
          <motion.div
            className="text-center p-8 bg-white shadow-xl rounded-lg hover:shadow-2xl transform transition-transform duration-300 ease-in-out hover:scale-105"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <IconWrapper>
              <FaHeart className="w-8 h-8" />
            </IconWrapper>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Core Values</h2>
            <ul className="text-gray-600 text-lg leading-relaxed space-y-2">
              <li>Excellence in Education</li>
              <li>Integrity and Ethics</li>
              <li>Diversity and Inclusion</li>
              <li>Innovation and Creativity</li>
              <li>Community Engagement</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
