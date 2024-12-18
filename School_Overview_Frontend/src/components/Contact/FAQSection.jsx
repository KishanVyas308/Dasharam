import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: "What are the school hours?",
    answer: "Our school hours are from 8:00 AM to 3:00 PM, Monday through Friday."
  },
  {
    question: "How can I apply for admission?",
    answer: "You can apply for admission through our online application portal on our website. If you need assistance, please contact our admissions office."
  },
  {
    question: "Do you offer financial aid?",
    answer: "Yes, we offer financial aid to eligible students. Please contact our financial aid office for more information on how to apply."
  },
  {
    question: "What extracurricular activities do you offer?",
    answer: "We offer a wide range of extracurricular activities including sports teams, music and art clubs, debate club, and various academic societies."
  }
]

const FAQSection = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-gray-800 mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQ key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}

const FAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      className="border border-gray-200 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-gray-700">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 bg-gray-50">
              <p className="text-gray-600">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FAQSection
