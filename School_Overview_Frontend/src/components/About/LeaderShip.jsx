import React from 'react';
import { motion } from 'framer-motion';

const leadershipMembers = [
  { 
    name: 'Kishan Vyas', 
    role: 'Principal', 
    image: 'https://th.bing.com/th/id/OIP.T28rz2lEdLmgT5HyZwYQ8QHaHa?w=163&h=188&c=7&r=0&o=5&dpr=2&pid=1.7',
    description: 'Mr Vyas Smith brings over 20 years of experience in education leadership. Her vision for our school focuses on fostering innovation, inclusivity, and academic excellence.'
  },
  { 
    name: 'Nit Patel', 
    role: 'Chairman of the Board of Trustees', 
    image: 'https://th.bing.com/th/id/OIP.01_KY-hAeaP080zBtQJu8QHaHQ?w=197&h=193&c=7&r=0&o=5&dpr=2&pid=1.7',
    description: 'Nit Patel, a distinguished alumnus, has served on our board for 15 years. His strategic guidance has been instrumental in our school\'s growth and continued success.'
  },
];

const LeaderShip = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Leadership</h2>
        {leadershipMembers.map((member, index) => (
          <motion.div
            key={index}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center mb-16 last:mb-0`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <div className="md:w-1/3 mb-8 md:mb-0 transform transition duration-500 hover:scale-105">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-auto rounded-lg shadow-xl transform transition duration-300 ease-in-out hover:rotate-3"
              />
            </div>
            <div className={`md:w-2/3 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
              <h3 className="text-3xl font-semibold text-gray-800 mb-2 hover:text-[#0d9488] transition duration-300 ease-in-out">{member.name}</h3>
              <p className="text-[#0d9488] text-xl mb-4">{member.role}</p>
              <p className="text-gray-600 text-lg">{member.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LeaderShip;