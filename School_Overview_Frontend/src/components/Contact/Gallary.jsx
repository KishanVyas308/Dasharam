import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaImage, FaYoutube, FaTimes, FaExpand } from 'react-icons/fa'

const galleryItems = [
  // { type: 'image', src: '/placeholder.svg?height=400&width=600', alt: 'School campus', category: 'Campus' },
  // { type: 'video', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'School promotional video', category: 'Events' },
  // { type: 'image', src: '/placeholder.svg?height=400&width=600', alt: 'Students in classroom', category: 'Academics' },
  // { type: 'video', src: 'https://www.youtube.com/embed/C0DPdy98e4c', title: 'Virtual tour', category: 'Campus' },
  // { type: 'image', src: '/placeholder.svg?height=400&width=600', alt: 'Sports event', category: 'Athletics' },
  // { type: 'image', src: '/placeholder.svg?height=400&width=600', alt: 'Art exhibition', category: 'Arts' },
  // { type: 'image', src: '/placeholder.svg?height=400&width=600', alt: 'Science fair', category: 'Academics' },
  // { type: 'image', src: '/placeholder.svg?height=400&width=600', alt: 'Graduation ceremony', category: 'Events' },
]

const categories = ['All', ...new Set(galleryItems.map(item => item.category))]

export default function Gallary() {
  const [selectedItem, setSelectedItem] = useState(null)
  const [filter, setFilter] = useState('All')

  const filteredItems = filter === 'All' ? galleryItems : galleryItems.filter(item => item.category === filter)

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-gray-800 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Gallery
        </motion.h2>

        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                filter === category ? 'bg-[#0d9488] text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              onClick={() => setFilter(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          layout
        >
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={index}
                className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group"
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedItem(item)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                layout
              >
                {item.type === 'image' ? (
                  <img src={item.src} alt={item.alt} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <FaYoutube className="text-6xl text-red-600 transition-transform duration-300 group-hover:scale-125" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-2xl transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {item.type === 'image' ? <FaImage /> : <FaYoutube />}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">{item.category}</p>
                  <p className="text-xs">{item.alt || item.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                <FaTimes className="text-2xl" />
              </button>
              {selectedItem.type === 'image' ? (
                <img src={selectedItem.src} alt={selectedItem.alt} className="w-full h-auto rounded-lg shadow-lg" />
              ) : (
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={selectedItem.src}
                    title={selectedItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-gray-800">{selectedItem.alt || selectedItem.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedItem.category}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}