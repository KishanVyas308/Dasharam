import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import CarouselHome from '../components/CarouselHome';
import FeaturedPrograms from '../components/FeaturedPrograms';
import CallToAction from '../components/CallToAction';
import Counter from '../components/Counter';
import TestimonialsCarousel from '../components/TestimonialsCarousel';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Carousel */}
      <section className="relative">
        <CarouselHome />
      </section>

      {/* Main Hero Content */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-white to-gray-50">
        <Hero />
      </section>

      {/* Featured Programs */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Our <span className="text-teal-600">Featured</span> Programs
          </h2>
          <FeaturedPrograms />
        </div>
      </section>

      {/* Counter Section */}
      <section className="py-16 bg-teal-500 bg-opacity-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Our <span className="text-teal-600">Achievements</span> In Numbers
          </h2>
          <Counter />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            What <span className="text-teal-600">Parents & Students</span> Say
          </h2>
          <TestimonialsCarousel />
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-700">
        <CallToAction />
      </section>
    </div>
  );
};

export default Home;
