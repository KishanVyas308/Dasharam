import React from 'react'
import { motion } from 'framer-motion'

const ContactForm = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Send us a message
      </h2>
      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring focus:ring-[#0d9488] focus:ring-opacity-50 p-3"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring focus:ring-[#0d9488] focus:ring-opacity-50 p-3"
            placeholder="Your Email"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring focus:ring-[#0d9488] focus:ring-opacity-50 p-3"
            placeholder="Subject"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0d9488] focus:ring focus:ring-[#0d9488] focus:ring-opacity-50 p-3"
            placeholder="Your Message"
          />
        </div>
        <motion.button
          type="submit"
          className="w-full bg-[#0d9488] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#0b7c6f] transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send Message
        </motion.button>
      </form>
    </motion.div>
  )
}

export default ContactForm
