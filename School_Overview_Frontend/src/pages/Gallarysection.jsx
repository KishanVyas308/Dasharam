import React, { useEffect } from 'react'
import Gallary from '../components/Contact/Gallary'

const Gallarysection = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <div>
      <Gallary/>
    </div>
  )
}

export default Gallarysection
