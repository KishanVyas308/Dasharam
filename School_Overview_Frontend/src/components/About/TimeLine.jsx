import React from 'react'
import { motion } from 'framer-motion'

const timelineEvents = [
  { year: 2010, event: 'School founded with 50 students' },
  { year: 2015, event: 'Added new academic programs' },
  { year: 2018, event: 'Expanded campus' }
 
]

export default function TimeLine() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Journey</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#0d9488]"></div>
          
          {timelineEvents.map((event, index) => (
            <motion.div 
              key={index}
              className={`flex items-center mb-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <h3 className="text-2xl font-bold text-[#0d9488]">{event.year}</h3>
                <p className="text-gray-600">{event.event}</p>
              </div>
              <div className="w-2/12 flex justify-center">
                <div className="w-4 h-4 bg-[#0d9488] rounded-full"></div>
              </div>
              <div className="w-5/12"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}