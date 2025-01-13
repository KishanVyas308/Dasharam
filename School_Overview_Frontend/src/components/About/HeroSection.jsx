import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="public/images/IMG20230805081716.jpg"
          alt="School campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        {/* Title */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4 hover:text-[#0d9488] transition duration-300 ease-in-out"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Our School
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl hover:text-[#0d9488] transition duration-300 ease-in-out"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Nurturing minds, inspiring futures since 2010
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
