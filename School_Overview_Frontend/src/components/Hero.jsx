import React from 'react';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const Hero = () => {
  // School features
  const features = [
    'Experienced Faculty', 
    'Modern Facilities', 
    'Holistic Development', 
    'Global Perspective'
  ];

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Image Section with stacked effect */}
          <motion.div 
            className="lg:w-1/2 relative"
           
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative z-10">
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-teal-100 rounded-lg"></div>
              <div className="absolute -top-6 -left-6 w-full h-full bg-teal-600/10 rounded-lg"></div>
              <img
                src="images/school-campus.jpg"
                alt="School campus"
                className="relative z-10 rounded-lg shadow-xl w-full h-auto object-cover"
              />
              
              {/* Stats card overlapping the image */}
              <div className="absolute -bottom-10 right-0 md:-right-10 bg-white p-4 md:p-6 rounded-lg shadow-xl max-w-[200px]">
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-teal-100 p-2 rounded-full">
                    <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <span className="text-teal-600 font-bold text-xs uppercase tracking-wide">Since 2010</span>
                </div>
                <h4 className="text-gray-800 font-bold mb-1">Excellence in Education</h4>
                <p className="text-gray-500 text-sm">Building tomorrow's leaders today</p>
              </div>
            </div>
          </motion.div>

          {/* Text Section */}
          <motion.div 
            className="lg:w-1/2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-4">
              Our Legacy
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Building <span className="text-teal-600 relative">
                Brighter Futures
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-teal-600 rounded-full"></span>
              </span> Through Education
            </motion.h2>
            
            <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 leading-relaxed">
              Founded in 2010, our school has been a beacon of academic excellence and personal growth. 
              We believe in nurturing not just minds, but character, preparing students for the challenges 
              of tomorrow through innovative teaching methods and a supportive community.
            </motion.p>
            
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-y-4 gap-x-2 mb-10">
              {features.map((item, index) => (
                <div key={index} className="flex items-center text-gray-700">
                  <div className="bg-teal-100 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-wrap space-x-4">
              <a href="#" className="mb-4 bg-teal-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-teal-700 transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                Explore Programs
              </a>
              <a href="#" className="mb-4 bg-white text-teal-600 border border-teal-600 px-6 py-3 rounded-full font-semibold hover:bg-teal-50 transition duration-300">
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
