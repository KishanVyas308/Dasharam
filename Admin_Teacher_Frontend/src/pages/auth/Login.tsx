'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import Cookies from 'js-cookie'
import { userAtom } from '../../state/userAtom'
import { FaUser, FaLock } from 'react-icons/fa'
import Lottie from 'react-lottie-player'
import axios from 'axios'

// Import Lottie animations
import loginAnimation from './login-animation.json'
import successAnimation from './success-animation.json'
import { toast } from 'react-toastify'
import { BACKEND_URL } from '../../config'

const InputField = ({ icon: Icon, ...props }: { icon: any; [key: string]: any }) => (
  <div className="relative">
    <Icon className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
    <input
      {...props}
      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
    />
  </div>
)

export default function Login() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [currentAdmin, setCurrentAdmin] = useRecoilState<any>(userAtom)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
 

    try {

      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        name,
        password
      })

      
    if(response.status != 200) {
      setIsLoading(false)
      toast.error(response.data.message)
      return
    }

    const admin = response.data.data
      Cookies.set('user', JSON.stringify(admin), { expires: 0.25 }) // 6 hours
      setCurrentAdmin(admin)
      setIsSuccess(true)
      console.log(admin)
      localStorage.setItem('token', admin.token)
      console.log(localStorage.getItem('token'))
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error : any) {
      setIsLoading(false)
      toast.error(error.response.data.message)
    }

  
  }

  useEffect(() => {
    
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-blue-600 to-blue-500 p-6 relative overflow-hidden">
      {/* Background pattern overlay - academic pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.25\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundSize: '24px 24px'
          }}
        ></div>
      </div>

      {/* Subtle educational-themed floating elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden relative z-10">
        {/* Left panel - Educational theme */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-gradient-to-b from-blue-50 to-white relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full -ml-16 -mt-16 opacity-70"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-100 rounded-full -mr-20 -mb-20 opacity-70"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="mb-8 flex justify-center rounded-full md:justify-start">
              {/* <img 
                src="/dasharam_logo.jpg" 
                alt="Dasharam School Logo" 
                className="h-16 object-contain roufu" 
              /> */}
            </div>
            <h1 className="text-4xl font-bold text-blue-800 mb-4">School Administration Portal</h1>
            <p className="text-gray-600 mb-6 text-lg">Welcome to the Dasharam School management system. Login to access student records, manage curriculum, and track academic progress.</p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-white rounded-lg p-4 shadow-md border border-blue-100 flex items-center space-x-3 w-full sm:w-auto">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Track Test Records</span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md border border-blue-100 flex items-center space-x-3 w-full sm:w-auto">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Manage Students & Teachers</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative z-10 mt-6"
          >
            <Lottie
              loop
              animationData={loginAnimation}
              play
              style={{ width: '100%', height: '220px' }}
            />
          </motion.div>
        </div>

        {/* Right panel (form) - Professional school theme */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Staff Login</h2>
              <p className="text-gray-500 mt-1">Access your administrative dashboard</p>
              <div className="h-1 w-20 bg-blue-600 mx-auto mt-3 rounded-full"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your username"
                    required
                    disabled={isLoading || isSuccess}
                    className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading || isSuccess}
                    className="block w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                      :
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    }
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition duration-300 flex items-center justify-center font-semibold shadow-md"
                  disabled={isLoading || isSuccess}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </motion.button>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Dasharam School. All rights reserved.</p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl"
            >
              <Lottie
                loop={false}
                animationData={successAnimation}
                play
                style={{ width: 150, height: 150, margin: '0 auto' }}
              />
              <h3 className="text-xl font-bold text-center text-blue-700 mt-4">Login Successful!</h3>
              <p className="text-center text-gray-600 mt-2">Welcome back to Dasharam School</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-6 overflow-hidden">
                <motion.div 
                  className="bg-blue-600 h-full rounded-full" 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}