import React from 'react';
import schoolImage from '../assets/1.jpeg'; // Correctly import the image file

const Hero = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Image Section */}
          <div className="md:w-1/2 mb-10 md:mb-0">
            <img
              src="public/images/IMG20230805105702.jpg" // Use the imported image variable
              alt="School campus"
              className="rounded-lg shadow-lg w-full h-auto object-fill"
            />
          </div>

          {/* Text Section */}
          <div className="md:w-1/2 md:pl-10">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">About Our School</h2>
            <p className="text-gray-600 mb-6">
              Founded in 2010, our school has been a beacon of academic excellence and personal growth. 
              We believe in nurturing not just minds, but character, preparing students for the challenges 
              of tomorrow.
            </p>
            <ul className="space-y-2">
              {['Experienced Faculty', 'State-of-the-art Facilities', 'Holistic Development', 'Global Perspective'].map((item, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-[#0d9488] mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
