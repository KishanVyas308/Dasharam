import React from 'react';
import { motion } from 'framer-motion';
import { AcademicCapIcon, HomeModernIcon, LightBulbIcon, UsersIcon } from '@heroicons/react/24/outline';

const programs = [
  {
    name: 'Primary Education',
    icon: AcademicCapIcon,
    description: 'Building a strong foundation with our comprehensive primary education curriculum.',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    hoverColor: 'group-hover:bg-blue-600 group-hover:text-white',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Vocational Skills',
    icon: HomeModernIcon,
    description: 'Practical skills training for real-world applications and career preparedness.',
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    hoverColor: 'group-hover:bg-purple-600 group-hover:text-white',
    image: 'https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Community Education',
    icon: LightBulbIcon,
    description: 'Engaging programs that connect learning with community development and service.',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    hoverColor: 'group-hover:bg-amber-600 group-hover:text-white',
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'After-School Activities',
    icon: UsersIcon,
    description: 'Enriching extracurricular programs that foster talent, teamwork and creativity.',
    color: 'bg-green-50 text-green-600 border-green-200',
    hoverColor: 'group-hover:bg-green-600 group-hover:text-white',
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const FeaturedPrograms = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {programs.map((program, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
        >
          {/* Program image */}
          <div className="h-48 overflow-hidden">
            <img 
              src={program.image} 
              alt={program.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          
          {/* Icon overlay */}
          <div className="absolute top-4 right-4">
            <div className={`p-3 rounded-full ${program.color} border ${program.hoverColor} transition-colors duration-300`}>
              <program.icon className="w-6 h-6" />
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors duration-300">{program.name}</h3>
            <p className="text-gray-600 mb-5 flex-grow">{program.description}</p>
            
            <div className="mt-auto">
              <a
                href="#"
                className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors duration-300"
              >
                Learn More
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FeaturedPrograms;
