import React from 'react';
import { AcademicCapIcon, HomeModernIcon, LightBulbIcon, UsersIcon } from '@heroicons/react/24/outline'; // Icons to fit the school context

const programs = [
  {
    name: 'Primary Education',
    icon: AcademicCapIcon,
    description: 'Basic education for children in our local village school.',
  },
  {
    name: 'Vocational Skills',
    icon: HomeModernIcon,
    description: 'Training for skills such as carpentry, farming, and crafts.',
  },
  {
    name: 'Community Education',
    icon: LightBulbIcon,
    description: 'Programs aimed at improving literacy and practical knowledge for adults.',
  },
  {
    name: 'After-School Activities',
    icon: UsersIcon,
    description: 'Sports, arts, and other activities to engage students outside of regular classes.',
  },
];

const FeaturedPrograms = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Featured Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              {/* Icon with animation */}
              <program.icon className="w-12 h-12 text-[#0d9488] mb-4 transition-transform transform hover:rotate-12" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{program.name}</h3>
              <p className="text-gray-600 mb-4">{program.description}</p>
              <a
                href="#"
                className="text-[#0d9488] hover:text-[#075f4f] font-semibold transition-colors duration-200"
              >
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;
