import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaGraduationCap, FaChartBar, FaBook } from 'react-icons/fa'; // React Icons import

// Array of counters with labels, end values, and icons
const counters = [
  { label: 'Teachers', endValue: 50, suffix: '+', icon: FaUsers },
  { label: 'Students', endValue: 1000, suffix: '+', icon: FaGraduationCap },
  { label: 'Results', endValue: 90, suffix: '%', icon: FaChartBar },
  { label: 'Years of Experience', endValue: 30, suffix: '+', icon: FaBook },
];

// Counter component that increments the number
const Counters = ({ endValue, duration, suffix }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const incrementTime = duration / endValue * 1000; // Faster count by decreasing duration
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

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, [endValue, duration, suffix]);

  return <span className="text-4xl font-bold text-[#0d9488]">{count}</span>;
};

// CounterCard component for individual counter display
const CounterCard = ({ counter, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white rounded-lg shadow-md p-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-xl"
  >
    <div className="flex justify-center mb-4">
      <motion.div whileHover={{ rotate: 15 }} whileTap={{ scale: 0.95 }}>
        <counter.icon className="w-12 h-12 text-[#0d9488]" />
      </motion.div>
    </div>
    <Counters endValue={counter.endValue} duration={0.5} suffix={counter.suffix} />
    <p className="mt-2 text-gray-600 font-medium">{counter.label}</p>
  </motion.div>
);

// Main component that displays all the counters
const Counter = () => (
  <section className="bg-gradient-to-b from-gray-50 to-white py-12 lg:py-20 flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our School at a Glance</h2>
      {/* Center the grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-8 justify-center items-center">
        {counters.map((counter, index) => (
          <CounterCard key={index} counter={counter} index={index} />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-16 text-center"
      >
        {/* Additional content here */}
      </motion.div>
    </div>
  </section>
);

export default Counter;
