import React, { useState, useEffect } from 'react'
import { IconButton } from '@material-tailwind/react'
import { motion, AnimatePresence } from 'framer-motion'

// Carousel items
const carouselItems = [
  {
    title: "Welcome to Our School",
    description: "Empowering minds, shaping futures",
    image: "images/IMG20230812083716.jpg",
  },
  {
    title: "Excellence in Education",
    description: "Nurturing talent, fostering growth",
    image: "images/IMG20240224084843.jpg",
  },
  {
    title: "Innovative Learning",
    description: "Preparing students for tomorrow's challenges",
    image: "images/IMG20230812093738.jpg",
  },
]

const CarouselHome = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Functions for navigation
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)
  }

  return (
    <div className="relative h-[500px] w-full overflow-hidden"> {/* Set your desired height */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={carouselItems[currentIndex].image}
            alt={carouselItems[currentIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <motion.h1
                className="text-5xl md:text-6xl font-bold text-white mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {carouselItems[currentIndex].title}
              </motion.h1>
              <motion.p
                className="text-xl text-white mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {carouselItems[currentIndex].description}
              </motion.p>
              <motion.button
                className="bg-[#0d9488] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#0b7c6f] transition duration-300"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel navigation dots */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Prev and Next buttons */}
    {/* Prev (left) Arrow Button */}
<button
  onClick={handlePrev}
  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-[#0d9488] p-4 rounded-full shadow-lg hover:bg-[#0b7c6f] hover:text-white transition-all duration-300 ease-in-out hover:scale-110 md:flex hidden"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
</button>

{/* Next (right) Arrow Button */}
<button
  onClick={handleNext}
  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-[#0d9488] p-4 rounded-full shadow-lg hover:bg-[#0b7c6f] hover:text-white transition-all duration-300 ease-in-out hover:scale-110 md:flex hidden"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
    />
  </svg>
</button>

    </div>
  )
}

export default CarouselHome
