import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// Testimonial data
const testimonials = [
  {
    quote: "My experience at this school has been transformative. The teachers are passionate and the opportunities are endless.",
    name: "Nit Patel",
    role: "Alumni, Class of 2020",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg" // Placeholder avatars
  },
  {
    quote: "The school's commitment to academic excellence and personal growth is unparalleled. It's been a joy to watch my child thrive here.",
    name: "Kishan Vyas",
    role: "Past Student",
    avatar: "https://randomuser.me/api/portraits/men/47.jpg"
  },
  {
    quote: "As a teacher, I'm proud to be part of an institution that truly puts students first and fosters a love for learning.",
    name: "Mansi Vyas",
    role: "Faculty Member",
    avatar: "https://randomuser.me/api/portraits/women/26.jpg"
  }
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Next and previous handlers
  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            {/* The carousel container */}
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 md:p-12 rounded-2xl shadow-xl">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-full md:w-1/3 flex justify-center">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-500 shadow-lg">
                          <img 
                            src={testimonials[currentIndex].avatar} 
                            alt={testimonials[currentIndex].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white rounded-full p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-2/3">
                      <svg className="w-12 h-12 text-teal-500 opacity-20 mb-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="text-xl md:text-2xl text-gray-700 mb-6 italic leading-relaxed">"{testimonials[currentIndex].quote}"</p>
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-bold text-xl text-gray-900">{testimonials[currentIndex].name}</h4>
                        <p className="text-teal-600">{testimonials[currentIndex].role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation buttons */}
          <button
            onClick={prev}
            className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 bg-white text-teal-600 rounded-full p-3 shadow-lg hover:bg-teal-600 hover:text-white transition duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 bg-white text-teal-600 rounded-full p-3 shadow-lg hover:bg-teal-600 hover:text-white transition duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Dots navigation */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-teal-600 w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
