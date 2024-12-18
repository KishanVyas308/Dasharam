import React from 'react';
import { Link } from 'react-router-dom';
const Page404 = () => {
  return (
    <section className="page_404 py-20 bg-white font-serif">
      <div className="container mx-auto">
        <div className="flex justify-center items-center flex-col">
          <div className="four_zero_four_bg relative bg-cover bg-center w-full h-[500px] lg:h-[600px]"
               style={{ backgroundImage: 'url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)' }}>
            <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-white drop-shadow-lg animate-pulse">
              404
            </h1>
          </div>

          <div className="contant_box_404 text-center mt-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-800">Oops! You seem to be lost.</h3>
            <p className="text-lg lg:text-xl text-gray-600 mt-4">The page you're looking for doesn't exist or may have been moved.</p>

            <Link           to="/" 
              className="link_404 inline-block bg-teal-600 text-white font-semibold py-4 px-8 mt-8 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page404;
