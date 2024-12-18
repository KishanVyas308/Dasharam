import React from 'react'
import Hero from '../components/Hero'
import CarouselHome from '../components/CarouselHome'
import FeaturedPrograms from '../components/FeaturedPrograms'
import CampusHighlights from '../components/CampusHighlights'
import CallToAction from '../components/CallToAction'
import Counter from '../components/Counter'
import TestimonialsCarousel from '../components/TestimonialsCarousel'
import UpcomingEvents from '../components/UpcomingEvents'
const Home = () => {
  return (
    <div>
        <CarouselHome/>
      <Hero/>
      <FeaturedPrograms/>
      <CallToAction/>
    <CampusHighlights/>
    <Counter/>
    <TestimonialsCarousel/>
    <UpcomingEvents/>
    </div>
  )
}

export default Home
