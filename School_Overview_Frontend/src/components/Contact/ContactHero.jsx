import React from 'react'
import { motion } from 'framer-motion'

export default function ContactHero() {
  return (
    <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://c1.wallpaperflare.com/preview/968/730/441/building-cheyenne-photos-high-school.jpg"
          alt="School campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10 text-center text-white">
        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Contact Us
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          We're here to answer your questions
        </motion.p>
      </div>
    </section>
  )
}