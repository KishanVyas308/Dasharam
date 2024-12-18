import React from 'react';

const highlights = [
  { title: 'Modern Library', image: 'https://i.pinimg.com/originals/08/b7/6e/08b76efb983bcd7e4064110882150724.jpg' },
  { title: 'Sports Complex', image: 'https://th.bing.com/th/id/OIP.Ub0-J11SFIhLNz1pR2KweQHaE8?w=201&h=180&c=7&r=0&o=5&dpr=2&pid=1.7' },
  { title: 'Science Labs', image: 'https://th.bing.com/th/id/OIP.hMkc-tYzqGNryz2Zn-iN2gHaE8?w=274&h=183&c=7&r=0&o=5&dpr=2&pid=1.7' },
  { title: 'Arts Center', image: 'https://th.bing.com/th/id/OIP.Nfks5EVyOZPlmegH60JV3QHaDy?w=337&h=180&c=7&r=0&o=5&dpr=2&pid=1.7' },
];

const CampusHighlights = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-center text-gray-700 mb-10">
          Campus Highlights
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover the core features of our school that contribute to a well-rounded education for our students.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-md bg-white transition duration-300 hover:shadow-lg"
            >
              <div className="relative">
                {/* Replaced next/image with standard img tag */}
                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-teal-600 transition duration-300">
                  {highlight.title}
                </h3>
              </div>
              {/* Hover effect */}
              <div className="absolute inset-0 bg-teal-700 bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <h3 className="text-white text-2xl font-bold text-center px-4">
                  {highlight.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampusHighlights;
