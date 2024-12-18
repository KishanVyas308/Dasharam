import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Testimonial data
const testimonials = [
  {
    quote: "My experience at this school has been transformative. The teachers are passionate and the opportunities are endless.",
    name: "Nit Patel",
    role: "Alumni, Class of 2020"
  },
  {
    quote: "The school's commitment to academic excellence and personal growth is unparalleled. It's been a joy to watch my child thrive here.",
    name: "Kishan Vyas",
    role: "Parent"
  },
  {
    quote: "As a teacher, I'm proud to be part of an institution that truly puts students first and fosters a love for learning.",
    name: "Yash Fadadu",
    role: "Faculty Member"
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
    <section className="py-20 bg-gradient-to-r from-teal-500 to-teal-700">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">What People Say</h2>
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            {/* The carousel container */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <blockquote className="bg-white p-10 rounded-xl shadow-2xl text-center transform hover:scale-105 transition-transform duration-300">
                    <p className="text-xl text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                    <footer className="text-gray-900">
                      <p className="font-semibold text-lg">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
          {/* Navigation buttons */}
          <button
            onClick={prev}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-teal-600 text-white rounded-full p-3 shadow-xl hover:bg-teal-700 transition duration-300"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-teal-600 text-white rounded-full p-3 shadow-xl hover:bg-teal-700 transition duration-300"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
