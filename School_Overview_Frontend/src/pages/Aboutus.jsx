import React, { useEffect } from 'react'
import LeaderShip from '../components/About/LeaderShip'
import HeroSection from '../components/About/HeroSection'
import AboutMVC from '../components/About/ABoutMVC'
import Counter from '../components/Counter'
import TimeLine from '../components/About/TimeLine'

const Aboutus = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div>
        <HeroSection/>
        <TimeLine/>
        <AboutMVC/>
     
      <LeaderShip/>
      <Counter/>
    </div>
  )
}

export default Aboutus
