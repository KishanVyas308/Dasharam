import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaGraduationCap, FaChartBar, FaBook } from 'react-icons/fa';

// Array of counters with labels, end values, and icons
const counters = [
  { label: 'Teachers', endValue: 25, suffix: '+', icon: FaUsers, color: 'from-teal-400 to-teal-600' },
  { label: 'Students', endValue: 370, suffix: '+', icon: FaGraduationCap, color: 'from-blue-400 to-blue-600' },
  { label: 'Results', endValue: 90, suffix: '%', icon: FaChartBar, color: 'from-purple-400 to-purple-600' },
  { label: 'Years of Experience', endValue: 15, suffix: '+', icon: FaBook, color: 'from-amber-400 to-amber-600' },
];

// Counter component that increments the number
const Counters = ({ endValue, duration, suffix }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const incrementTime = duration / endValue * 1000;
    let start = 0;
    const end = parseInt(endValue);
    
    const timer = setInterval(() => {
      if (start < end) {
        start += 1;
        setCount(`${start}${suffix}`);
      } else {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [endValue, duration, suffix]);

  return <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">{count}</span>;
};

// CounterCard component for individual counter display
const CounterCard = ({ counter, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="relative bg-white rounded-2xl shadow-xl p-8 text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl group overflow-hidden"
  >
    {/* Decorative gradient background that animates on hover */}
    <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${counter.color} group-hover:h-full transition-all duration-500 opacity-80 group-hover:opacity-10`}></div>
    
    <div className="relative z-10">
      <div className="flex justify-center mb-6">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }} 
          whileTap={{ scale: 0.95 }}
          className={`p-4 rounded-full bg-gradient-to-r ${counter.color} text-white`}
        >
          <counter.icon className="w-10 h-10" />
        </motion.div>
      </div>
      <Counters endValue={counter.endValue} duration={0.5} suffix={counter.suffix} />
      <p className="mt-3 text-gray-700 font-medium text-lg">{counter.label}</p>
    </div>
  </motion.div>
);

// Main component that displays all the counters
const Counter = () => (
  <section className="relative py-16">
    {/* Background decorative elements */}
    <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-70"></div>
    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-teal-50 to-transparent"></div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {counters.map((counter, index) => (
          <CounterCard key={index} counter={counter} index={index} />
        ))}
      </div>
      
      {/* Achievement highlight */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-16 text-center"
      >
        <div className="inline-flex items-center justify-center px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Growing stronger every year
        </div>
      </motion.div>
    </div>
  </section>
);

export default Counter;
