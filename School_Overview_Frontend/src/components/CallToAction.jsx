import React from 'react';
import { PhoneIcon } from '@heroicons/react/24/solid'; // Updated import for Heroicons v2

const CallToAction = () => {
  return (
    <section className="py-20 bg-[#0d9488] m-5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Ready to Talk to Us?
        </h2>
        <p className="text-xl text-white mb-8">
          We are just a call away. Reach out to us for any inquiries!
        </p>
        <div className="flex justify-center items-center space-x-4">
          {/* Phone Icon */}
          <PhoneIcon className="w-8 h-8 text-white animate-bounce" />
          
          {/* Call Button */}
          <a
            href="+91 6356689500" // Replace with actual phone number
            className="bg-white text-[#0d9488] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300 flex items-center space-x-2"
          >
            <span>Call For More Details</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
