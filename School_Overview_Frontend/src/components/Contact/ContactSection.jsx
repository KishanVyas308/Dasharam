import React from 'react'
import { motion } from 'framer-motion'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaRegClock, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'

const contactDetails = [
  { icon: FaPhoneAlt, info: '+1 (123) 456-7890', label: 'Call us:' },
  { icon: FaEnvelope, info: 'info@yourschool.edu', label: 'Email us:' },
  { icon: FaMapMarkerAlt, info: '123 School St, City, State 12345', label: 'Visit us:' },
  { icon: FaRegClock, info: 'Mon-Fri: 8am-4pm', label: 'Office Hours:' },
]

const socialMedia = [
  { icon: FaFacebookF, link: 'https://facebook.com' },
  { icon: FaTwitter, link: 'https://twitter.com' },
  { icon: FaInstagram, link: 'https://instagram.com' },
  { icon: FaLinkedinIn, link: 'https://linkedin.com' },
]

export default function ContactSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-gray-800 mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Get in Touch
        </motion.h2>

        <motion.div
          className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left Section: Contact Info */}
          <div className="lg:w-2/5 w-full p-8 bg-gradient-to-br from-[#0d9488] to-[#0b7c6f] text-white">
            <h3 className="text-2xl font-semibold mb-6">Contact Details</h3>
            <div className="space-y-6">
              {contactDetails.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{item.label}</p>
                    <p className="text-gray-100">{item.info}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-12">
              <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socialMedia.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section: Map */}
          <div className="lg:w-3/5 w-full">
            <div className="h-full relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1857.6257004881352!2d70.5185025!3d21.3800036!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be2abdc4c551381%3A0x26cedc8bccdc0cac!2sDasaram%20Shaikshnik%20Sankul!5e0!3m2!1sen!2sin!4v1736494987664!5m2!1sen!2sin" 
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
              <motion.div 
                className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Visit Our Campus</h4>
                <p className="text-gray-600">Experience our state-of-the-art facilities and meet our dedicated staff.</p>
                <motion.button 
                  className="mt-3 px-4 py-2 bg-[#0d9488] text-white rounded-md hover:bg-[#0b7c6f] transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Schedule a Tour
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}