import React, { useEffect } from 'react'
import Hero from '../components/Hero'
import CarouselHome from '../components/CarouselHome'
import FeaturedPrograms from '../components/FeaturedPrograms'

import CallToAction from '../components/CallToAction'
import Counter from '../components/Counter'
import TestimonialsCarousel from '../components/TestimonialsCarousel'

const Home = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div>
        <CarouselHome/>
      <Hero/>
      <FeaturedPrograms/>
      <CallToAction/>
  
    <Counter/>
    <TestimonialsCarousel/>

    </div>
  )
}

export default Home
