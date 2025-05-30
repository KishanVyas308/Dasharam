import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Carousel items
const carouselItems = [
  {
    title: "Welcome to Our School",
    description: "Empowering minds, shaping futures",
    image: "images/IMG20230812083716.jpg",
    ctaText: "Explore Programs"
  },
  {
    title: "Excellence in Education",
    description: "Nurturing talent, fostering growth",
    image: "images/IMG20240224084843.jpg",
    ctaText: "Our Approach"
  },
  {
    title: "Innovative Learning",
    description: "Preparing students for tomorrow's challenges",
    image: "images/IMG20230812093738.jpg",
    ctaText: "Learn More"
  },
]

const CarouselHome = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Auto slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        handleNext()
      }
    }, 6000)
    return () => clearInterval(timer)
  }, [isAnimating])

  // Functions for navigation
  const handlePrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length)
    setTimeout(() => setIsAnimating(false), 700)
  }

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length)
    setTimeout(() => setIsAnimating(false), 700)
  }

  // Animation variants
  const slideVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1.0], // Custom easing
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1.0], // Custom easing
      },
    }),
  }

  // Content animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  // Direction for animations
  const [direction, setDirection] = useState(0)
  
  const navigateSlide = (newIndex) => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(newIndex > currentIndex ? 1 : -1)
    setCurrentIndex(newIndex)
    setTimeout(() => setIsAnimating(false), 700)
  }

  return (
    <div className="relative h-[600px] md:h-[700px] w-full overflow-hidden"> 
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Image with improved overlay gradient */}
          <div className="relative h-full">
            <img
              src={carouselItems[currentIndex].image}
              alt={carouselItems[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          </div>

          {/* Content container */}
          <div className="absolute inset-0 flex items-center justify-center px-4 md:px-10">
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="text-center max-w-4xl mx-auto"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
              >
                {carouselItems[currentIndex].title}
              </motion.h1>
              
              <motion.p
                variants={itemVariants}
                className="text-xl md:text-2xl text-white mb-10 max-w-2xl mx-auto opacity-90"
              >
                {carouselItems[currentIndex].description}
              </motion.p>
              
              <motion.div variants={itemVariants}>
                <a
                  href="#"
                  className="inline-block bg-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                >
                  {carouselItems[currentIndex].ctaText}
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel navigation dots */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-3 z-10">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-10' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            onClick={() => navigateSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Prev (left) Arrow Button */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 md:p-4 rounded-full hover:bg-white/20 transition-all duration-300 ease-in-out z-10"
        aria-label="Previous slide"
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
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 md:p-4 rounded-full hover:bg-white/20 transition-all duration-300 ease-in-out z-10"
        aria-label="Next slide"
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
